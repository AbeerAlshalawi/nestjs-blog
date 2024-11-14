import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Delete,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FilterDto } from 'src/common/filter.dto';

@Controller({ path: 'articles', version: '1.0' })
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtGuard)
  @Post('')
  create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    return this.articleService.create(createArticleDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req,
  ) {
    return this.articleService.update(id, updateArticleDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: number, @Request() req) {
    return this.articleService.delete(id, req.user.id);
  }

  @Public()
  @Get('')
  getAll(@Query() filter: FilterDto) {
    return this.articleService.getAll(filter);
  }

  @Public()
  @Post('/fillArticles')
  fillArticles() {
    return this.articleService.fillArticles();
  }
}
