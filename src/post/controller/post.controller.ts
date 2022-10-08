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

  //create
  @Post(':post_tittle/:comment_name')
  async create(
    @Param('post_tittle') post_tittle: string,
    @Param('comment_name') comment_name: string,
  ) {
    console.log(post_tittle);
    console.log(comment_name);
    const param = { post_tittle, comment_name };
    console.log(param);
    return await this.postService.create(param);
  }

  //read one
  @Get(':post_id')
  findOne(@Param('post_id') post_id: string) {
    console.log(post_id);

    const findPostDto = { post_id: Number(post_id) };
    console.log(findPostDto);

    return this.postService.findOne(findPostDto);
  }

  //update
  @Put(':post_id')
  async update(
    @Body() createPostDto: CreatePostDto,
    @Param('post_id') post_id: string,
  ) {
    console.log(post_id);
    console.log(createPostDto);
    return await this.postService.update(+post_id, createPostDto);
  }

  //delete
  @Delete(':post_id')
  async remove(@Param('post_id') post_id: string) {
    console.log(post_id);

    return await this.postService.delete(+post_id);
  }

  //test transaction
  @Get('transactionTest')
  async transactionTest() {
    return this.postService.transactionTest();
  }
}
