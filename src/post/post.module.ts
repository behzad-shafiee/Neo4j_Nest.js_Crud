import { Module } from '@nestjs/common';
import { PostService } from './service/post.service';
import { PostController } from './controller/post.controller';

@Module({
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
