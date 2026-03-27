import { Component } from '@angular/core';
import { FileThumbnailComponent, FilePreviewTooltipDirective } from 'ngx-file-peek';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FileThumbnailComponent, FilePreviewTooltipDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  files = [
    { url: 'https://picsum.photos/seed/demo1/400/300.jpg', label: 'Image 1' },
    { url: 'https://picsum.photos/seed/demo2/400/300.jpg', label: 'Image 2' },
    { url: '/samples/sample.pdf', label: 'PDF Document' },
    { url: '/samples/sample.docx', label: 'Word Document' },
    { url: '/samples/sample.xlsx', label: 'Excel Spreadsheet' },
    { url: 'https://example.com/archive.zip', label: 'Unknown File' },
  ];
}
