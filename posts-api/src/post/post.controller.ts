import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post()
  async createPost(@Res() response, @Body() createPostDto: CreatePostDto) {
    try {
      const newPost = await this.postService.createPost(createPostDto);
      return response.status(HttpStatus.CREATED).json(newPost);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Post not created!',
        error: 'Bad Request',
      });
    }
  }
  @Put('/:id')
  async updatePost(
    @Res() response,
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    try {
      const existingPost = await this.postService.updatePost(
        parseInt(postId),
        updatePostDto,
      );
      return response.status(HttpStatus.OK).json(existingPost);
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
  @Get()
  async getPosts(@Res() response) {
    try {
      const postData = await this.postService.getAllPosts();
      return response.status(HttpStatus.OK).json(postData);
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async getPost(@Res() response, @Param('id') postId: string) {
    try {
      const existingPost = await this.postService.getPost(parseInt(postId));
      return response.status(HttpStatus.OK).json(existingPost);
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async deletePost(@Res() response, @Param('id') postId: string) {
    try {
      await this.postService.deletePost(parseInt(postId));

      return response.status(HttpStatus.OK).json({
        message: 'Post deleted successfully',
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
