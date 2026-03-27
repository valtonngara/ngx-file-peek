import { Injectable } from '@angular/core';

export interface SheetData {
  headers: string[];
  rows: string[][];
}

@Injectable({ providedIn: 'root' })
export class ExcelRendererService {
  async renderToTable(url: string): Promise<SheetData> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const json: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (json.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = (json[0] ?? []).map(cell => String(cell ?? ''));
    const rows = json.slice(1, 20).map(row =>
      headers.map((_, i) => String(row[i] ?? ''))
    );

    return { headers, rows };
  }
}
