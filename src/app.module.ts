import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule/dist';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jConfig } from './neo4j/config/neo4j-config';
import { Neo4jModule } from './neo4j/neo4j.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    Neo4jModule.forRoot(Neo4jConfig),
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
