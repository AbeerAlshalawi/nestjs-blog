import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { Comment } from 'src/comments/entities/comment.entity';
import { Article } from 'src/articles/entities/article.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDTO,
    articleId: number,
  ): Promise<Comment> {
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.article = { id: articleId } as Article;

    return await this.commentRepository.save(comment);
  }

  async findAllByArticle(articleId: number): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { article: { id: articleId } },
    });
  }
}
