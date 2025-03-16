// /**
//  * 授業報告フォーム用の関数
//  */

function updateRadioButtonOptions() {
  var formId = "1Ed-ch3lwjkZi0JCT_bBYcn2V3ESWxeqoMPQgly1QngI"; // GoogleフォームのIDを設定

  // シートから必要なデータを取得
  const student_classes = getDataFromSheet("student_classes");
  const class_schedules = student_classes.filter(classData => (classData.id !== null || classData.id !== "")&& classData.disabled !==1 && classData.is_completed !==1.0);
  const students = getDataFromSheet("students");
  const subjects = getDataFromSheet("subjects");
  const hours = getDataFromSheet("hours");

  let output_arr = [];
  class_schedules.forEach(class_schedule =>{
    let date = new Date(class_schedule.date);
    let formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy/MM/dd");
    let student = students.find(student => student.student_id.toString() === class_schedule.student_id.toString() );
    let subject = subjects.find(subject => subject.subject_cd.toString() === class_schedule.subject_cd.toString());
    let start_hour = hours.find(hour => hour.id.toString() === class_schedule.start_hour_cd.toString() );
    let end_hour = hours.find(hour => hour.id.toString() === class_schedule.end_hour_cd.toString() );

    let _start_hour = new Date(start_hour.hhmm);
    let formatted_start_hour = Utilities.formatDate(_start_hour, Session.getScriptTimeZone(), "hh:mm");
    let _end_hour = new Date(end_hour.hhmm);
    let formatted_end_hour = Utilities.formatDate(_end_hour, Session.getScriptTimeZone(), "hh:mm");

    Logger.log(start_hour);
    output_arr.push("【コマID:"+class_schedule.id+"】   "+student.fullname + ",    "+formattedDate+",    "+subject.subject_name+",    "+formatted_start_hour+" ~ "+formatted_end_hour);
  })
  output_arr = Array.from(new Set(output_arr));

  var form = FormApp.openById(formId);
  var items = form.getItems(FormApp.ItemType.MULTIPLE_CHOICE); // ラジオボタンの質問を取得

  // 最初のラジオボタン質問を更新
  if (items.length > 0) {
    var question = items[0].asMultipleChoiceItem(); // 最初のラジオボタン質問を取得

    // 生徒名の配列を選択肢として設定
    var choices = output_arr.map(output => question.createChoice(output)); 
    question.setChoices(choices); // 選択肢を更新
  }
}
