import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostsService } from './post.service';

describe('PostsController', () => {
  let controller: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostsService],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
