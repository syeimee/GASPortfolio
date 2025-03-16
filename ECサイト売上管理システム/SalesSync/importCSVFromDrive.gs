/*
* importCSVFromFolder　CSV取り込み用関数
* 特定のドライブに保存した特定のファイル名.csvを配列データとして取り出す。
*
*/

function importCSVFromFolder() {
  var folderId ='1DzMO-aQqMDImc4LYT7RidpTWtEhzslc4';  // 対象のフォルダIDを指定
  var fileName = 'test.csv';  // 取得したいCSVファイルの名前
  var folder = DriveApp.getFolderById(folderId);  // フォルダを取得
  var files = folder.getFilesByName(fileName);  // フォルダ内で指定された名前のファイルを検索
  
  if (files.hasNext()) {
    var file = files.next();  // 最初に一致したファイルを取得
    var csvData = file.getBlob().getDataAsString();  // CSVデータを文字列として取得
    var csvArray = CSVToArray(csvData, ',');  // CSVデータを配列に変換
    csvArray = csvArray.filter(function(row) { return row.length > 0; })

    for (var i = 1; i < csvArray.length; i++) {
      csvArray[i][1] = parseFloat(csvArray[i][1]); // 数量（2列目）を数値に変換
    }

    return csvArray;
  } else {
    Logger.log('指定した名前のCSVファイルが見つかりません。');
  }
}

// CSVを配列に変換する関数
function CSVToArray(strData, strDelimiter) {
  var objPattern = new RegExp(
    (
      // Delimiters
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
      // Quoted fields
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
      // Non-quoted fields
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );

  var arrData = [[]];  // 最初の配列を空にして開始
  var arrMatches = null;

  while (arrMatches = objPattern.exec(strData)) {
    var strMatchedDelimiter = arrMatches[1];
    var strMatchedValue;

    // デリミタが異なれば新しい行を追加
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      arrData.push([]);
    }

    // クオート内かクオート外の値を取得
    if (arrMatches[2]) {
      strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
    } else {
      strMatchedValue = arrMatches[3];
    }

    strMatchedValue = strMatchedValue.replace(/\u200B/g, '').trim();  // ゼロ幅スペース削除と余分な空白削除

    // 最後の行に値を追加
    if (strMatchedValue !== "") { // 空白のセルは無視
      arrData[arrData.length - 1].push(strMatchedValue);
    }
  }

  return arrData;
}
