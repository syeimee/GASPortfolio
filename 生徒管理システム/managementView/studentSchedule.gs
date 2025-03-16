/**
 * 生徒スケジュール雛形から各講師のシートを生成し、student_classesから取得したデータを出力する
 */
function trans_student_schedule(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const base_sheet = ss.getSheetByName('生徒スケジュール'); // コピー元シート
  
  const students = getDataFromSheet("students");
  const student_infos = students.filter(student => student.disabled !== 1);
  student_infos.forEach(student_info =>{   
    let new_sheet = base_sheet.copyTo(ss); // コピー元シートを新しいシートとして複製
    // 既存のシートがある場合は削除
    let existingSheet = ss.getSheetByName(student_info.fullname);
    if (existingSheet) {
      ss.deleteSheet(existingSheet);
    }
    new_sheet.setName(student_info.fullname); //シート名を講師名に変更
    new_sheet.getRange('A1').setValue(student_info.student_id);
    new_sheet.getRange('AB1').setValue(student_info.fullname);
    get_student_schedule(student_info.fullname)
  })
}

/**
 * 引数で指定したシートにstudent_classesから取得した授業情報を出力する
 */
function get_student_schedule(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const student_id = sheet.getRange('A1').getValue();

  if (!student_id) {
    Browser.msgBox("A1セルの生徒管理番号が設定されていません");
    return;
  }

  if (!sheet) {
    Logger.log("シートが存在しません: " + sheet.getName());
    return;
  }

  const student_classes = getDataFromSheet("student_classes");

  // teacher_cd が一致する授業データをフィルタリング
  const class_schedules = student_classes.filter(classData => classData.student_id === student_id && classData.disabled === 0);

  if (class_schedules && class_schedules.length > 0) {
    class_schedules.forEach(class_schedule => {
      // 日付が文字列の場合、Date オブジェクトに変換
      const date = new Date(class_schedule.date);
      const month = date.getMonth() + 1;  // getMonth() は 0から11 なので +1 して実際の月に
      const day = date.getDate();

      const first_month_cell = sheet.getRange('C10').getValue();
      const second_month_cell = sheet.getRange('C92').getValue();

      //当該年度でのみ処理を行う
      if(isFiscalYear(date)){
        let start_day_column = null;
        // 月初の日付セルを取得
        switch (true) {
          case (first_month_cell === month):
            start_day_column = 13;
            break;
          case (second_month_cell === month):
            start_day_column = 95;
            break;
          default:
        }
        // start_day_column が null でない場合
        if (start_day_column !== null) {
          const start_hour = Number(class_schedule.start_hour_cd);
          const end_hour = Number(class_schedule.end_hour_cd);

          if(start_hour > end_hour){
            Browser.msgBox("授業開始時間が授業終了時間より後になっている箇所があります。処理を中断します。");
            return;
          }

          const range = sheet.getRange(start_hour + start_day_column, day + 2, end_hour - start_hour, 1);

          // 既に結合されているかチェック
          if (range.isPartOfMerge()) {
            Browser.msgBox("予定が重複しています。再登録を行い処理を再実行してください");
            return;
          }
          range.merge();//セルの結合

          const subject = getDataFromSheet("subjects").find(subject => subject.subject_cd === class_schedule.subject_cd && subject.disabled !== 1);
          const subject_name = subject ? subject.subject_name : 'NAME ERROR';
          range.setValue(subject_name);//科目名
          range.setFontSize(6);//ファントサイズ6px
          range.setBorder(true, true, true, true, false, false, "blue", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

          if(class_schedule.is_completed !== 1){
            range.setBorder(true, true, true, true, false, false, "blue", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
          }else{
            range.setBorder(true, true, true, true, false, false, "blue", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
            range.setBackground("#0000FF");
            range.setFontColor("#FFFFFF");
          }

        }else{
            Browser.msgBox("該当月がありません");
            return;
        }
      }
    });
  } else {
    Logger.log("該当する授業データがありません");
}



}
