export interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

export interface FileMetadata {
  key: string;
  size: number;
  lastModified: Date;
  contentType?: string;
  url: string;
}

export interface UploadOptions {
  key?: string;
  contentType?: string;
  prefix?: string;
}
