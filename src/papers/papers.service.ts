import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';
import { Paper, PaperState, Process } from '../domain/entities/paper.entity';
import { PapersRepository } from '../domain/repositories/papers.repository';
import { UsersRepository } from '../domain/repositories/users.repository';
import { TopicsRepository } from '../domain/repositories/topics.repository';
import { UsersService } from '../users/users.service';
import { ChangeStateDto } from './dto/change-state.dto';
import { WebUsersRepository } from '../domain/repositories/web-users.repository';
import { AddCommentDto } from './dto/add-comment.dto';
import { PaperCommentsRepository } from '../domain/repositories/papers-comments.repository';
import { PaperComentary } from '../domain/entities/paper-comentary.entity';
import { PaperAuthorsRepository } from '../domain/repositories/paper-authors.repository';
import { PaperAuthor } from '../domain/entities/paper-author.entity';
import { CountriesService } from '../common/services/countries.service';
import { CategoriesRepository } from '../domain/repositories/categories.repository';
import { MailService } from '../common/services/mail.service';
import { RoleCodes } from '../domain/entities/role.entity';
import { WebUser } from '../domain/entities/web-user.entity';
import { LoginOrigin } from '../auth/auth.service';
import { In, Not } from 'typeorm';
import { UploadFullFileDto } from './dto/upload-full-file.dto';
import { paperMapper } from './mappers/paper.mapper';
import { RateDto } from './dto/rate.dto';

@Injectable()
export class PapersService {
  constructor(
    private readonly papersRepository: PapersRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly topicsRepository: TopicsRepository,
    private readonly usersService: UsersService,
    private readonly webUsersRepository: WebUsersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly paperCommentsReposiitory: PaperCommentsRepository,
    private readonly paperAuthorsRepository: PaperAuthorsRepository,
    private readonly countriesService: CountriesService,
    private readonly mailService: MailService,
  ) {}

  async findAll({ onlyActive } = { onlyActive: false }) {
    const loggedUser = this.usersService.getLoggedUser();
    const user = await this.usersRepository.findById(loggedUser.id);
    let where = {};
    if (onlyActive) {
      where = { isActive: true };
    }
    if (user.role.id === RoleCodes.ADMIN) {
      where['state'] = Not(In([PaperState.REGISTERED]));
    }
    if (user.role.id === RoleCodes.LIDER) {
      where['leaderId'] = user.id;
      where['state'] = Not(In([PaperState.REGISTERED, PaperState.RECEIVED]));
    }
    if (user.role.id === RoleCodes.REVISOR) {
      where['reviewerUserId'] = user.id;
      where['state'] = Not(
        In([PaperState.REGISTERED, PaperState.RECEIVED, PaperState.SENT]),
      );
    }
    const papers = await this.papersRepository.repository.find({
      where,
      relations: ['authors'],
    });
    return papers.map((p) => paperMapper(p));
  }

  async findOne(id: number, { onlyActive } = { onlyActive: false }) {
    let where = { id };
    if (onlyActive) {
      where['isActive'] = true;
    }
    const paper = await this.papersRepository.repository.findOne({
      where,
      relations: ['webUser', 'reviewerUser', 'topic', 'authors'],
    });
    if (!paper) {
      throw new NotFoundException('Paper not found');
    }
    return paper;
  }

  async create(body: CreatePaperDto) {
    const { authors, webUserId, ...createPaperDto } = body;
    const { topicId, categoryId } = createPaperDto;
    const loggedUser = this.usersService.getLoggedUser();
    const loginOrigin = this.usersService.getLoginOrigin();
    const isBackOffice = loginOrigin === LoginOrigin.BACKOFFICE;
    let webUser: WebUser;
    if (isBackOffice) {
      if (!webUserId) {
        throw new BadRequestException('Web User id is required');
      }
      webUser = await this.webUsersRepository.repository.findOne({
        where: { id: webUserId },
      });
    } else {
      webUser = await this.webUsersRepository.repository.findOne({
        where: { id: loggedUser.id },
      });
    }
    if (!webUser) {
      throw new NotFoundException('Web User not found');
    }
    const category = await this.categoriesRepository.repository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const topic = await this.topicsRepository.repository.findOne({
      where: { id: topicId },
    });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
    const lastRegister = await this.papersRepository.repository
      .createQueryBuilder('paper')
      .withDeleted()
      .orderBy(
        "CAST(SUBSTRING(paper.correlative FROM '[0-9]+') AS INTEGER)",
        'DESC',
      )
      .getOne();

    let correlative = 'TT-1';
    if (lastRegister?.correlative) {
      const parts = lastRegister.correlative.split('-');
      const number = +parts[1];
      correlative = `TT-${number + 1}`;
    }
    const paper: Paper = {
      ...createPaperDto,
      state: PaperState.REGISTERED,
      correlative,
      createdAt: new Date(),
      topic,
      process: Process.PRESELECCIONADO,
      webUser,
      category,
    };
    if (isBackOffice) {
      paper.state = PaperState.RECEIVED;
      paper.receivedDate = new Date();
    }
    try {
      const createdPaper = await this.papersRepository.repository.save(paper);
      for (const author of authors) {
        const paperAuthor: PaperAuthor = {
          ...author,
          paper,
          paperId: createdPaper.id,
        };
        await this.paperAuthorsRepository.repository.save(paperAuthor);
      }
      return paperMapper(
        { ...createdPaper, authors: authors as PaperAuthor[] },
        { withAuthors: true },
      );
    } catch (error) {
      if (error.code === '23505') {
        // código de error de violación de unique constraint en PostgreSQL
        throw new ConflictException('El título ya está en uso.');
      }
      throw error;
    }
  }

