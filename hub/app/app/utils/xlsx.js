import * as XLSX from 'xlsx';

export function parseXls(values, fields) {
  return values.map(linhaValor => {
    let ret = {};
    fields.map((field, fieldIndex) => {
      if (linhaValor[fieldIndex] != undefined) ret[field] = linhaValor[fieldIndex]
    });
    return ret;
  })
}

export function readXLSX(fileBuffer, sheets = []) {
  const wb = XLSX.read(fileBuffer, { type: "buffer" });

  let readOut = [];
  for (let sheet of sheets) {
    const sheetValue = wb.SheetNames[sheet];
    const ws = wb.Sheets[sheetValue];


    let rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: null, blankrows: false, rawNumbers: true })

    readOut.push(rows);
  }

  return readOut;
}

export function writeXLSX(fileName, workSheets) {

  let wb = XLSX.utils.book_new();
  for (let workSheet of workSheets) {
    let { ws, sheetName } = workSheet;
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }

  XLSX.writeFile(wb, fileName);
}

export function createWorkSheet(data, sheetName, merge, header) {
  let ws = {};
  if (merge) ws['!merges'] = merge;

  if (header) XLSX.utils.sheet_add_aoa(ws, header);

  XLSX.utils.sheet_add_json(
    ws,
    data,
    {
      cellDates: true,
      origin: header ? 1 : 0,
      dense: true,
      compression: true
    }
  );


  return { ws, sheetName }
}

export function addAoaToWorkSheet(ws, data, rowIndex) {
  XLSX.utils.sheet_add_aoa(ws, data, { origin: rowIndex });
}

