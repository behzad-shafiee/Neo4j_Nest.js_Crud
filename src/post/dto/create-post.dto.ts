import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  post_tittle: string;

  @ApiProperty()
  @IsNotEmpty()
  comment_name: string;
}
