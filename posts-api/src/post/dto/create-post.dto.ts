import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
