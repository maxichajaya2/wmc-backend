import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';
import { Paper, PaperState } from '../domain/entities/paper.entity';
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

@Injectable()
export class PapersService {

  constructor(
    private readonly papersRepository: PapersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly topicsRepository: TopicsRepository,
    private readonly usersService: UsersService,
    private readonly webUsersRepository: WebUsersRepository,
    private readonly paperCommentsReposiitory: PaperCommentsRepository,
    private readonly paperAuthorsRepository: PaperAuthorsRepository,
    private readonly countriesService: CountriesService,
  ) {}

  async findAll({onlyActive} = {onlyActive: false}) {
    let where = {};
    if(onlyActive){
      where = { isActive: true };
    }
    return this.papersRepository.repository.find({
      where,
    });
  }

  async findOne(id: number, {onlyActive} = {onlyActive: false}) {
    let where = { id };
    if(onlyActive){
      where['isActive'] = true;
    }
    const paper = await this.papersRepository.repository.findOne({
      where,
      relations: ['registeredBy', 'reviewerUser', 'topic'],
    });
    if(!paper){
      throw new NotFoundException('Paper not found');
    }
    return paper;
  }

  async create(body: CreatePaperDto) {
    const { authors, ...createPaperDto } = body;
    const { topicId } = createPaperDto;
    const user = this.usersService.getLoggedUser();
    const registeredBy = await this.usersRepository.findById(user.id);
    if(!registeredBy){
      throw new NotFoundException('User not found');
    }
    const topic = await this.topicsRepository.repository.findOne({
      where: { id: topicId },
    });
    if(!topic){
      throw new NotFoundException('Topic not found');
    }
    const paper: Paper = {
      ...createPaperDto,
      registeredById: registeredBy.id,
      state: PaperState.REGISTERED,
      registeredDate: new Date(),
      createdAt: new Date(),
      registeredBy,
      topic,
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
    const { topicId } = updatePaperDto;
    if(topicId && paper.topic.id !== topicId){
      const topic = await this.topicsRepository.repository.findOne({
        where: { id: topicId },
      });
      if(!topic){
        throw new NotFoundException('Topic not found');
      }
      paper.topic = topic;
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
      if(!found){
        await this.paperAuthorsRepository.repository.softDelete(currentAuthor.id);
      }
    }

    for (const author of authors) {
      if(author.id){
        const authorModel = await this.paperAuthorsRepository.repository.findOne({
          where: { id: author.id },
        });
        if(!authorModel){
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

  async remove(id: number){
    this.papersRepository.repository.softDelete(id);
    return null;
  }

  async changeStatus(id: number, changeStateDto: ChangeStateDto){
    const paper = await this.findOne(id);
    const { state, reviewerUserId } = changeStateDto;
    const invalidStateCode = 'INVALID_STATE';
    const reviewerCode = 'REVIEWER_REQUIRED';
    switch(state){
      case PaperState.SENT:
        if(paper.state !== PaperState.REGISTERED){
          throw new BadRequestException({
            code: invalidStateCode,
            message: 'Paper must be registered to be sent',
          });
        }
        paper.state = state;
        paper.sentDate = new Date();
        break;
      case PaperState.REVIEWED:
        if(paper.state !== PaperState.SENT){
          throw new BadRequestException({
            code: invalidStateCode,
            message: 'Paper must be sent to be reviewed',
          });
        }
        if(!reviewerUserId){
          throw new BadRequestException({
            code: reviewerCode,
            message: 'Reviewer user id is required',
          });
        }
        const reviewerUser = await this.webUsersRepository.findById(reviewerUserId);
        if(!reviewerUser){
          throw new NotFoundException('Reviewer user not found');
        }
        paper.state = state;
        paper.reviewerUserId = reviewerUser.id;
        paper.reviewerUser = reviewerUser;
        paper.reviewedDate = new Date();
        break;
      case PaperState.APPROVED:
        const { type } = changeStateDto;
        if(!type){
          throw new BadRequestException('Type is required to approve a paper');
        }
        if(paper.state !== PaperState.REVIEWED){
          throw new BadRequestException({
            code: invalidStateCode,
            message: 'Paper must be reviewed to be approved',
          });
        }
        paper.type = type;
        paper.state = state;
        paper.approvedDate = new Date();
        break;
      default:
        throw new NotFoundException('Invalid state');
    }
    paper.state = state;
    await this.papersRepository.repository.save(paper);
    return paper;
  }

  async findComments(id: number){
    const paper = await this.papersRepository.repository.findOne({
      where: { id },
      relations: ['comentaries'],
    });
    if(!paper){
      throw new NotFoundException('Paper not found');
    }
    return paper.comentaries;
  }

  async addComment(id: number, addCommentDto: AddCommentDto){
    const paper = await this.papersRepository.repository.findOne({
      where: { id },
      relations: ['comentaries'],
    });
    if(!paper){
      throw new NotFoundException('Paper not found');
    }
    const reviewer = await this.webUsersRepository.findById(addCommentDto.reviewerId);
    if(!reviewer){
      throw new NotFoundException('User not found');
    }
    const comment: PaperComentary = {
      ...addCommentDto,
      paper,
      paperId: paper.id,
      reviewer,
      reviewerId: reviewer.id,
      createdAt: new Date(),
    }
    return this.paperCommentsReposiitory.repository.save(comment);
  }

  async updateComment(id: number, commentId: number, updateCommentDto: AddCommentDto){
    console.log('Actualizando comentario ' + commentId + ' del paper ' + id);
    const { comentary } = updateCommentDto;
    const comment = await this.paperCommentsReposiitory.repository.findOne({
      where: { id: commentId },
    });
    if(!comment){
      throw new NotFoundException('Comment not found');
    }
    // const loggedUser = this.usersService.getLoggedUser();
    // if(comment.reviewerId !== loggedUser.id){
    //   throw new UnauthorizedException('You are not allowed to update this comment');
    // }
    comment.comentary = comentary;
    await this.paperCommentsReposiitory.repository.save(comment);
    return comment;
  }

  async deleteComment(id: number, commentId: number){
    console.log('Eliminando comentario ' + commentId + ' del paper ' + id);
    const comment = await this.paperCommentsReposiitory.repository.findOne({
      where: { id: commentId },
    });
    if(!comment){
      throw new NotFoundException('Comment not found');
    }
    // const loggedUser = this.usersService.getLoggedUser();
    // if(comment.reviewerId !== loggedUser.id){
    //   throw new UnauthorizedException('You are not allowed to delete this comment');
    // }
    await this.paperCommentsReposiitory.repository.softDelete(commentId);
    return null;
  }

  async findAuthors(id: number){
    const paper = await this.papersRepository.repository.findOne({
      where: { id },
      relations: ['authors'],
    });
    if(!paper){
      throw new NotFoundException('Paper not found');
    }
    return paper.authors.map(a => this.paperAuthorToJson(a));
  }

  paperAuthorToJson(author: PaperAuthor){
    const { countryCode } = author;
    if(countryCode){
      const country = this.countriesService.getCountry(countryCode);
      return {
        ...author,
        country,
      }
    }
  }
}
