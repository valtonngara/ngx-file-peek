import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'fp-image-renderer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img
      [src]="url()"
      [width]="size()"
      [height]="size()"
      loading="lazy"
      alt="File preview"
    />
  `,
  styleUrl: './image-renderer.component.scss',
})
export class ImageRendererComponent {
  url = input.required<string>();
  size = input<number>(120);
}
