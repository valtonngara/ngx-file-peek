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
    const ExcelJS = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const sheet = workbook.worksheets[0];

    if (!sheet || sheet.rowCount === 0) {
      return { headers: [], rows: [] };
    }

    const headerRow = sheet.getRow(1);
    const colCount = headerRow.cellCount;
    const headers: string[] = [];
    for (let col = 1; col <= colCount; col++) {
      headers.push(String(headerRow.getCell(col).value ?? ''));
    }

    const rows: string[][] = [];
    const maxRows = Math.min(sheet.rowCount, 20);
    for (let rowNum = 2; rowNum <= maxRows; rowNum++) {
      const row = sheet.getRow(rowNum);
      rows.push(headers.map((_, i) => String(row.getCell(i + 1).value ?? '')));
    }

    return { headers, rows };
  }
}
