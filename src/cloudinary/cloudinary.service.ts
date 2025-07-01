import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
    constructor(@Inject('CLOUDINARY') private cloudinary) {
        this.cloudinary = v2;
    }

    async uploadImage(
        file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = this.cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            Readable.from(file.buffer).pipe(upload);
        });
    }

    async deleteImage(publicId: string): Promise<void> {
        await this.cloudinary.uploader.destroy(publicId);
    }
} 