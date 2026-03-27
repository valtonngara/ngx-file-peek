import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'projects/ngx-file-preview-demo/public/samples');

// --- Generate Excel file ---
const wb = XLSX.utils.book_new();
const data = [
  ['Product', 'Q1 Sales', 'Q2 Sales', 'Q3 Sales', 'Q4 Sales', 'Total'],
  ['Laptops', 12500, 13200, 14800, 16100, 56600],
  ['Phones', 28300, 31500, 29800, 35200, 124800],
  ['Tablets', 8700, 9100, 10200, 11500, 39500],
  ['Monitors', 5400, 6200, 5900, 7300, 24800],
  ['Keyboards', 3200, 3500, 3800, 4100, 14600],
  ['Mice', 2100, 2400, 2600, 2900, 10000],
  ['Headsets', 4500, 5200, 5800, 6400, 21900],
  ['Cameras', 1800, 2100, 2400, 2700, 9000],
  ['Speakers', 3100, 3400, 3700, 4000, 14200],
  ['Printers', 2200, 2500, 2800, 3100, 10600],
];
const ws = XLSX.utils.aoa_to_sheet(data);
ws['!cols'] = [{ wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
XLSX.writeFile(wb, path.join(outDir, 'sample.xlsx'));
console.log('Created sample.xlsx');

// --- Generate DOCX file (minimal valid docx using raw zip) ---
// A docx is a zip with specific XML files. We'll create a minimal one.
import { createRequire } from 'module';

// Using JSZip which is already a transitive dependency (mammoth depends on it)
// But let's use a simpler approach - create it with the `archiver` pattern manually
// Actually, let's just use the built-in approach with xlsx's zip utilities

// Minimal DOCX structure
const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:pStyle w:val="Title"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="48"/></w:rPr><w:t>Project Proposal</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>Overview</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>This document outlines the key objectives and milestones for the upcoming product launch scheduled for Q3 2026. The project aims to deliver a comprehensive solution that addresses customer needs identified through extensive market research.</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>Key Objectives</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>
      <w:r><w:t>Increase market share by 15% within the first quarter of launch</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>
      <w:r><w:t>Achieve a customer satisfaction score of 4.5 or higher</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>
      <w:r><w:t>Reduce time-to-market by 20% compared to previous releases</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>Timeline</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Phase 1: Research and planning (January - March 2026)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Phase 2: Development and testing (April - June 2026)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Phase 3: Launch and monitoring (July - September 2026)</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>Budget Summary</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>The total estimated budget for this project is $2.4 million, allocated across engineering (60%), marketing (25%), and operations (15%). Detailed budget breakdowns are available in the accompanying spreadsheet.</w:t></w:r>
    </w:p>
  </w:body>
</w:document>`;

// Use JSZip (available as transitive dep from mammoth)
const JSZip = (await import('jszip')).default;
const zip = new JSZip();
zip.file('[Content_Types].xml', contentTypesXml);
zip.folder('_rels').file('.rels', relsXml);
zip.folder('word').file('document.xml', documentXml);

const docxBuffer = await zip.generateAsync({ type: 'nodebuffer' });
fs.writeFileSync(path.join(outDir, 'sample.docx'), docxBuffer);
console.log('Created sample.docx');

// --- Download a real PDF ---
const pdfUrl = 'https://www.africau.edu/images/default/sample.pdf';
try {
  const resp = await fetch(pdfUrl);
  if (resp.ok) {
    const buffer = Buffer.from(await resp.arrayBuffer());
    fs.writeFileSync(path.join(outDir, 'sample.pdf'), buffer);
    console.log('Downloaded sample.pdf');
  } else {
    console.log('PDF download failed, creating minimal PDF');
    createMinimalPdf();
  }
} catch (e) {
  console.log('PDF download failed, creating minimal PDF');
  createMinimalPdf();
}

function createMinimalPdf() {
  // Create a minimal valid PDF
  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]
   /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj

4 0 obj
<< /Length 184 >>
stream
BT
/F1 28 Tf
100 700 Td
(Annual Report 2026) Tj
/F1 14 Tf
100 650 Td
(Revenue Growth Analysis) Tj
/F1 12 Tf
100 600 Td
(This report covers the financial performance) Tj
100 580 Td
(and strategic initiatives for the fiscal year.) Tj
ET
endstream
endobj

5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000266 00000 n
0000000502 00000 n

trailer
<< /Size 6 /Root 1 0 R >>
startxref
575
%%EOF`;
  fs.writeFileSync(path.join(outDir, 'sample.pdf'), pdf);
}

console.log('All sample files generated!');
