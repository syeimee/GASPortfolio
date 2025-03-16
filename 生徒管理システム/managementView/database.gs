/*
* データ取得関数　getDataFromSheet
* 引数で指定したシートのデータをオブジェクトとして返す。IDが""のときは値を取得しない。
* IDが""のときは値を取得しない。　
*/

function getDataFromSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    Logger.log("シートが存在しません: " + sheetName);
    return [];
  }
  
  const data = sheet.getDataRange().getValues(); // 全データ取得
  const headers = data.shift(); // 1行目をヘッダーとして取得

  // ヘッダーとデータを組み合わせてオブジェクト化
  return data
  .filter(row => row.some(cell => cell !== "")) 
  .map(row => {
    let record = {};
    headers.forEach((header, index) => {
      record[header] = row[index];
    });
    return record;
  });
}








