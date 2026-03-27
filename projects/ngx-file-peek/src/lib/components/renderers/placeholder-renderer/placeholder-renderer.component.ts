import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { FileType } from '../../../models/file-preview.models';

interface PlaceholderMeta {
  label: string;
  color: string;
  letter: string;
}

const META: Record<string, PlaceholderMeta> = {
  [FileType.Word]: { label: 'Word Document', color: '#2b579a', letter: 'W' },
  [FileType.Excel]: { label: 'Excel Spreadsheet', color: '#217346', letter: 'X' },
  [FileType.Unknown]: { label: 'File', color: '#6b7280', letter: '?' },
};

@Component({
  selector: 'fp-placeholder-renderer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="placeholder" [style.width.px]="size()" [style.height.px]="size()">
      <svg viewBox="0 0 64 64" [attr.width]="iconSize()" [attr.height]="iconSize()">
        <!-- File shape -->
        <path d="M16 4h22l14 14v38a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"
              [attr.fill]="meta().color" opacity="0.12" stroke="none"/>
        <path d="M16 4h22l14 14v38a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"
              fill="none" [attr.stroke]="meta().color" stroke-width="2"/>
        <!-- Folded corner -->
        <path d="M38 4v10a4 4 0 0 0 4 4h10" fill="none" [attr.stroke]="meta().color" stroke-width="2"/>
        <!-- Letter -->
        <text x="32" y="44" text-anchor="middle" [attr.fill]="meta().color"
              font-size="20" font-weight="700" font-family="sans-serif">
          {{ meta().letter }}
        </text>
      </svg>
      <span class="label" [style.color]="meta().color">{{ meta().label }}</span>
    </div>
  `,
  styleUrl: './placeholder-renderer.component.scss',
})
export class PlaceholderRendererComponent {
  fileType = input<FileType>(FileType.Unknown);
  size = input<number>(120);

  meta = computed<PlaceholderMeta>(() => META[this.fileType()] ?? META[FileType.Unknown]);
  iconSize = computed(() => Math.round(this.size() * 0.45));
}
