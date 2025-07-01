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
        console.log('Cloudinary - Starting upload for file:', {
            originalname: file.originalname,
            size: file.size,
            mimetype: file.mimetype
        });

        return new Promise((resolve, reject) => {
            const upload = this.cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (error) {
                        console.log('Cloudinary - Upload error:', error);
                        return reject(error);
                    }
                    console.log('Cloudinary - Upload successful:', {
                        public_id: result.public_id,
                        url: result.secure_url
                    });
                    resolve(result);
                },
            );

            Readable.from(file.buffer).pipe(upload);
        });
    }

    async deleteImage(publicId: string): Promise<void> {
        console.log('Cloudinary - Deleting image:', publicId);
        try {
            await this.cloudinary.uploader.destroy(publicId);
            console.log('Cloudinary - Image deleted successfully');
        } catch (error) {
            console.log('Cloudinary - Delete error:', error);
            throw error;
        }
    }

    async uploadImageFromUrl(imageUrl: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            this.cloudinary.uploader.upload(
                imageUrl,
                { resource_type: 'image' },
                (error, result) => {
                    if (error) {
                        console.log('Cloudinary - Upload from URL error:', error);
                        return reject(error);
                    }
                    console.log('Cloudinary - Upload from URL successful:', {
                        public_id: result.public_id,
                        url: result.secure_url
                    });
                    resolve(result);
                }
            );
        });
    }
}