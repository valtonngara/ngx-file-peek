import { Component, signal } from '@angular/core';
import { FileThumbnailComponent, FilePreviewTooltipDirective } from 'ngx-file-peek';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FileThumbnailComponent, FilePreviewTooltipDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  darkMode = signal(false);
  activeView = signal<'grid' | 'list'>('grid');

  files = [
    { url: 'https://picsum.photos/seed/landscape/800/600.jpg', name: 'landscape-photo.jpg', label: 'Landscape Photo', type: 'image', size: '2.4 MB', date: 'Mar 24, 2026' },
    { url: 'https://picsum.photos/seed/portrait/600/800.jpg', name: 'team-portrait.png', label: 'Team Portrait', type: 'image', size: '1.8 MB', date: 'Mar 22, 2026' },
    { url: '/samples/sample.pdf', name: 'annual-report-2026.pdf', label: 'Annual Report 2026', type: 'pdf', size: '1.7 KB', date: 'Mar 20, 2026' },
    { url: '/samples/sample.docx', name: 'project-proposal.docx', label: 'Project Proposal', type: 'word', size: '845 B', date: 'Mar 18, 2026' },
    { url: '/samples/sample.xlsx', name: 'sales-data-q1.xlsx', label: 'Sales Data Q1', type: 'excel', size: '1.2 KB', date: 'Mar 15, 2026' },
    { url: 'https://example.com/archive.zip', name: 'backup-archive.zip', label: 'Backup Archive', type: 'unknown', size: '45.2 MB', date: 'Mar 10, 2026' },
  ];

  toggleTheme(): void {
    this.darkMode.set(!this.darkMode());
  }

  setView(view: 'grid' | 'list'): void {
    this.activeView.set(view);
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      pdf: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
      word: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      excel: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      unknown: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    };
    return icons[type] || icons['unknown'];
  }

  getTypeBadgeClass(type: string): string {
    return `badge-${type}`;
  }
}
