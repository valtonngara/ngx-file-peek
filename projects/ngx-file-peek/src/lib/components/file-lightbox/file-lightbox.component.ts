import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  inject,
  viewChild,
  ElementRef,
  afterNextRender,
} from '@angular/core';
import { FileType } from '../../models/file-preview.models';
import { PdfRendererService } from '../../services/pdf-renderer.service';
import { ImageRendererComponent } from '../renderers/image-renderer/image-renderer.component';
import { WordRendererComponent } from '../renderers/word-renderer/word-renderer.component';
import { ExcelRendererComponent } from '../renderers/excel-renderer/excel-renderer.component';
import { PlaceholderRendererComponent } from '../renderers/placeholder-renderer/placeholder-renderer.component';

@Component({
  selector: 'fp-file-lightbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImageRendererComponent,
    WordRendererComponent,
    ExcelRendererComponent,
    PlaceholderRendererComponent,
  ],
  template: `
    <div class="lightbox-backdrop" (click)="onBackdropClick($event)">
      <div class="lightbox-container">
        <div class="lightbox-header">
          <div class="lightbox-title">
            <span class="lightbox-icon">{{ typeIcon() }}</span>
            <span class="lightbox-filename">{{ filename() }}</span>
            <span class="lightbox-badge" [attr.data-type]="fileType()">{{ typeLabel() }}</span>
          </div>
          <div class="lightbox-actions">
            <button class="action-btn" title="Download" (click)="download()">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </button>
            <button class="action-btn" title="Open in new tab" (click)="openInNewTab()">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </button>
            <button class="action-btn close-btn" title="Close" (click)="closed.emit()">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="lightbox-body" (wheel)="onWheel($event)">
          <div class="lightbox-content" [style.transform]="'scale(' + zoom() + ')'">
            @switch (fileType()) {
              @case ('image') {
                <fp-image-renderer [url]="url()" [size]="contentSize" />
              }
              @case ('pdf') {
                @if (pdfLoading()) {
                  <div class="pdf-loading">
                    <div class="spinner-icon"></div>
                  </div>
                }
                @if (pdfError()) {
                  <div class="pdf-error">Failed to load PDF</div>
                }
                <canvas #pdfCanvas [style.display]="pdfLoading() || pdfError() ? 'none' : 'block'"></canvas>
              }
              @case ('word') {
                <fp-word-renderer [url]="url()" [size]="contentSize" />
              }
              @case ('excel') {
                <fp-excel-renderer [url]="url()" [size]="contentSize" />
              }
              @default {
                <fp-placeholder-renderer [fileType]="fileType()" [size]="contentSize" />
              }
            }
          </div>
        </div>

        @if (fileType() === 'pdf') {
          <div class="lightbox-footer">
            <button class="page-btn" [disabled]="currentPage() <= 1" (click)="prevPage()">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <span class="page-info">Page {{ currentPage() }} of {{ totalPages() }}</span>
            <button class="page-btn" [disabled]="currentPage() >= totalPages()" (click)="nextPage()">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        }

        <div class="lightbox-zoom-controls">
          <button class="zoom-btn" (click)="zoomOut()" [disabled]="zoom() <= 0.5">−</button>
          <span class="zoom-level">{{ zoomPercent() }}%</span>
          <button class="zoom-btn" (click)="zoomIn()" [disabled]="zoom() >= 3">+</button>
          <button class="zoom-btn" (click)="resetZoom()">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './file-lightbox.component.scss',
})
export class FileLightboxComponent {
  url = input.required<string>();
  fileType = input.required<FileType>();
  closed = output<void>();

  readonly contentSize = 600;

  zoom = signal(1);
  currentPage = signal(1);
  totalPages = signal(1);
  pdfLoading = signal(true);
  pdfError = signal(false);

  private readonly pdfService = inject(PdfRendererService);
  private readonly pdfCanvas = viewChild<ElementRef<HTMLCanvasElement>>('pdfCanvas');

  zoomPercent = computed(() => Math.round(this.zoom() * 100));

  constructor() {
    afterNextRender(() => {
      if (this.fileType() === 'pdf') {
        this.renderPdfPage(1);
      }
    });
  }

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

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('lightbox-backdrop')) {
      this.closed.emit();
    }
  }

  download(): void {
    const a = document.createElement('a');
    a.href = this.url();
    a.download = this.filename();
    a.target = '_blank';
    a.click();
  }

  openInNewTab(): void {
    window.open(this.url(), '_blank');
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(3, this.zoom() + delta));
    this.zoom.set(newZoom);
  }

  zoomIn(): void {
    this.zoom.set(Math.min(3, this.zoom() + 0.25));
  }

  zoomOut(): void {
    this.zoom.set(Math.max(0.5, this.zoom() - 0.25));
  }

  resetZoom(): void {
    this.zoom.set(1);
  }

  async prevPage(): Promise<void> {
    if (this.currentPage() > 1) {
      await this.renderPdfPage(this.currentPage() - 1);
    }
  }

  async nextPage(): Promise<void> {
    if (this.currentPage() < this.totalPages()) {
      await this.renderPdfPage(this.currentPage() + 1);
    }
  }

  private async renderPdfPage(pageNum: number): Promise<void> {
    const canvas = this.pdfCanvas()?.nativeElement;
    if (!canvas) return;

    this.pdfLoading.set(true);
    this.pdfError.set(false);

    try {
      const result = await this.pdfService.renderPage(this.url(), canvas, this.contentSize, pageNum);
      this.currentPage.set(pageNum);
      this.totalPages.set(result.totalPages);
      this.pdfLoading.set(false);
    } catch {
      this.pdfLoading.set(false);
      this.pdfError.set(true);
    }
  }
}
