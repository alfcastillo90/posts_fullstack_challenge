import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { createResponse } from 'node-mocks-http';
import { HttpStatus } from '@nestjs/common';
import { IPost } from './interfaces/posts.interface';

const postDTOStub = (): CreatePostDto => {
  return {
    title: 'This is the title of the  post',
    body: 'This is a stub for testing',
    userId: 1,
  };
};

describe('PostsController', () => {
  let controller: PostController;
  let mongodb: MongoMemoryServer;
  let mongoConnection: Connection;
  let postModel: Model<Post>;
  let service: PostService;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();
    mongoConnection = (await connect(uri)).connection;
    postModel = mongoConnection.model(Post.name, PostSchema);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostService,
        { provide: getModelToken(Post.name), useValue: postModel },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongodb.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createPost', async () => {
    const res = createResponse();
    const createdPost = await controller.createPost(res, postDTOStub());
    expect(createdPost.statusCode).toBe(HttpStatus.CREATED);
    expect(res._getJSONData().title).toBe(postDTOStub().title);
  });

  it('getPosts', async () => {
    await new postModel(postDTOStub()).save();
    const res = createResponse();
    const posts = await controller.getPosts(res);
    expect(posts.statusCode).toBe(HttpStatus.OK);
    expect(res._getJSONData()[0].title).toBe(postDTOStub().title);
  });

  it('getPost', async () => {
    const post = {
      postId: 1,
      ...postDTOStub(),
    } as IPost;

    jest.spyOn(service, 'getPost').mockResolvedValue(Promise.resolve(post));
    const res = createResponse();
    const posts = await controller.getPost(res, '1');
    expect(posts.statusCode).toBe(HttpStatus.OK);
    expect(res._getJSONData().title).toBe(postDTOStub().title);
  });

  it('delete post', async () => {
    const post = {
      postId: 1,
      ...postDTOStub(),
    };

    await new postModel(post).save();
    const res = createResponse();
    const posts = await controller.deletePost(res, '1');
    expect(posts.statusCode).toBe(HttpStatus.OK);
    expect(res._getJSONData().message).toBe('Post deleted successfully');
  });

  it('updatePost', async () => {
    const post = {
      postId: 1,
      ...postDTOStub(),
    };

    await new postModel(post).save();
    const res = createResponse();
    const createdPost = await controller.updatePost(res, '1', postDTOStub());
    expect(createdPost.statusCode).toBe(HttpStatus.OK);
    expect(res._getJSONData().title).toBe(postDTOStub().title);
  });
});
