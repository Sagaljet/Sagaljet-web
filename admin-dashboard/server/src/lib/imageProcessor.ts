// lib/imageProcessor.ts
import sharp from 'sharp';

export interface ProcessedImage {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export const processImage = async (
  file: Express.Multer.File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }
): Promise<ProcessedImage> => {
  const { maxWidth = 1920, maxHeight = 1080, quality = 80 } = options || {};

  try {
    const processedBuffer = await sharp(file.buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality }) // Convert to WebP for smaller size
      .toBuffer();

    return {
      buffer: processedBuffer,
      mimetype: 'image/webp',
      originalname: file.originalname.replace(/\.[^.]+$/, '.webp'),
    };
  } catch (error) {
    console.error('Image processing error:', error);
    // Return original if processing fails
    return {
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
    };
  }
};