import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comments.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller({ path: 'articles/:articleId/comments', version: '1.0' })
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtGuard)
  @Post('')
  async createComment(
    @Param('articleId') articleId: number,
    @Body() createCommentDto: CreateCommentDTO,
  ) {
    return this.commentService.create(createCommentDto, articleId);
  }

  @Get('')
  async findAll(@Param('articleId') articleId: number) {
    return this.commentService.findAllByArticle(articleId);
  }
}