  async update(id: number, body: UpdatePaperDto) {
    console.log('Actualizando paper ' + id);
    const loggedUser = this.usersService.getLoggedUser();
    const loginOrigin = this.usersService.getLoginOrigin();
    const paper = await this.findOne(id);
    if (loginOrigin === LoginOrigin.FRONTEND) {
      const webUser = await this.webUsersRepository.repository.findOne({
        where: { id: loggedUser.id },
      });
      if (!webUser) {
        throw new NotFoundException('Web User not found');
      }
      delete body.webUserId;
      if (paper.webUserId !== webUser.id) {
        throw new UnauthorizedException(
          'You are not allowed to update this paper',
        );
      }
    }
    const { authors, ...updatePaperDto } = body;
    const { topicId, categoryId } = updatePaperDto;
    if (topicId && paper.topic.id !== topicId) {
      const topic = await this.topicsRepository.repository.findOne({
        where: { id: topicId },
      });
      if (!topic) {
        throw new NotFoundException('Topic not found');
      }
      paper.topic = topic;
    }
    if (categoryId && paper.category.id !== categoryId) {
      const category = await this.categoriesRepository.repository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      paper.category = category;
    }
    const updatedPaper = {
      ...paper,
      ...updatePaperDto,
      updatedAt: new Date(),
    };
    await this.papersRepository.repository.update(id, updatedPaper);

    //eliminar autores que no estén en la lista
    const currentAuthors = await this.paperAuthorsRepository.repository.find({
      where: { paperId: id },
    });
    if (authors?.length > 0) {
      for (const currentAuthor of currentAuthors) {
        const found = authors.find((a) => a.id === currentAuthor.id);
        if (!found) {
          await this.paperAuthorsRepository.repository.softDelete(
            currentAuthor.id,
          );
        }
      }
      for (const author of authors) {
        if (author.id) {
          const authorModel =
            await this.paperAuthorsRepository.repository.findOne({
              where: { id: author.id },
            });
          if (!authorModel) {
            throw new NotFoundException('Author not found');
          }
          const newAuthor: PaperAuthor = {
            ...authorModel,
            ...author,
          };
          await this.paperAuthorsRepository.repository.update(
            author.id,
            newAuthor,
          );
        } else {
          const newAuthor: PaperAuthor = {
            ...author,
            paper,
            paperId: updatedPaper.id,
          };
          await this.paperAuthorsRepository.repository.save(newAuthor);
        }
      }
    }

    // return updatedPaper;
    return paperMapper(
      { ...updatedPaper, authors: authors as PaperAuthor[] },
      { withAuthors: true },
    );
  }

  async remove(id: number) {
    this.papersRepository.repository.softDelete(id);
    return null;
  }

