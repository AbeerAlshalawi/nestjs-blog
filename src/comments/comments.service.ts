import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { Comment } from '../comments/entities/comment.entity';
import { Article } from '../articles/entities/article.entity';
import { FilterDto } from '../common/filter.dto';
import { PageService } from '../common/page.service';

@Injectable()
export class CommentService extends PageService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {
    super();
  }

  async create(createCommentDto: CreateCommentDTO, articleId: number) {
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.article = { id: articleId } as Article;

    return await this.commentRepository.save(comment);
  }

  async findAllByArticle(articleId: number, filter: FilterDto) {
    const where: any = { article: { id: articleId } };

    where['content'] = Like(`%${filter.filter}%`);

    const [comments, total] = await this.paginate(
      this.commentRepository,
      filter,
      where,
    );

    return {
      data: comments,
      count: total,
      currentPage: filter.page,
      pageSize: filter.pageSize,
    };
  }
}
