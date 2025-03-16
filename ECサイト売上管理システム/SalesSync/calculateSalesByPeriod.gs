/*
* calculateSalesByPeriod　期間ごとの集計用関数
* 一旦、集計期間は1週間毎とする。
*　
*/

function calculateSalesByPeriod(csvArray, startDate, endDate) {
  // 集計結果を格納するオブジェクト
  var calculatedSalesData = {};

  // ヘッダー（1行目）を除外したデータの処理
  for (var i = 1; i < csvArray.length; i++) {
    var sku = csvArray[i][0];  // SKU
    var quantity = parseInt(csvArray[i][1], 10);  // 数量
    var date = csvArray[i][2];  // 日付

    // 日付が期間内かどうかをチェック
    if (new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate)) {
      if (!calculatedSalesData[sku]) {
        calculatedSalesData[sku] = 0;  // SKUごとの集計を初期化
      }
      calculatedSalesData[sku] += quantity;  // SKUごとに数量を加算
    }
  }

  return calculatedSalesData;
}
