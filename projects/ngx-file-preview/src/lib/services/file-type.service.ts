import { Injectable } from '@angular/core';
import { FileType } from '../models/file-preview.models';

const EXTENSION_MAP: Record<string, FileType> = {
  jpg: FileType.Image,
  jpeg: FileType.Image,
  png: FileType.Image,
  gif: FileType.Image,
  webp: FileType.Image,
  svg: FileType.Image,
  bmp: FileType.Image,
  pdf: FileType.Pdf,
  doc: FileType.Word,
  docx: FileType.Word,
  xls: FileType.Excel,
  xlsx: FileType.Excel,
};

@Injectable({ providedIn: 'root' })
export class FileTypeService {
  detectType(url: string): FileType {
    try {
      const parsed = new URL(url, 'https://placeholder.local');
      const pathname = parsed.pathname;
      const lastDot = pathname.lastIndexOf('.');
      if (lastDot === -1) return FileType.Unknown;
      const ext = pathname.substring(lastDot + 1).toLowerCase();
      return EXTENSION_MAP[ext] ?? FileType.Unknown;
    } catch {
      return FileType.Unknown;
    }
  }
}
