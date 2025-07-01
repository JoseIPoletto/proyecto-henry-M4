import { IsString, IsUrl } from 'class-validator';

export class UploadImageUrlDto {
  @IsUrl()
  imageUrl: string;
}
