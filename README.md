# ngx-file-peek

Angular standalone component that renders **file content thumbnails** from any URL — images, PDFs, Word docs, and Excel spreadsheets. Works with any storage: S3, MinIO, Azure Blob, Firebase, or any HTTP link.

## What it does

| File Type | Thumbnail Shows |
|---|---|
| Images (.jpg, .png, .gif, .webp, .svg) | The actual image |
| PDF (.pdf) | First page rendered via PDF.js |
| Word (.doc, .docx) | Document content via mammoth.js |
| Excel (.xls, .xlsx) | Spreadsheet table via SheetJS |
| Unknown | Generic file icon |

## Install

```bash
npm install ngx-file-peek @angular/cdk pdfjs-dist mammoth xlsx
```

## Setup

```typescript
// app.config.ts
import { provideFilePreview } from 'ngx-file-peek';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFilePreview({
      pdfWorkerUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.5.207/build/pdf.worker.min.mjs',
      tooltipDelay: 300,
    }),
  ],
};
```

## Usage

### Grid view — thumbnails showing file content

```typescript
import { FileThumbnailComponent } from 'ngx-file-peek';

@Component({
  imports: [FileThumbnailComponent],
  template: `
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
      @for (file of files; track file.url) {
        <fp-file-thumbnail [url]="file.url" size="md" />
      }
    </div>
  `,
})
export class MyFilesComponent {
  files = [
    { name: 'photo.jpg', url: 'https://my-minio.com/bucket/photo.jpg' },
    { name: 'report.pdf', url: 'https://s3.amazonaws.com/docs/report.pdf' },
    { name: 'proposal.docx', url: 'https://storage.example.com/proposal.docx' },
    { name: 'data.xlsx', url: 'https://api.example.com/files/data.xlsx?token=abc' },
  ];
}
```

### List view — hover to preview

```typescript
import { FilePreviewTooltipDirective } from 'ngx-file-peek';

@Component({
  imports: [FilePreviewTooltipDirective],
  template: `
    @for (file of files; track file.url) {
      <div [filePreviewTooltip]="file.url">
        {{ file.name }}
      </div>
    }
  `,
})
```

### Sizes

| Size | Dimensions |
|---|---|
| `sm` | 80 × 80px |
| `md` | 120 × 120px |
| `lg` | 200 × 200px |

### Theming

Override CSS custom properties:

```css
:root {
  --ngx-fp-border-radius: 8px;
  --ngx-fp-bg: #ffffff;
  --ngx-fp-placeholder-bg: #f5f5f5;
}
```

## API

### `<fp-file-thumbnail>`

| Input | Type | Default | Description |
|---|---|---|---|
| `url` | `string` | required | File URL from any storage |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Thumbnail size |
| `tooltip` | `boolean` | `false` | Show preview on hover |

### `[filePreviewTooltip]`

| Input | Type | Description |
|---|---|---|
| `filePreviewTooltip` | `string` | File URL to preview on hover |

### `provideFilePreview(config)`

| Option | Type | Default | Description |
|---|---|---|---|
| `pdfWorkerUrl` | `string` | — | URL to PDF.js worker |
| `tooltipDelay` | `number` | `300` | Tooltip delay in ms |
| `placeholderTheme` | `'minimal' \| 'branded'` | `'minimal'` | Placeholder style |

## License

MIT
