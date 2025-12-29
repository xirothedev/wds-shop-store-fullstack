import {
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  FileMetadata,
  UploadOptions,
  UploadResult,
} from './interfaces/storage.interface';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly publicUrl: string;
  private readonly endpoint: string;

  constructor(private readonly config: ConfigService) {
    this.bucketName = this.config.getOrThrow<string>('R2_BUCKET_NAME');
    this.publicUrl = this.config.getOrThrow<string>('R2_PUBLIC_URL');
    this.endpoint = this.config.getOrThrow<string>('R2_ENDPOINT');

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow<string>('R2_SECRET_ACCESS_KEY'),
      },
    });
  }

  /**
   * Upload a file to R2 storage
   * @param file - Express Multer file object
   * @param options - Upload options (key, contentType, prefix)
   * @returns Upload result with key, url, size, and contentType
   */
  async uploadFile(
    file: Express.Multer.File,
    options?: UploadOptions
  ): Promise<UploadResult> {
    return this.uploadBuffer(
      file.buffer,
      file.originalname,
      file.size,
      options
    );
  }

  /**
   * Upload a buffer to R2 storage (useful for seed scripts)
   * @param buffer - File buffer
   * @param filename - Original filename
   * @param size - File size in bytes
   * @param options - Upload options (key, contentType, prefix)
   * @returns Upload result with key, url, size, and contentType
   */
  async uploadBuffer(
    buffer: Buffer,
    filename: string,
    size: number,
    options?: UploadOptions
  ): Promise<UploadResult> {
    try {
      // Generate key if not provided
      const key = options?.key || this.generateKey(filename, options?.prefix);

      // Use provided contentType or default
      const contentType = options?.contentType || 'application/octet-stream';

      // Upload to R2
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);

      // Generate public URL
      const url = this.getFileUrl(key);

      return {
        key,
        url,
        size,
        contentType,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete a file from R2 storage
   * @param key - File key/path in R2
   * @throws NotFoundException if file doesn't exist
   */
  async deleteFile(key: string): Promise<void> {
    try {
      // Check if file exists first
      const exists = await this.fileExists(key);
      if (!exists) {
        throw new NotFoundException(`File with key '${key}' not found`);
      }

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get public URL for a file
   * @param key - File key/path in R2
   * @returns Public URL string
   */
  getFileUrl(key: string): string {
    if (this.publicUrl) {
      // Use custom public URL if configured
      return `${this.publicUrl.replace(/\/$/, '')}/${key}`;
    }

    // Fallback to endpoint-based URL
    return `${this.endpoint.replace(/\/$/, '')}/${this.bucketName}/${key}`;
  }

  /**
   * Check if a file exists in R2 storage
   * @param key - File key/path in R2
   * @returns true if file exists, false otherwise
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      // If error is 404, file doesn't exist
      if (
        error.name === 'NotFound' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        return false;
      }
      // Re-throw other errors
      throw new InternalServerErrorException(
        `Failed to check file existence: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * List files in R2 storage
   * @param prefix - Optional prefix to filter files (e.g., 'uploads/')
   * @returns Array of file metadata
   */
  async listFiles(prefix?: string): Promise<FileMetadata[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
      });

      const response = await this.s3Client.send(command);

      if (!response.Contents || response.Contents.length === 0) {
        return [];
      }

      return response.Contents.map((object) => ({
        key: object.Key || '',
        size: object.Size || 0,
        lastModified: object.LastModified || new Date(),
        contentType: undefined, // ListObjectsV2 doesn't return ContentType
        url: this.getFileUrl(object.Key || ''),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate a unique key for file upload
   * @param originalName - Original filename
   * @param prefix - Optional prefix (e.g., 'uploads/')
   * @returns Generated key string
   */
  private generateKey(originalName: string, prefix?: string): string {
    // Sanitize filename
    const sanitizedName = this.sanitizeFileName(originalName);
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);

    const baseKey = `${timestamp}-${randomSuffix}-${sanitizedName}`;
    return prefix
      ? `${prefix.replace(/\/$/, '')}/${baseKey}`
      : `uploads/${baseKey}`;
  }

  /**
   * Sanitize filename to prevent path traversal and special characters
   * @param fileName - Original filename
   * @returns Sanitized filename
   */
  private sanitizeFileName(fileName: string): string {
    // Remove path separators and dangerous characters
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\.\./g, '_')
      .replace(/^\.+/, '')
      .substring(0, 255); // Limit length
  }
}
