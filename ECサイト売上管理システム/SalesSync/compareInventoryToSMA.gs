/**
 * SKUごとに単純移動平均（SMA）を使用して売上予測を計算する関数
 * 
 * @param {Array} salesData - 売上データの配列 (例: [[SKU, 数量, 日付], [A123, 10, 2025-03-01], ...])
 * @param {number} period - 移動平均を計算する期間 (例: 3)
 * @returns {Object} - 各SKUごとに計算された移動平均のオブジェクト
 */
function calculateSMABySKU(salesData, period) {
  var skuSales = {};

  // ヘッダーを除いてデータ部分だけを扱う
  for (var i = 1; i < salesData.length; i++) {
    var sku = salesData[i][0];  // SKU
    var quantity = salesData[i][1];  // 数量
    
    // SKUごとに数量を配列として保存
    if (!skuSales[sku]) {
      skuSales[sku] = [];
    }
    skuSales[sku].push(quantity);
  }

  var smaResults = {};

  // SKUごとに単純移動平均を計算
  for (var sku in skuSales) {
    var sales = skuSales[sku];
    smaResults[sku] = calculateSimpleMovingAverage(sales, period);
  }

  return smaResults;
}

/**
 * 単純移動平均（SMA）を計算する関数
 * 
 * @param {Array} salesData - 数量データの配列
 * @param {number} period - 移動平均を計算する期間
 * @returns {Array} - 計算された移動平均の配列
 */
function calculateSimpleMovingAverage(salesData, period) {
  var smaArray = [];

  // salesData の長さが期間より短い場合は計算しない
  if (salesData.length < period) {
    Logger.log("売上データが期間に足りません。");
    return smaArray;
  }

  // 単純移動平均の計算
  for (var i = 0; i <= salesData.length - period; i++) {
    var sum = 0;
    // 現在の期間内の売上データを合計
    for (var j = i; j < i + period; j++) {
      sum += salesData[j];
    }
    // 期間内の平均を計算し、結果を配列に追加
    var average = sum / period;
    smaArray.push(average);
  }

  return smaArray;
}