  async changeStatus(id: number, changeStateDto: ChangeStateDto) {
    const { state, reviewerUserId, leaderId, type } = changeStateDto;
    const loggedUser = this.usersService.getLoggedUser();
    const loginOrigin = this.usersService.getLoginOrigin();
    // if (loginOrigin !== LoginOrigin.BACKOFFICE && state !== PaperState.RECEIVED) {
    //   throw new UnauthorizedException('Only backoffice can change the state of a paper');
    // }
    const paper = await this.findOne(id);
    const { process } = paper;
    const isPreSelected = process === Process.PRESELECCIONADO;
    const invalidStateCode = 'INVALID_STATE';
    switch (state) {
      case PaperState.RECEIVED:
        // Validamos si el estado actual es REGISTERED o si viene de un estado APPROVED con proceso PRESELECCIONADO
        if (paper.state !== PaperState.REGISTERED) {
          if (paper.state === PaperState.APPROVED && isPreSelected) {
            // Si el paper está aprobado y es preseleccionado, se cambia a ASSIGNED
            paper.state = PaperState.ASSIGNED;
            paper.process = Process.SELECCIONADO;
            paper.selectedAssignedDate = new Date();
          } else {
            throw new BadRequestException({
              code: invalidStateCode,
              message: 'Paper must be registered to be received',
            });
          }
        } else {
          // Si el paper está registrado, el cambio es el flujo normal
          paper.state = state;
          if (isPreSelected) {
            paper.receivedDate = new Date();
          } else {
            paper.selectedReceivedDate = new Date();
          }
        }

        if (paper.process === Process.PRESELECCIONADO) {
          await this.mailService.sendPaperUpdateStatusEmail({
            paper,
            to: paper.webUser.email,
          });
        }
        break;
      case PaperState.SENT:
        if (paper.state !== PaperState.RECEIVED) {
          throw new BadRequestException({
            code: invalidStateCode,
            message: 'Paper must be received to be sent',
          });
        }
        //TODO: validate that the action is done by the admin
        if (loggedUser.role.id !== RoleCodes.ADMIN) {
          throw new UnauthorizedException('Only admin can send a paper');
        }
        paper.state = state;
        if (isPreSelected) {
          paper.sentDate = new Date();
        } else {
          paper.selectedSentDate = new Date();
        }
        if (!leaderId) {
          throw new BadRequestException(
            'Leader id is required to send a paper',
          );
        }
        const leader = await this.usersRepository.findById(leaderId);
        if (!leader) {
          throw new NotFoundException('Leader not found');
        }
        paper.leader = leader;
        break;
      case PaperState.ASSIGNED:
        if (
          loginOrigin === LoginOrigin.BACKOFFICE &&
          loggedUser.id !== paper.leaderId
        ) {
          throw new UnauthorizedException('Only leader can assign a paper');
        }
        if (
          loginOrigin === LoginOrigin.FRONTEND &&
          loggedUser.id !== paper.webUserId
        ) {
          throw new UnauthorizedException('Only the author can assign a paper');
        }
        const isFirstAsignation = paper.state !== PaperState.APPROVED;
        paper.state = state;
        if (isFirstAsignation) {
          paper.assignedDate = new Date();
        } else {
          if (!paper.fullFileUrl) {
            throw new BadRequestException(
              'Full file is required to assign a paper',
            );
          }
          paper.process = Process.SELECCIONADO;
          paper.selectedAssignedDate = new Date();
        }
        if (!reviewerUserId) {
          throw new BadRequestException('Reviewer user id is required');
        }
        const reviewerUser =
          await this.usersRepository.findById(reviewerUserId);
        if (!reviewerUser) {
          throw new NotFoundException('Reviewer user not found');
        }
        paper.reviewerUser = reviewerUser;
        break;
      case PaperState.UNDER_REVIEW:
        if (loginOrigin !== LoginOrigin.BACKOFFICE) {
          throw new UnauthorizedException(
            'Only backoffice can change the state to under review',
          );
        }
        if (paper.state !== PaperState.ASSIGNED) {
          throw new BadRequestException({
            code: invalidStateCode,
            message: 'Paper must be assigned to be under review',
          });
        }
        if (
          loggedUser.id !== paper.reviewerUserId &&
          loggedUser.id !== paper.leaderId
        ) {
          throw new UnauthorizedException(
            'Only reviewer or leader can review a paper',
          );
        }
        paper.state = state;
        if (isPreSelected) {
          paper.reviewedDate = new Date();
        } else {
          paper.selectedReviewedDate = new Date();
        }
        break;
      case PaperState.APPROVED:
        if (loginOrigin !== LoginOrigin.BACKOFFICE) {
          throw new UnauthorizedException(
            'Only backoffice can change the state to under review',
          );
        }
        if (paper.state !== PaperState.UNDER_REVIEW) {
          throw new BadRequestException({
            code: invalidStateCode,
            message: 'Paper must be under review to be approved',
          });
        }
        if (
          loggedUser.id !== paper.reviewerUserId &&
          loggedUser.id !== paper.leaderId
        ) {
          throw new UnauthorizedException(
            'Only reviewer or leader can approve a paper',
          );
        }
        paper.state = state;
        if (isPreSelected) {
          paper.approvedDate = new Date();
        } else {
          if (!type) {
            throw new BadRequestException(
              'Type is required to approve a paper',
            );
          }
          paper.type = type;
          paper.selectedApprovedDate = new Date();
        }
        if (paper.process === Process.PRESELECCIONADO) {
          await this.mailService.sendPaperUpdateStatusEmail({
            paper,
            to: paper.webUser.email,
          });
        }
        break;
      case PaperState.DISMISSED:
        if (
          loggedUser.id !== paper.reviewerUserId &&
          loggedUser.id !== paper.leaderId
        ) {
          throw new UnauthorizedException(
            'Only reviewer or leader can dismissed a paper',
          );
        }
        paper.state = state;
        paper.dismissedDate = new Date();
        const webUser = await this.webUsersRepository.repository.findOne({
          where: { id: paper.webUserId },
        });
        if (!webUser) {
          throw new NotFoundException('Web User not found');
        }
        if (paper.process === Process.PRESELECCIONADO) {
          await this.mailService.sendPaperUpdateStatusEmail({
            paper,
            to: paper.webUser.email,
          });
        }
        webUser.isActive = false;
        await this.webUsersRepository.repository.save(webUser);
        break;
      default:
        throw new NotFoundException('Invalid state');
    }
    await this.papersRepository.repository.save(paper);
    return paper;
  }

