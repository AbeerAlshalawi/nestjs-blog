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
import { CreateArticleDTO } from './dto/create-article.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UpdateArticleDTO } from './dto/update-article.dto';
import { FilterDto } from '../common/filter.dto';

@Controller({ path: 'articles', version: '1.0' })
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Public()
  @Post('fillArticles')
  async fillArtciles() {
    await this.articleService.fillArticles();
  }

  @UseGuards(JwtGuard)
  @Post('')
  create(@Body() createArticleDto: CreateArticleDTO, @Request() req) {
    return this.articleService.create(createArticleDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDTO,
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
}
