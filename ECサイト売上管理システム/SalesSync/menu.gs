/*
* メニュー表示用関数
*　
*/

function onOpen() {
  var ui = SpreadsheetApp.getUi(); // Uiクラスを取得する
  var menu = ui.createMenu('実行'); // Uiクラスからメニューを作成する
  menu.addItem('CSV取り込み', 'doSalesSync'); // メニューにアイテムを追加する
  menu.addToUi();// メニューをUiクラスに追加する
}


function doSalesSync() {
  var salesData = importCSVFromFolder();  // フォルダからCSVデータをインポート
  // 期間ごとの集計を実行
  var calcDataArray = calculateSalesByPeriod(salesData, '2025-03-01', '2025-03-08');
    
  var period = 3;  // 例えば過去3日間の移動平均を計算
  var smaResults = calculateSMABySKU(salesData,period);

  var dummyAtualInventory  = {
    A123: 12,
    A124: 19,
    A125: 30
  };

  var results = compareInventoryToSMA(salesData, dummyAtualInventory, period) 
  // 結果をログに出力
  Logger.log(`CSV売上実データ: ${JSON.stringify(salesData)}`);
  Logger.log(`期間内集計結果: ${JSON.stringify(calcDataArray)}`);
  Logger.log(`単純移動平均結果: ${JSON.stringify(smaResults)}`);
  Logger.log(`実在庫比較: ${JSON.stringify(results)}`);
} 