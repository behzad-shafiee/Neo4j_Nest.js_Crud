import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostService } from '../service/post.service';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('getConfig')
  async test() {
   return this.postService.test()
  }


  @Get('transactionTest')
  async transactionTest() {
   return this.postService.transactionTest()
  }

  @Post()
  async create(query: string) {
    return await this.postService.create(query);
  }

  @Get(':post_id')
  findOne(@Param('post_id') post_id: string) {
    console.log(post_id);

    const findPostDto = { post_id: Number(post_id) };
    console.log(findPostDto);

    return this.postService.findOne(findPostDto);
  }

  @Put(':post_id')
  async update(
    @Param('post_id') post_id: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postService.update(post_id, createPostDto);
  }

  @Delete(':post_id')
  async remove(@Param('post_id') post_id: string) {
    console.log(post_id);

    return await this.postService.delete(+post_id);
  }
}
