import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreatePostDto } from './dto/create-post.dto';

const postDTOStub = (): CreatePostDto => {
  return {
    title: 'This is the title of the  post',
    body: 'This is a stub for testing',
    userId: 1,
  };
};

describe('PostsService', () => {
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
      imports: [],
      providers: [
        PostService,
        { provide: getModelToken(Post.name), useValue: postModel },
      ],
    }).compile();

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
    expect(service).toBeDefined();
  });

  it('createPost', async () => {
    const createdPost = await service.createPost(postDTOStub());
    expect(createdPost.title).toBe(postDTOStub().title);
  });

  it('getPosts', async () => {
    await new postModel(postDTOStub()).save();
    const posts = await service.getAllPosts();
    expect(posts[0].title).toBe(postDTOStub().title);
  });

  it('getPost', async () => {
    const post = {
      postId: 1,
      ...postDTOStub(),
    };

    await new postModel(post).save();

    const result = await service.getPost(post.postId);
    expect(result.title).toBe(postDTOStub().title);
  });

  it('delete post', async () => {
    const post = {
      postId: 1,
      ...postDTOStub(),
    };

    await new postModel(post).save();
    const result = await service.deletePost(1);
    expect(result).toBe(true);
  });

  it('updatePost', async () => {
    const post = {
      postId: 1,
      ...postDTOStub(),
    };

    await new postModel(post).save();
    const createdPost = await service.updatePost(1, postDTOStub());
    expect(createdPost.title).toBe(postDTOStub().title);
  });
});
