import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const config = new DocumentBuilder()
.setTitle('Neo4j_Nest.js')
.setDescription('Learning Neo4j In Nest.js')
.setVersion('1.0')
.build();
