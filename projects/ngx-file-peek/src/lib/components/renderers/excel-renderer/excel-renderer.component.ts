import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
  signal,
  afterNextRender,
} from '@angular/core';
import { ExcelRendererService, SheetData } from '../../../services/excel-renderer.service';

@Component({
  selector: 'fp-excel-renderer',
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
                fill="#217346" opacity="0.12" stroke="none"/>
          <path d="M16 4h22l14 14v38a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"
                fill="none" stroke="#217346" stroke-width="2"/>
          <text x="32" y="44" text-anchor="middle" fill="#217346"
                font-size="20" font-weight="700" font-family="sans-serif">X</text>
        </svg>
        <span>Cannot load</span>
      </div>
    }
    @if (!loading() && !error() && sheetData()) {
      <div class="table-wrapper" [style.width.px]="size()" [style.height.px]="size()">
        <table>
          @if (sheetData()!.headers.length > 0) {
            <thead>
              <tr>
                @for (header of sheetData()!.headers; track $index) {
                  <th>{{ header }}</th>
                }
              </tr>
            </thead>
          }
          <tbody>
            @for (row of sheetData()!.rows; track $index) {
              <tr>
                @for (cell of row; track $index) {
                  <td>{{ cell }}</td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styleUrl: './excel-renderer.component.scss',
})
export class ExcelRendererComponent {
  url = input.required<string>();
  size = input<number>(120);

  loading = signal(true);
  error = signal(false);
  sheetData = signal<SheetData | null>(null);

  private readonly excelService = inject(ExcelRendererService);

  constructor() {
    afterNextRender(() => this.render());
  }

  private async render(): Promise<void> {
    try {
      const data = await this.excelService.renderToTable(this.url());
      this.sheetData.set(data);
      this.loading.set(false);
    } catch {
      this.loading.set(false);
      this.error.set(true);
    }
  }
}
