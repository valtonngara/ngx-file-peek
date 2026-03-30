# ngx-file-peek

[![npm version](https://img.shields.io/npm/v/ngx-file-peek.svg)](https://www.npmjs.com/package/ngx-file-peek)
[![license](https://img.shields.io/npm/l/ngx-file-peek.svg)](https://github.com/valtonngara/ngx-file-peek/blob/main/LICENSE)

**Peek at any file without opening it.** An Angular standalone component library that renders real file content as thumbnails from any URL, any storage.

Pass a file URL (S3, MinIO, Azure Blob, Firebase, Google Cloud, or any HTTP link) and `ngx-file-peek` renders an actual preview of the content. No file opening, no downloads, no iframes.

---

## Supported File Types

| File Type | What You See |
|---|---|
| **Images** (.jpg, .png, .gif, .webp, .svg) | The actual image, lazy-loaded |
| **PDF** (.pdf) | First page rendered on canvas via PDF.js |
| **Word** (.doc, .docx) | Document content parsed via mammoth.js |
| **Excel** (.xls, .xlsx) | Spreadsheet table rendered via ExcelJS |
| **Other** | Clean file-type icon with label |

---

## Quick Start

### 1. Install

```bash
npm install ngx-file-peek @angular/cdk pdfjs-dist mammoth exceljs
```

### 2. Configure

```typescript
// app.config.ts
import { provideFilePreview } from 'ngx-file-peek';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFilePreview({
      pdfWorkerUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5/build/pdf.worker.min.mjs',
      tooltipDelay: 300,
    }),
  ],
};
```

### 3. Use

```typescript
import { FileThumbnailComponent } from 'ngx-file-peek';

@Component({
  standalone: true,
  imports: [FileThumbnailComponent],
  template: `<fp-file-thumbnail [url]="fileUrl" size="md" />`,
})
export class MyComponent {
  fileUrl = 'https://my-storage.com/files/report.pdf';
}
```

---

## Usage Examples

### Grid View -- Thumbnails showing file content

```typescript
import { FileThumbnailComponent } from 'ngx-file-peek';

@Component({
  standalone: true,
  imports: [FileThumbnailComponent],
  template: `
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
      @for (file of files; track file.url) {
        <fp-file-thumbnail [url]="file.url" size="md" />
      }
    </div>
  `,
})
export class FileGridComponent {
  files = [
    { url: 'https://minio.myapp.com/bucket/photo.jpg' },
    { url: 'https://s3.amazonaws.com/docs/report.pdf' },
    { url: 'https://storage.example.com/proposal.docx' },
    { url: 'https://api.example.com/files/data.xlsx?token=abc' },
  ];
}
```

### List View -- Hover to preview

```typescript
import { FilePreviewTooltipDirective } from 'ngx-file-peek';

@Component({
  standalone: true,
  imports: [FilePreviewTooltipDirective],
  template: `
    @for (file of files; track file.url) {
      <div [filePreviewTooltip]="file.url" style="padding: 8px; cursor: pointer;">
        {{ file.name }}
      </div>
    }
  `,
})
export class FileListComponent {
  files = [
    { name: 'invoice.pdf',   url: 'https://api.myapp.com/files/invoice.pdf' },
    { name: 'contract.docx', url: 'https://api.myapp.com/files/contract.docx' },
    { name: 'sales.xlsx',    url: 'https://api.myapp.com/files/sales.xlsx' },
  ];
}
```

Hovering a file shows a floating preview with:
- File name and type badge
- Full content preview (320px)
- **Pin** -- keep the tooltip open
- **Maximize** -- open in a full-screen lightbox
- **Download** -- save the file
- **Open in new tab** -- view in browser

### Grid + Tooltip combined

```typescript
import { FileThumbnailComponent, FilePreviewTooltipDirective } from 'ngx-file-peek';

@Component({
  standalone: true,
  imports: [FileThumbnailComponent, FilePreviewTooltipDirective],
  template: `
    @for (file of files; track file.url) {
      <div [filePreviewTooltip]="file.url">
        <fp-file-thumbnail [url]="file.url" size="sm" />
        <span>{{ file.name }}</span>
      </div>
    }
  `,
})
```

---

## Works With Any Storage

Just pass the URL:

```typescript
// Amazon S3
'https://my-bucket.s3.amazonaws.com/docs/report.pdf'

// MinIO
'https://minio.myapp.com/bucket/image.png'

// Azure Blob Storage
'https://myaccount.blob.core.windows.net/container/file.docx'

// Google Cloud Storage
'https://storage.googleapis.com/my-bucket/spreadsheet.xlsx'

// Firebase Storage
'https://firebasestorage.googleapis.com/v0/b/my-app/o/photo.jpg?alt=media'

// Presigned URLs with auth tokens
'https://api.myapp.com/files/doc.pdf?token=eyJhbGciOi...'
```

File type is detected from the URL extension. Query strings and tokens are stripped before detection.

---

## API Reference

### `<fp-file-thumbnail>`

| Input | Type | Default | Description |
|---|---|---|---|
| `url` | `string` | *required* | File URL from any storage |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Thumbnail size |
| `tooltip` | `boolean` | `false` | Show preview tooltip on hover |

**Sizes:** `sm` = 80px, `md` = 120px, `lg` = 200px

### `[filePreviewTooltip]`

| Input | Type | Description |
|---|---|---|
| `filePreviewTooltip` | `string` | File URL to preview on hover |

The tooltip includes an action bar with pin, maximize, download, and open-in-new-tab buttons. Mouse can move into the tooltip to interact with these buttons.

### `provideFilePreview(config)`

| Option | Type | Default | Description |
|---|---|---|---|
| `pdfWorkerUrl` | `string` | -- | URL to PDF.js worker (required for PDFs) |
| `tooltipDelay` | `number` | `300` | Delay in ms before tooltip appears |
| `placeholderTheme` | `'minimal' \| 'branded'` | `'minimal'` | Placeholder style for unknown types |

### Exported Types

```typescript
import { FileType, ThumbnailSize, FilePreviewConfig } from 'ngx-file-peek';
```

---

## Theming

```css
:root {
  --ngx-fp-border-radius: 8px;
  --ngx-fp-bg: #ffffff;
  --ngx-fp-placeholder-bg: #f5f5f5;
}

/* Dark mode */
.dark {
  --ngx-fp-bg: #1e1e1e;
  --ngx-fp-placeholder-bg: #2d2d2d;
}
```

---

## Requirements

- Angular 17+ (standalone components, signal inputs)
- `@angular/cdk` -- overlay positioning
- `pdfjs-dist` -- PDF rendering
- `mammoth` -- Word document parsing
- `exceljs` -- Excel spreadsheet parsing

## License

[MIT](LICENSE) -- Valton Gara
