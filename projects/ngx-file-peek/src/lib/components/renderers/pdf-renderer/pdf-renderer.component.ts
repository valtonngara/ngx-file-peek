import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
  viewChild,
  ElementRef,
  signal,
  afterNextRender,
} from '@angular/core';
import { PdfRendererService } from '../../../services/pdf-renderer.service';

@Component({
  selector: 'fp-pdf-renderer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <div class="spinner" [style.width.px]="size()" [style.height.px]="size()">
        <div class="spinner-icon"></div>
      </div>
    }
    @if (error()) {
      <div class="error" [style.width.px]="size()" [style.height.px]="size()">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#e53e3e" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="12" x2="12" y2="16"/>
          <circle cx="12" cy="18" r="0.5"/>
        </svg>
        <span>PDF Error</span>
      </div>
    }
    <canvas #pdfCanvas [style.display]="loading() || error() ? 'none' : 'block'"></canvas>
  `,
  styleUrl: './pdf-renderer.component.scss',
})
export class PdfRendererComponent {
  url = input.required<string>();
  size = input<number>(120);

  loading = signal(true);
  error = signal(false);

  private readonly pdfService = inject(PdfRendererService);
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('pdfCanvas');

  constructor() {
    afterNextRender(() => this.render());
  }

  private async render(): Promise<void> {
    const canvasEl = this.canvasRef()?.nativeElement;
    if (!canvasEl) return;

    try {
      await this.pdfService.renderFirstPage(this.url(), canvasEl, this.size());
      this.loading.set(false);
    } catch {
      this.loading.set(false);
      this.error.set(true);
    }
  }
}
