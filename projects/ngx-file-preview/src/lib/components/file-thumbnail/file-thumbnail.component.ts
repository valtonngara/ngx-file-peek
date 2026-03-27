import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { FileType, ThumbnailSize, THUMBNAIL_SIZE_MAP } from '../../models/file-preview.models';
import { FileTypeService } from '../../services/file-type.service';
import { ImageRendererComponent } from '../renderers/image-renderer/image-renderer.component';
import { PdfRendererComponent } from '../renderers/pdf-renderer/pdf-renderer.component';
import { WordRendererComponent } from '../renderers/word-renderer/word-renderer.component';
import { ExcelRendererComponent } from '../renderers/excel-renderer/excel-renderer.component';
import { PlaceholderRendererComponent } from '../renderers/placeholder-renderer/placeholder-renderer.component';

@Component({
  selector: 'fp-file-thumbnail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImageRendererComponent,
    PdfRendererComponent,
    WordRendererComponent,
    ExcelRendererComponent,
    PlaceholderRendererComponent,
  ],
  templateUrl: './file-thumbnail.component.html',
  styleUrl: './file-thumbnail.component.scss',
})
export class FileThumbnailComponent {
  url = input.required<string>();
  size = input<ThumbnailSize>('md');
  tooltip = input<boolean>(false);

  private readonly fileTypeService = inject(FileTypeService);

  fileType = computed(() => this.fileTypeService.detectType(this.url()));
  pixelSize = computed(() => THUMBNAIL_SIZE_MAP[this.size()]);
}
