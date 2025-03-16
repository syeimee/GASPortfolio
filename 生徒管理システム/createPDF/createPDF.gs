/**
 * 印刷用関数
 */

function print (){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();

  const settingSheet = ss.getSheetByName('印刷設定シート');
  const month = settingSheet.getRange('C11').getValue();; //ドライブIDを取得
  const driveId = settingSheet.getRange('C4').getValue();; //印刷月を取得
  const parentFolder = DriveApp.getFolderById(driveId); // 印刷設定シートで設定したID

　if (!month || !driveId) {
    Browser.msgBox("設定シートのドライブIDまたは印刷月が設定されていません。");
    return;
  }

  //月フォルダの作成
  let folder;
  const folders = parentFolder.getFoldersByName(month);
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = parentFolder.createFolder(month);
  }

  let found = false; // シートが見つかったかどうかのフラグ

  sheets.forEach(sheet => {
    const sheetName = sheet.getName();
    if (sheetName.includes(month)) { 
      Utilities.sleep(5000);
      const pdfBlob = convertSheetToPDF(ss.getId(), sheet.getSheetId());
      folder.createFile(pdfBlob.setName(sheetName + ".pdf"));
      found = true;
    }
  });

  if (!found) {
    Browser.msgBox("指定した月のシートが存在しません。");
  } else {
    SpreadsheetApp.getActiveSpreadsheet().toast("処理が完了しました", "通知", 3);
  }

}

function convertSheetToPDF(spreadsheetId, sheetId) {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=pdf&gid=${sheetId}`;
  const token = ScriptApp.getOAuthToken();
  const response = UrlFetchApp.fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  return response.getBlob();
}
