import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { getModelToken } from '@nestjs/mongoose';

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
});
