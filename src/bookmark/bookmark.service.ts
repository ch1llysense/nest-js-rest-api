import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  getBookmarks(userId: number) {}

  getBookmarkById(userId: number, bookmarkId: number) {}

  createBookmark(userId: number, dto: CreateBookmarkDTO) {}

  editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDTO) {}

  deleteBookmarkById(userId: number, bookmarkId: number) {}
}
