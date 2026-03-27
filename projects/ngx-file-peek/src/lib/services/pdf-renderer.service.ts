import { inject, Injectable } from '@angular/core';
import { FILE_PREVIEW_CONFIG } from '../models/file-preview.tokens';

@Injectable({ providedIn: 'root' })
export class PdfRendererService {
  private readonly config = inject(FILE_PREVIEW_CONFIG);

  async renderFirstPage(url: string, canvas: HTMLCanvasElement, maxSize: number): Promise<void> {
    const pdfjs = await import('pdfjs-dist');

    if (this.config.pdfWorkerUrl) {
      pdfjs.GlobalWorkerOptions.workerSrc = this.config.pdfWorkerUrl;
    }

    const pdf = await pdfjs.getDocument(url).promise;
    const page = await pdf.getPage(1);

    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = maxSize / Math.max(unscaledViewport.width, unscaledViewport.height);
    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvas, viewport }).promise;
  }
}
