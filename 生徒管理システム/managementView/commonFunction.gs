function isFiscalYear(targetDate) {
  const current_date = new Date(); 
  const target_year = targetDate.getFullYear();
  const target_month = targetDate.getMonth()+1;

  let fiscal_year_start_date, fiscal_year_end_date;
  if (target_month >= 4) {
    // 4月以降ならその年が会計年度の開始
    fiscal_year_start_date = new Date(target_year, 3, 1);  // 4月1日 (月は0ベースなので3)
    fiscal_year_end_date = new Date(target_year + 1, 2, 31); // 翌年3月31日
  } else {
    // 1月〜3月なら前年が会計年度の開始
    fiscal_year_start_date = new Date(target_year - 1, 3, 1); // 前年4月1日
    fiscal_year_end_date = new Date(target_year, 2, 31);     // その年の3月31日
  }

  if (current_date>=fiscal_year_start_date && current_date <=fiscal_year_end_date){
    return true;
  }else{
    return false;
  }
}