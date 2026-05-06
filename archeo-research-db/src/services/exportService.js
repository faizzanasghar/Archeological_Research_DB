import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const ExportService = {
  exportToPDF: (title, columns, data, filename = 'report.pdf') => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    doc.autoTable({
      head: [columns],
      body: data,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 8, font: 'helvetica' },
      headStyles: { fillColor: [30, 58, 138] } // Brand Navy
    });
    doc.save(filename);
  },

  exportToExcel: async (title, columns, data, filename = 'report.xlsx') => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);

    worksheet.columns = columns.map(col => ({ header: col, key: col, width: 20 }));
    worksheet.addRows(data);

    // Styling
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
  }
};
