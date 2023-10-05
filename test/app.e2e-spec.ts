import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDTO } from 'src/auth/dto';
import { EditUserDTO } from 'src/user/dto';
import { CreateBookmarkDTO, EditBookmarkDTO } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(4000);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:4000');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDTO = {
      email: 'user@mail.com',
      password: '1234',
    };
    describe('Signup', () => {
      it('Should fail if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('Should fail if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('Should fail if password and email is empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('Should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      let userAccessToken: string;
      it('Should fail if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('Should fail if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('Should fail if password and email is empty', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      it('Should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('Should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
          .expectStatus(200)
          .inspect();
      });
    });

    describe('Edit user', () => {
      it('Should edit user', () => {
        const dto: EditUserDTO = {
          firstName: 'Jan',
          lastName: 'Kowalski',
          email: 'jan.kowalski@gmail.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmarks collection', () => {
      it('Should return empty collection', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDTO = {
        link: 'https://nestjs.com/',
        title: 'NestJS',
        description: 'NestJS official website',
      };
      it('Should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('Should return bookmarks collection with one record', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by id', () => {
      it('Should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
          .expectStatus(200)
          .expectBodyContains(`$S{bookmarkId}`);
      });
    });

    describe('Edit bookmark', () => {
      it('Should edit bookmark', () => {
        const dto: EditBookmarkDTO = {
          title: 'NestJS',
          description: 'NestJS - NodeJS Framework - official website ',
        };

        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete bookmark', () => {
      it('Should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
          .expectStatus(204);
      });

      it('Should get empty bookmarks collection', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