  async findComments(id: number) {
    const paper = await this.papersRepository.repository.findOne({
      where: { id },
      relations: ['comentaries'],
    });
    if (!paper) {
      throw new NotFoundException('Paper not found');
    }
    return paper.comentaries;
  }

  async addComment(id: number, addCommentDto: AddCommentDto) {
    const paper = await this.papersRepository.repository.findOne({
      where: { id },
      relations: ['comentaries'],
    });
    if (!paper) {
      throw new NotFoundException('Paper not found');
    }
    const loggedUser = this.usersService.getLoggedUser();
    const user = await this.usersRepository.findById(loggedUser.id);
    const comment: PaperComentary = {
      ...addCommentDto,
      paper,
      paperId: paper.id,
      user,
      createdAt: new Date(),
    };
    return this.paperCommentsReposiitory.repository.save(comment);
  }

  async updateComment(
    id: number,
    commentId: number,
    updateCommentDto: AddCommentDto,
  ) {
    console.log('Actualizando comentario ' + commentId + ' del paper ' + id);
    const comment = await this.paperCommentsReposiitory.repository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    // const loggedUser = this.usersService.getLoggedUser();
    // if(comment.reviewerId !== loggedUser.id){
    //   throw new UnauthorizedException('You are not allowed to update this comment');
    // }
    comment.comentary = updateCommentDto.comentary;
    comment.fileUrl = updateCommentDto.fileUrl;

    await this.paperCommentsReposiitory.repository.save(comment);
    return comment;
  }

  async deleteComment(id: number, commentId: number) {
    console.log('Eliminando comentario ' + commentId + ' del paper ' + id);
    const comment = await this.paperCommentsReposiitory.repository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.paperCommentsReposiitory.repository.softDelete(commentId);
    return null;
  }

  async findAuthors(id: number) {
    const paper = await this.papersRepository.repository.findOne({
      where: { id },
      relations: ['authors'],
    });
    if (!paper) {
      throw new NotFoundException('Paper not found');
    }
    return paper.authors.map((a) => this.paperAuthorToJson(a));
  }

  paperAuthorToJson(author: PaperAuthor) {
    const { countryCode } = author;
    if (countryCode) {
      const country = this.countriesService.getCountry(countryCode);
      return {
        ...author,
        country,
      };
    }
  }

  async uploadFullFile(id: number, uploadFullFileDto: UploadFullFileDto) {
    const { fullFileUrl } = uploadFullFileDto;
    const paper = await this.papersRepository.repository.findOne({
      where: { id },
    });
    if (!paper) {
      throw new NotFoundException('Paper not found');
    }
    paper.fullFileUrl = fullFileUrl;
    await this.papersRepository.repository.save(paper);
    await this.changeStatus(id, {
      state: PaperState.RECEIVED,
    });
    return this.findOne(id);
  }

  async rate(id: number, rateDto: RateDto) {
    const paper = await this.papersRepository.repository.findOne({
      where: { id },
    });
    if (!paper) {
      throw new NotFoundException('Paper not found');
    }
    const { score1, score2, score3 } = rateDto;
    const { process: phase, state } = paper;
    if (
      phase === Process.PRESELECCIONADO &&
      state === PaperState.UNDER_REVIEW
    ) {
      paper.phase1Score1 = score1;
      paper.phase1Score2 = score2;
      paper.phase1Score3 = score3;
      paper.phase1Score = Number(((score1 + score2 + score3) / 3).toFixed(2));
    } else if (
      phase === Process.SELECCIONADO &&
      state === PaperState.UNDER_REVIEW
    ) {
      paper.phase2Score1 = score1;
      paper.phase2Score2 = score2;
      paper.phase2Score3 = score3;
      paper.phase2Score = Number(((score1 + score2 + score3) / 3).toFixed(2));
    } else {
      throw new BadRequestException('Invalid phase or state');
    }
    paper.updatedAt = new Date();
    return this.papersRepository.repository.save(paper);
  }
}
