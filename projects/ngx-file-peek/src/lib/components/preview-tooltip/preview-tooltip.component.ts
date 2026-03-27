import { Component, ChangeDetectionStrategy, input, computed, signal, output } from '@angular/core';
import { FileType } from '../../models/file-preview.models';
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
    <div class="tooltip-panel" [class.pinned]="pinned()">
      <div class="tooltip-header">
        <span class="tooltip-icon">{{ typeIcon() }}</span>
        <span class="tooltip-filename">{{ filename() }}</span>
        <span class="tooltip-badge" [attr.data-type]="fileType()">{{ typeLabel() }}</span>
      </div>
      <div class="tooltip-preview">
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
      <div class="tooltip-actions">
        <button class="tooltip-action-btn" title="Pin preview" (click)="togglePin()" [class.active]="pinned()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 17v5"/>
            <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h14v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1h.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H8a1 1 0 0 1 1 1z"/>
          </svg>
        </button>
        <button class="tooltip-action-btn" title="Expand preview" (click)="maximize.emit()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 3 21 3 21 9"/>
            <polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/>
            <line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
        </button>
        <button class="tooltip-action-btn" title="Download file" (click)="downloadFile()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
        <button class="tooltip-action-btn" title="Open in new tab" (click)="openTab()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styleUrl: './preview-tooltip.component.scss',
})
export class PreviewTooltipComponent {
  url = input.required<string>();
  fileType = input.required<FileType>();
  maximize = output<void>();

  readonly previewSize = 320;
  pinned = signal(false);

  filename = computed(() => {
    try {
      const pathname = new URL(this.url(), 'https://x').pathname;
      const name = pathname.split('/').pop() || 'File';
      return decodeURIComponent(name);
    } catch {
      return 'File';
    }
  });

  typeLabel = computed(() => {
    const labels: Record<string, string> = {
      image: 'Image', pdf: 'PDF', word: 'Word', excel: 'Excel', unknown: 'File',
    };
    return labels[this.fileType()] || 'File';
  });

  typeIcon = computed(() => {
    const icons: Record<string, string> = {
      image: '🖼', pdf: '📄', word: '📝', excel: '📊', unknown: '📎',
    };
    return icons[this.fileType()] || '📎';
  });

  togglePin(): void {
    this.pinned.set(!this.pinned());
  }

  downloadFile(): void {
    const a = document.createElement('a');
    a.href = this.url();
    a.download = this.filename();
    a.target = '_blank';
    a.click();
  }

  openTab(): void {
    window.open(this.url(), '_blank');
  }
}
