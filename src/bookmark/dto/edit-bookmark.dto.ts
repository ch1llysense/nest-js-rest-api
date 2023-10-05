import { IsOptional, IsString } from 'class-validator';

export class EditBookmarkDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  descriptiom?: string;

  @IsString()
  @IsOptional()
  link?: string;
}
