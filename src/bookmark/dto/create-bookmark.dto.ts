import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookmarkDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  descriptiom?: string;

  @IsString()
  @IsNotEmpty()
  link: string;
}
