import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WordRendererService {
  async renderToHtml(url: string): Promise<string> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const mammoth = await import('mammoth');
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value;
  }
}
