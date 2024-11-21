import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comments.service';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { FilterDto } from 'src/common/filter.dto';
import { Public } from 'src/auth/decorators/public.decorator';

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

  @Public()
  @Get('')
  async findAll(
    @Param('articleId') articleId: number,
    @Query() filter: FilterDto,
  ) {
    return this.commentService.findAllByArticle(articleId, filter);
  }
}
