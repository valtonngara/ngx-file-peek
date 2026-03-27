# ngx-file-peek

[![npm version](https://img.shields.io/npm/v/ngx-file-peek.svg)](https://www.npmjs.com/package/ngx-file-peek)
[![license](https://img.shields.io/npm/l/ngx-file-peek.svg)](https://github.com/valtonngara/ngx-file-peek/blob/main/LICENSE)

**Peek at any file without opening it.** An Angular standalone component that renders real file content as thumbnails — from any URL, any storage.

Pass a file URL (S3, MinIO, Azure Blob, Firebase, Google Cloud, or any HTTP link) and `ngx-file-peek` renders an actual preview of the file content. No file opening, no downloads, no iframes.

---

## Supported File Types

| File Type | What You See |
|---|---|
| **Images** (.jpg, .png, .gif, .webp, .svg) | The actual image, lazy-loaded |
| **PDF** (.pdf) | First page rendered on canvas via PDF.js |
| **Word** (.doc, .docx) | Real document content parsed via mammoth.js |
| **Excel** (.xls, .xlsx) | Spreadsheet table rendered via SheetJS |
| **Other** | Clean file-type icon with label |

---

## Quick Start

### 1. Install

```bash
npm install ngx-file-peek @angular/cdk pdfjs-dist mammoth xlsx
```

### 2. Configure

Add `provideFilePreview()` to your app config:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
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

### 3. Use

```typescript
import { Component } from '@angular/core';
import { FileThumbnailComponent } from 'ngx-file-peek';

@Component({
  standalone: true,
  imports: [FileThumbnailComponent],
  template: `
    <fp-file-thumbnail [url]="fileUrl" size="md" />
  `,
})
export class MyComponent {
  fileUrl = 'https://my-storage.com/files/report.pdf';
}
```

That's it. The component detects the file type from the URL and renders real content.

---

## Usage Examples

### File Grid — Show thumbnails of all files

Perfect for file managers, document libraries, or media galleries:

```typescript
import { Component } from '@angular/core';
import { FileThumbnailComponent } from 'ngx-file-peek';

@Component({
  standalone: true,
  imports: [FileThumbnailComponent],
  template: `
    <div class="file-grid">
      @for (file of files; track file.url) {
        <div class="file-card">
          <fp-file-thumbnail [url]="file.url" size="md" />
          <span>{{ file.name }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .file-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
    }
    .file-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
  `],
})
export class FileGridComponent {
  // URLs from your API, MinIO, S3, Azure Blob, Firebase, etc.
  files = [
    { name: 'Team Photo',      url: 'https://minio.myapp.com/bucket/team.jpg' },
    { name: 'Q4 Report',       url: 'https://s3.amazonaws.com/docs/q4-report.pdf' },
    { name: 'Proposal',        url: 'https://storage.googleapis.com/files/proposal.docx' },
    { name: 'Budget 2026',     url: 'https://myapi.com/files/budget.xlsx?token=abc123' },
    { name: 'Architecture',    url: 'https://cdn.example.com/diagram.png' },
    { name: 'Backup',          url: 'https://storage.example.com/backup.zip' },
  ];
}
```

### File List with Hover Preview

For file lists where you want a tooltip preview on hover:

```typescript
import { Component } from '@angular/core';
import { FilePreviewTooltipDirective } from 'ngx-file-peek';

@Component({
  standalone: true,
  imports: [FilePreviewTooltipDirective],
  template: `
    <ul class="file-list">
      @for (file of files; track file.url) {
        <li [filePreviewTooltip]="file.url">
          {{ file.name }}
        </li>
      }
    </ul>
  `,
  styles: [`
    .file-list li {
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
    }
    .file-list li:hover {
      background: #f9f9f9;
    }
  `],
})
export class FileListComponent {
  files = [
    { name: 'invoice-march.pdf',   url: 'https://api.myapp.com/files/invoice.pdf' },
    { name: 'contract-v2.docx',    url: 'https://api.myapp.com/files/contract.docx' },
    { name: 'sales-data.xlsx',     url: 'https://api.myapp.com/files/sales.xlsx' },
  ];
}
```

Hovering a file name shows a large (200x200) floating preview of the actual file content.

### Combined — Grid with Tooltip

Use both together: thumbnails in a grid, with an even larger preview on hover:

```typescript
import { Component } from '@angular/core';
import { FileThumbnailComponent, FilePreviewTooltipDirective } from 'ngx-file-peek';

@Component({
  standalone: true,
  imports: [FileThumbnailComponent, FilePreviewTooltipDirective],
  template: `
    <div class="file-grid">
      @for (file of files; track file.url) {
        <div class="file-card" [filePreviewTooltip]="file.url">
          <fp-file-thumbnail [url]="file.url" size="sm" />
          <span>{{ file.name }}</span>
        </div>
      }
    </div>
  `,
})
export class FileBrowserComponent {
  files = [ /* your files from any storage */ ];
}
```

---

## Works With Any Storage

Just pass the URL. `ngx-file-peek` doesn't care where your files live:

```typescript
// Amazon S3
url = 'https://my-bucket.s3.amazonaws.com/docs/report.pdf';

// MinIO
url = 'https://minio.myapp.com/bucket/image.png';

// Azure Blob Storage
url = 'https://myaccount.blob.core.windows.net/container/file.docx';

// Google Cloud Storage
url = 'https://storage.googleapis.com/my-bucket/spreadsheet.xlsx';

// Firebase Storage
url = 'https://firebasestorage.googleapis.com/v0/b/my-app/o/photo.jpg?alt=media';

// Presigned URLs with auth tokens
url = 'https://api.myapp.com/files/doc.pdf?token=eyJhbGciOi...';

// Your own API
url = 'https://api.myapp.com/download/12345';
```

The file type is detected from the URL extension. Query strings and auth tokens are stripped before detection.

---

## API Reference

### `<fp-file-thumbnail>`

The main component. Renders file content as a thumbnail.

```html
<fp-file-thumbnail [url]="fileUrl" [size]="'md'" [tooltip]="false" />
```

| Input | Type | Default | Description |
|---|---|---|---|
| `url` | `string` | *required* | URL to the file |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Thumbnail dimensions |
| `tooltip` | `boolean` | `false` | Show larger preview on hover |

### `[filePreviewTooltip]`

Directive that shows a floating preview tooltip on hover. Apply it to any element.

```html
<div [filePreviewTooltip]="fileUrl">Hover me</div>
```

| Input | Type | Description |
|---|---|---|
| `filePreviewTooltip` | `string` | URL to preview on hover |

### `provideFilePreview(config)`

Provider function to configure the library. Add to your app's providers array.

```typescript
provideFilePreview({
  pdfWorkerUrl: '...',  // Required for PDF rendering
  tooltipDelay: 300,    // ms before tooltip appears
  placeholderTheme: 'minimal', // 'minimal' or 'branded'
})
```

| Option | Type | Default | Description |
|---|---|---|---|
| `pdfWorkerUrl` | `string` | `undefined` | URL to PDF.js web worker (required for PDFs) |
| `tooltipDelay` | `number` | `300` | Delay in ms before tooltip shows |
| `placeholderTheme` | `'minimal' \| 'branded'` | `'minimal'` | Style for unknown file placeholders |

### Exported Types

```typescript
import { FileType, ThumbnailSize, FilePreviewConfig } from 'ngx-file-peek';

// FileType enum: 'image' | 'pdf' | 'word' | 'excel' | 'unknown'
// ThumbnailSize: 'sm' | 'md' | 'lg'
```

---

## Thumbnail Sizes

| Size | Dimensions | Use Case |
|---|---|---|
| `sm` | 80 x 80 px | Compact lists, tables |
| `md` | 120 x 120 px | File grids, cards |
| `lg` | 200 x 200 px | Detail views, tooltips |

---

## Theming

Customize the look with CSS custom properties:

```css
:root {
  --ngx-fp-border-radius: 8px;
  --ngx-fp-bg: #ffffff;
  --ngx-fp-placeholder-bg: #f5f5f5;
}
```

### Dark Mode Example

```css
.dark-theme {
  --ngx-fp-bg: #1e1e1e;
  --ngx-fp-placeholder-bg: #2d2d2d;
  --ngx-fp-border-radius: 12px;
}
```

---

## Requirements

- Angular 17+ (standalone components, signal inputs)
- `@angular/cdk` — for tooltip overlay positioning
- `pdfjs-dist` — for PDF page rendering
- `mammoth` — for Word document parsing
- `xlsx` — for Excel spreadsheet parsing

---

## License

[MIT](LICENSE) -- Valton Gara
