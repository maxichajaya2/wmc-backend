import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
  ) { }

  async findAll({ onlyActive } = { onlyActive: false }) {
    let where = {};
    if (onlyActive) {
      where = { isActive: true };
    }
    return this.papersRepository.repository.find({
      where,
    });
  }

  async findOne(id: number, { onlyActive } = { onlyActive: false }) {
    let where = { id };
    if (onlyActive) {
      where['isActive'] = true;
    }
    const paper = await this.papersRepository.repository.findOne({
      where,
      relations: ['webUser', 'reviewerUser', 'topic'],
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
    let webUser: WebUser;
    if(loginOrigin === LoginOrigin.BACKOFFICE){
      if(!webUserId){
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
    .orderBy("CAST(SUBSTRING(paper.correlative FROM '[0-9]+') AS INTEGER)", 'DESC')
    .getOne();
    let correlative = 'TT-1';
    if(lastRegister?.correlative){
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
    }
    const createdPaper = await this.papersRepository.repository.save(paper);
    for (const author of authors) {
      const paperAuthor: PaperAuthor = {
        ...author,
        paper,
        paperId: createdPaper.id,
      }
      await this.paperAuthorsRepository.repository.save(paperAuthor);
    }
    return createdPaper;
  }

  async update(id: number, body: UpdatePaperDto) {
    const paper = await this.findOne(id);
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
    }
    await this.papersRepository.repository.update(id, updatedPaper);


    //eliminar autores que no estén en la lista
    const currentAuthors = await this.paperAuthorsRepository.repository.find({
      where: { paperId: id },
    });
    for (const currentAuthor of currentAuthors) {
      const found = authors.find(a => a.id === currentAuthor.id);
      if (!found) {
        await this.paperAuthorsRepository.repository.softDelete(currentAuthor.id);
      }
    }

    for (const author of authors) {
      if (author.id) {
        const authorModel = await this.paperAuthorsRepository.repository.findOne({
          where: { id: author.id },
        });
        if (!authorModel) {
          throw new NotFoundException('Author not found');
        }
        const newAuthor: PaperAuthor = {
          ...authorModel,
          ...author,
        }
        await this.paperAuthorsRepository.repository.update(author.id, newAuthor);
      } else {
        const newAuthor: PaperAuthor = {
          ...author,
          paper,
          paperId: updatedPaper.id,
        }
        await this.paperAuthorsRepository.repository.save(newAuthor);
      }
    }

    return updatedPaper;
  }

  async remove(id: number) {
    this.papersRepository.repository.softDelete(id);
    return null;
  }

  async changeStatus(id: number, changeStateDto: ChangeStateDto) {
    const loggedUser = this.usersService.getLoggedUser();
    const paper = await this.findOne(id);
    const { process } = paper;
    const isPreSelected = process === Process.PRESELECCIONADO;
    const { state, reviewerUserId, leaderId, type } = changeStateDto;
    const invalidStateCode = 'INVALID_STATE';
    switch (state) {
      case PaperState.RECEIVED:
        if (isPreSelected) {
          if (paper.state !== PaperState.REGISTERED) {
            throw new BadRequestException({
              code: invalidStateCode,
              message: 'Paper must be registered to be received',
            });
          }
          paper.receivedDate = new Date();
        } else {
          if (paper.state !== PaperState.APPROVED) {
            throw new BadRequestException({
              code: invalidStateCode,
              message: 'Paper must be approved to be received',
            });
          }
          paper.selectedReceivedDate = new Date();
        }
        paper.state = state;
        await this.mailService.sendPaperUpdateStatusEmail({
          paper,
          to: paper.webUser.email
        });
        break;
      case PaperState.SENT:
        if (paper.state !== PaperState.REGISTERED) {
          throw new BadRequestException({
            code: invalidStateCode,
            message: 'Paper must be registered to be sent',
          });
        }
        //TODO: validate that the action is done by the admin
        if (loggedUser.id !== RoleCodes.ADMIN) {
          throw new UnauthorizedException('Only admin can send a paper');
        }
        paper.state = state;
        if (isPreSelected) {
          paper.sentDate = new Date();
        } else {
          paper.selectedSentDate = new Date();
        }
        if (!leaderId) {
          throw new BadRequestException('Leader id is required to send a paper');
        }
        const leader = await this.usersRepository.findById(leaderId);
        if (!leader) {
          throw new NotFoundException('Leader not found');
        }
        paper.leader = leader;
        break;
      case PaperState.ASSIGNED:
        if (paper.state !== PaperState.SENT) {
          throw new BadRequestException({
            code: invalidStateCode,
            message: 'Paper must be sent to be assigned',
          });
        }
        if (loggedUser.id !== paper.leaderId) {
          throw new UnauthorizedException('Only leader can assign a paper');
        }
        paper.state = state;
        if (isPreSelected) {
          paper.assignedDate = new Date();
        } else {
          paper.selectedAssignedDate = new Date();
        }
        if (!reviewerUserId) {
          throw new BadRequestException('Reviewer user id is required');
        }
        const reviewerUser = await this.usersRepository.findById(reviewerUserId);
        if (!reviewerUser) {
          throw new NotFoundException('Reviewer user not found');
        }
        paper.reviewerUser = reviewerUser;
        break;
      case PaperState.UNDER_REVIEW:
        if (paper.state !== PaperState.ASSIGNED) {
          throw new BadRequestException({
            code: invalidStateCode,
            message: 'Paper must be assigned to be under review',
          });
        }
        if (loggedUser.id !== paper.reviewerUserId && loggedUser.id !== paper.leaderId) {
          throw new UnauthorizedException('Only reviewer or leader can review a paper');
        }
        paper.state = state;
        if (isPreSelected) {
          paper.reviewedDate = new Date();
        } else {
          paper.selectedReviewedDate = new Date();
        }
        break;
      case PaperState.APPROVED:
        if (!type) {
          throw new BadRequestException('Type is required to approve a paper');
        }
        if (paper.state !== PaperState.UNDER_REVIEW) {
          throw new BadRequestException({
            code: invalidStateCode,
            message: 'Paper must be under review to be approved',
          });
        }
        if (loggedUser.id !== paper.reviewerUserId && loggedUser.id !== paper.leaderId) {
          throw new UnauthorizedException('Only reviewer or leader can approve a paper');
        }
        paper.type = type;
        paper.state = state;
        if (isPreSelected) {
          paper.approvedDate = new Date();
        } else {
          paper.selectedApprovedDate = new Date();
        }
        await this.mailService.sendPaperUpdateStatusEmail({
          paper,
          to: paper.webUser.email
        });
        paper.process = Process.SELECCIONADO;
        break;
      case PaperState.DISMISSED:
        if (loggedUser.id !== paper.reviewerUserId && loggedUser.id !== paper.leaderId) {
          throw new UnauthorizedException('Only reviewer or leader can approve a paper');
        }
        paper.state = state;
        paper.dismissedDate = new Date();
        await this.mailService.sendPaperUpdateStatusEmail({
          paper,
          to: paper.webUser.email
        });
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
    }
    return this.paperCommentsReposiitory.repository.save(comment);
  }

  async updateComment(id: number, commentId: number, updateCommentDto: AddCommentDto) {
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
    return paper.authors.map(a => this.paperAuthorToJson(a));
  }

  paperAuthorToJson(author: PaperAuthor) {
    const { countryCode } = author;
    if (countryCode) {
      const country = this.countriesService.getCountry(countryCode);
      return {
        ...author,
        country,
      }
    }
  }
}
