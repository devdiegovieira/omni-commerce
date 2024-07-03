import Excel from 'exceljs';
import { saveAs } from 'file-saver';

export const createWorkBook = () => {
  return new Excel.Workbook();
}

export const createWorkSheet = (workbook, wsName = 'Planilha', headers = []) => {
  const sheet = workbook.addWorksheet(wsName);
  sheet.columns = headers;

  return sheet;
}

export const addRowsToSheet = (sheet, rows = []) => {
  for (let i = 0; i < rows.length; i++) {
    sheet.addRow(rows[i]);
  }
}

export function saveExcell (workbook, fileName) {
  workbook.xlsx.writeBuffer({ base64: true })
  .then( xls64 => saveAs(
    new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    fileName
  ))
  .catch(err => console.log(err)) 
}