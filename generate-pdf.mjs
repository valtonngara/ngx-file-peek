import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'projects/ngx-file-preview-demo/public/samples');

const doc = await PDFDocument.create();
const page = doc.addPage([612, 792]);
const helvetica = await doc.embedFont(StandardFonts.Helvetica);
const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

const black = rgb(0, 0, 0);
const dark = rgb(0.15, 0.15, 0.15);
const gray = rgb(0.35, 0.35, 0.35);

let y = 720;

function title(text, size = 24) {
  page.drawText(text, { x: 72, y, size, font: helveticaBold, color: black });
  y -= size + 16;
}

function heading(text, size = 14) {
  y -= 10;
  page.drawText(text, { x: 72, y, size, font: helveticaBold, color: dark });
  y -= size + 8;
}

function body(text, size = 11) {
  page.drawText(text, { x: 72, y, size, font: helvetica, color: gray });
  y -= size + 6;
}

title('Annual Report 2026');
body('Revenue Growth Analysis', 14);
y -= 4;
body('Prepared by the Finance Department');
y -= 12;

heading('Executive Summary');
body('This report provides a comprehensive overview of our');
body('financial performance during FY2026. Key highlights');
body('include a 23% increase in total revenue, expansion');
body('into three new markets, and successful launch of');
body('our flagship product line.');

heading('Financial Highlights');
body('Total Revenue: $48.2M  (+23% YoY)');
body('Operating Margin: 18.5%  (+3.2pp)');
body('Net Income: $8.9M  (+31% YoY)');
body('Customer Count: 12,400  (+2,100)');

heading('Market Expansion');
body('Successfully entered the European, Asian, and');
body('South American markets with strong initial traction.');
body('International revenue now accounts for 35% of total.');

const pdfBytes = await doc.save();
fs.writeFileSync(path.join(outDir, 'sample.pdf'), pdfBytes);
console.log(`Created sample.pdf (${pdfBytes.length} bytes)`);
