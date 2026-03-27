export enum FileType {
  Image = 'image',
  Pdf = 'pdf',
  Word = 'word',
  Excel = 'excel',
  Unknown = 'unknown',
}

export type ThumbnailSize = 'sm' | 'md' | 'lg';

export const THUMBNAIL_SIZE_MAP: Record<ThumbnailSize, number> = {
  sm: 80,
  md: 120,
  lg: 200,
};

export interface FilePreviewConfig {
  pdfWorkerUrl?: string;
  tooltipDelay?: number;
  placeholderTheme?: 'minimal' | 'branded';
}
