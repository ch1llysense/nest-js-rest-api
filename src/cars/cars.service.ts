import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}
  async create(createCarDto: CreateCarDto) {
    return await this.prisma.car.create({
      data: {
        ...createCarDto,
      },
    });
  }

  async findAll(page: number = 1, perPage: number = 10) {
    const cars = await this.prisma.car.findMany({
      skip: (page - 1) * perPage,
      take: Number(perPage),
    });
    const total = await this.prisma.car.count();
    return { cars, total };
  }

  findOne(id: number) {
    return this.prisma.car.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
