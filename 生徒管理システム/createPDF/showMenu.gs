/**
 * メニュー表示用関数
 */

function onOpen (){
  var ui = SpreadsheetApp.getUi(); // Uiクラスを取得する
  var menu = ui.createMenu('印刷'); // Uiクラスからメニューを作成する
  menu.addItem('PDF出力', 'print'); // メニューにアイテムを追加する
  menu.addToUi();// メニューをUiクラスに追加する
}