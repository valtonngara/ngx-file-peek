import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { FileType, THUMBNAIL_SIZE_MAP } from '../../models/file-preview.models';
import { ImageRendererComponent } from '../renderers/image-renderer/image-renderer.component';
import { PdfRendererComponent } from '../renderers/pdf-renderer/pdf-renderer.component';
import { WordRendererComponent } from '../renderers/word-renderer/word-renderer.component';
import { ExcelRendererComponent } from '../renderers/excel-renderer/excel-renderer.component';
import { PlaceholderRendererComponent } from '../renderers/placeholder-renderer/placeholder-renderer.component';

@Component({
  selector: 'fp-preview-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImageRendererComponent,
    PdfRendererComponent,
    WordRendererComponent,
    ExcelRendererComponent,
    PlaceholderRendererComponent,
  ],
  template: `
    <div class="tooltip-panel">
      @switch (fileType()) {
        @case ('image') {
          <fp-image-renderer [url]="url()" [size]="previewSize" />
        }
        @case ('pdf') {
          <fp-pdf-renderer [url]="url()" [size]="previewSize" />
        }
        @case ('word') {
          <fp-word-renderer [url]="url()" [size]="previewSize" />
        }
        @case ('excel') {
          <fp-excel-renderer [url]="url()" [size]="previewSize" />
        }
        @default {
          <fp-placeholder-renderer [fileType]="fileType()" [size]="previewSize" />
        }
      }
    </div>
  `,
  styleUrl: './preview-tooltip.component.scss',
})
export class PreviewTooltipComponent {
  url = input.required<string>();
  fileType = input.required<FileType>();

  readonly previewSize = THUMBNAIL_SIZE_MAP.lg;
}
