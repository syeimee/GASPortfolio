/**
 * メニュー追加用関数
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi(); // Uiクラスを取得する
  var menu = ui.createMenu('実行'); // Uiクラスからメニューを作成する
  menu.addItem('スケジュール作成', 'trans_schedule'); // メニューにアイテムを追加する
  menu.addToUi();// メニューをUiクラスに追加する
}

/**
 * 講師スケジュールと生徒スケジュール用関数を同時に実行
 */
function trans_schedule(){
  trans_teacher_schedule();
  trans_student_schedule();
  updateRadioButtonOptions();
  SpreadsheetApp.getActiveSpreadsheet().toast("処理が完了しました", "通知", 3);
}