import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/service/neo4j.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { FindPostDto } from '../dto/find-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async create(param: CreatePostDto) {
    try {
      const query = `
        create
        ((post1:POST {tjttle:"${param.post_tittle}"})  -[:Of]-> (comment0:COMMENT {name:"${param.comment_name}"}))
        ,((post1)  -[:Of]-> (comment1:COMMENT {name:"comment1"}))
        return post1`;
      return await this.neo4jService.write(query);
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      // this.neo4jService.onApplicationShutdown();
    }
  }

  async findOne(findPostDto: FindPostDto) {
    try {
      console.log(findPostDto.post_id);
      console.log(typeof findPostDto.post_id);

      const res = await this.neo4jService.read(
        `match  (post:POST) -[:Of]-> (comment:COMMENT)
        where ID(post)=${findPostDto.post_id}
        return post,comment
        limit 10`,
      );
      if(res.records.length ==0){
        return {
          err:{
            msg:"node with this id not exist",
            success:false
          }
        }
      }
      console.log(res);
      return res;
    } catch (e) {
      console.log('in err');
      console.log(e);
      throw e;
    } finally {
      // this.neo4jService.onApplicationShutdown();
    }
  }

  async update(post_id: number, createPostDto: CreatePostDto) {
    try {
      const res = await this.neo4jService
        .write(`match (post:POST) -[:Of]-> (comment:COMMENT)
        where ID(post)= ${post_id}
        set post.tjttle="${createPostDto.post_tittle}"
        
        return post,comment`);
      return res;
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      // this.neo4jService.onApplicationShutdown();
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
    } finally {
      // this.neo4jService.onApplicationShutdown();
    }
  }

  async transactionTest() {
    try {
      await this.neo4jService.transactionTest();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
