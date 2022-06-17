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

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post()
  async createPost(@Res() response, @Body() createPostDto: CreatePostDto) {
    try {
      const newPost = await this.postService.createPost(createPostDto);

      return response.status(HttpStatus.CREATED).json({
        message: 'Post has been created successfully',
        newPost,
      });
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
        postId,
        updatePostDto,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Post has been successfully updated',
        existingPost,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
  @Get()
  async getPosts(@Res() response) {
    try {
      const postData = await this.postService.getAllPosts();
      return response.status(HttpStatus.OK).json({
        message: 'All posts data found successfully',
        postData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async getPost(@Res() response, @Param('id') postId: string) {
    try {
      const existingPost = await this.postService.getPost(postId);
      return response.status(HttpStatus.OK).json({
        message: 'Student found successfully',
        existingPost,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async deletePost(@Res() response, @Param('id') postId: string) {
    try {
      const deletedPost = await this.postService.deletePost(postId);
      return response.status(HttpStatus.OK).json({
        message: 'Student deleted successfully',
        deletedPost,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
