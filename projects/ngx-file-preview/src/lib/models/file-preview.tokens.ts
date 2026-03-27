import { InjectionToken, Provider } from '@angular/core';
import { FilePreviewConfig } from './file-preview.models';

const DEFAULT_CONFIG: FilePreviewConfig = {
  tooltipDelay: 300,
  placeholderTheme: 'minimal',
};

export const FILE_PREVIEW_CONFIG = new InjectionToken<FilePreviewConfig>(
  'FILE_PREVIEW_CONFIG',
  { factory: () => DEFAULT_CONFIG }
);

export function provideFilePreview(config: Partial<FilePreviewConfig> = {}): Provider {
  return { provide: FILE_PREVIEW_CONFIG, useValue: { ...DEFAULT_CONFIG, ...config } };
}
