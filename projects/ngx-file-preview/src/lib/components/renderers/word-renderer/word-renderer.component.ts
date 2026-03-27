import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
  signal,
  afterNextRender,
  ElementRef,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WordRendererService } from '../../../services/word-renderer.service';

@Component({
  selector: 'fp-word-renderer',
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
        <svg viewBox="0 0 64 64" width="32" height="32">
          <path d="M16 4h22l14 14v38a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"
                fill="#2b579a" opacity="0.12" stroke="none"/>
          <path d="M16 4h22l14 14v38a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"
                fill="none" stroke="#2b579a" stroke-width="2"/>
          <text x="32" y="44" text-anchor="middle" fill="#2b579a"
                font-size="20" font-weight="700" font-family="sans-serif">W</text>
        </svg>
        <span>Cannot load</span>
      </div>
    }
    @if (!loading() && !error()) {
      <div class="doc-content"
           #contentEl
           [style.width.px]="size()"
           [style.height.px]="size()"
           [innerHTML]="htmlContent()">
      </div>
    }
  `,
  styleUrl: './word-renderer.component.scss',
})
export class WordRendererComponent {
  url = input.required<string>();
  size = input<number>(120);

  loading = signal(true);
  error = signal(false);
  htmlContent = signal<SafeHtml>('');

  private readonly wordService = inject(WordRendererService);
  private readonly sanitizer = inject(DomSanitizer);

  constructor() {
    afterNextRender(() => this.render());
  }

  private async render(): Promise<void> {
    try {
      const html = await this.wordService.renderToHtml(this.url());
      this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(html));
      this.loading.set(false);
    } catch {
      this.loading.set(false);
      this.error.set(true);
    }
  }
}
