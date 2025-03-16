/**
 * 講師スケジュール雛形から各講師のシートを生成し、student_classesから取得したデータを出力する
 */
function trans_teacher_schedule(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const base_sheet = ss.getSheetByName('講師スケジュール'); // コピー元シート
  
  const teachers = getDataFromSheet("teachers");
  const teacher_infos = teachers.filter(teacher => teacher.disabled !== 1);
  teacher_infos.forEach(teacher_info =>{   
    let new_sheet = base_sheet.copyTo(ss); // コピー元シートを新しいシートとして複製
    // 既存のシートがある場合は削除
    let existingSheet = ss.getSheetByName(teacher_info.fullname);
    if (existingSheet) {
      ss.deleteSheet(existingSheet);
    }
    new_sheet.setName(teacher_info.fullname); //シート名を講師名に変更
    new_sheet.getRange('A1').setValue(teacher_info.teacher_id);
    new_sheet.getRange('E2').setValue(teacher_info.fullname);
    get_teacher_schedule(teacher_info.fullname)
  })
}

/**
 * 引数で指定したシートにstudent_classesから取得した授業情報を出力する
 */
function get_teacher_schedule(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const teacher_cd = sheet.getRange('A1').getValue();

  if (!teacher_cd) {
    Browser.msgBox("A1セルの教師コードが設定されていません");
    return;
  }

  if (!sheet) {
    Logger.log("シートが存在しません: " + sheet.getName());
    return;
  }

  const student_classes = getDataFromSheet("student_classes");

  // teacher_cd が一致する授業データをフィルタリング
  const class_schedules = student_classes.filter(classData => classData.teacher_id === teacher_cd && classData.disabled !== 1);

  if (class_schedules && class_schedules.length > 0) {
    class_schedules.forEach(class_schedule => {
      // 日付が文字列の場合、Date オブジェクトに変換
      const date = new Date(class_schedule.date);
      const month = date.getMonth() + 1;  // getMonth() は 0から11 なので +1 して実際の月に
      const day = date.getDate();

      const first_month_cell = sheet.getRange('C4').getValue();
      const second_month_cell = sheet.getRange('C86').getValue();
      const third_month_cell = sheet.getRange('C169').getValue();

      //当該年度でのみ処理を行う
      if(isFiscalYear(date)){
        let start_day_column = null;
        // 月初の日付セルを取得
        switch (true) {
          case (first_month_cell === month):
            start_day_column = 7;
            break;
          case (second_month_cell === month):
            start_day_column = 89;
            break;
          case (third_month_cell === month):
            start_day_column = 172;
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
            Browser.msgBox("予定が重複している箇所があります。処理を中断します。");
            return;
          }

          range.merge();//セルの結合

          const student = getDataFromSheet("students").find(student => student.student_id === class_schedule.student_id);
          const student_name = student ? student.common_name : 'NAME ERROR';
          range.setValue(student_name);//名前のセット
          range.setFontSize(6);//ファントサイズ6px

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
