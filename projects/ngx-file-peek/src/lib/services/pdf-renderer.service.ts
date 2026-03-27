import { inject, Injectable } from '@angular/core';
import { FILE_PREVIEW_CONFIG } from '../models/file-preview.tokens';

export interface PdfRenderResult {
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class PdfRendererService {
  private readonly config = inject(FILE_PREVIEW_CONFIG);
  private pdfCache = new Map<string, any>();

  async renderPage(
    url: string,
    canvas: HTMLCanvasElement,
    maxSize: number,
    pageNum: number = 1
  ): Promise<PdfRenderResult> {
    const pdfjs = await import('pdfjs-dist');

    if (this.config.pdfWorkerUrl) {
      pdfjs.GlobalWorkerOptions.workerSrc = this.config.pdfWorkerUrl;
    }

    let pdf = this.pdfCache.get(url);
    if (!pdf) {
      pdf = await pdfjs.getDocument(url).promise;
      this.pdfCache.set(url, pdf);
    }

    const clampedPage = Math.max(1, Math.min(pageNum, pdf.numPages));
    const page = await pdf.getPage(clampedPage);

    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = maxSize / Math.max(unscaledViewport.width, unscaledViewport.height);
    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvas, viewport }).promise;

    return { totalPages: pdf.numPages };
  }

  async renderFirstPage(url: string, canvas: HTMLCanvasElement, maxSize: number): Promise<void> {
    await this.renderPage(url, canvas, maxSize, 1);
  }
}
