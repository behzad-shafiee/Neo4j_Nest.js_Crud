import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/service/neo4j.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { FindPostDto } from '../dto/find-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async create(query: string) {
    try {
      if (!query) {
        query = `
        create
        ((post1:POST {tjttle:"post1"})  -[:Of]-> (comment0:COMMENT {name:"comment0"}))
        ,((post1)  -[:Of]-> (comment1:COMMENT {name:"comment1"}))
        return post1`;
      }
      return await this.neo4jService.write(query);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findOne(findPostDto: FindPostDto) {
    try {
      console.log(findPostDto.post_id);
      console.log(typeof findPostDto.post_id);

      const res = await this.neo4jService.read(
        `match  (post:POST) -[:Of]-> (comment:COMMENT)
        where ID(post)=${findPostDto.post_id}
        return post,comment`,
      );
      console.log(res);
      return res;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async update(post_id: string, createPostDto: CreatePostDto) {
    try {
      const res = await this.neo4jService
        .write(`match (post:POST) -[:Of]-> (comment:COMMENT)
        where ID(post)= ${post_id}
        set post.tjttle="${createPostDto.tittle}"
        return post,comment`);
      return res;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async delete(post_id: number) {
    try {
      const res = await this.neo4jService.write(`match (post:POST)
        where ID(post)= ${post_id}
       detach delete post`);
      return res;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
