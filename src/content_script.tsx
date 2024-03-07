chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // 対象の<th>を取得
    const ths = document.querySelectorAll("th.jbc-text-sub");
    // 実労働時間を取得
    const actualWorkingHoursThElement = Array.from(ths).find((th) => th.textContent === '実労働時間');
    const actualWorkingHoursTd = actualWorkingHoursThElement?.nextElementSibling;
    const actualWorkingHoursSpan = actualWorkingHoursTd?.querySelector('.info-content.text-right.text-nowrap.d-inline-block');
    const actualWorkingHour = actualWorkingHoursSpan?.textContent;
    console.log('取得した実労働時間のtd:', actualWorkingHour);

    // 月規定労働時間を取得
    const monthProvisionWorkingHoursThElement = Array.from(ths).find((th) => th.textContent === '月規定労働時間');
    const monthProvisionWorkingHoursTd = monthProvisionWorkingHoursThElement?.nextElementSibling;
    const monthProvisionWorkingHoursSpan = monthProvisionWorkingHoursTd?.querySelector('.info-content.text-right.text-nowrap.d-inline-block');
    const monthProvisionWorkingHours = monthProvisionWorkingHoursSpan?.textContent;
    console.log('取得した月規定労働時間のtd:', monthProvisionWorkingHours);

    // 平日出勤日数を取得
    const workingDaysThElement = Array.from(ths).find((th) => th.textContent === '平日出勤日数');
    const workingDaysTd = workingDaysThElement?.nextElementSibling;
    const workingDaysSpan = workingDaysTd?.querySelector('.info-content.text-right.text-nowrap.d-inline-block');
    const workingDays = workingDaysSpan?.textContent;
    console.log('取得した平日出勤日数のtd:', workingDays);

    // 勤務中の時間を取得
    const table = document.querySelectorAll(".table-responsive");
    const trs = table[0].querySelectorAll("tr");
    const workingTrs = Array.from(trs).filter((tr) => tr.textContent?.includes('勤務中'));
    const todayWorkingHours = Array.from(workingTrs).map((tr) => tr.querySelector('td:nth-child(6)')?.textContent);
    console.log('取得した勤務中の時間:', todayWorkingHours[0] ?? '00:00');

    // 所定労働日数を取得
    const scheduledWorkingDays = Array.from(ths).find((th) => th.textContent === '所定労働日数');
    const scheduledWorkingDaysTd = scheduledWorkingDays?.nextElementSibling;
    const actualScheduledWorkingDays = scheduledWorkingDaysTd?.textContent;
    console.log('取得した所定労働日数:', actualScheduledWorkingDays);

    // 有給時間の取得
    const footerTable = document.querySelectorAll(".jbc-table-footer");
    // 9番目のtdを取得
    const footerTableTd = footerTable[0].querySelectorAll("td");
    const paidLeaveHoursTd = footerTableTd[8];
    const paidLeaveHours = paidLeaveHoursTd?.textContent;
    console.log('取得した有給時間:', paidLeaveHours);

    // 有給を取得
    const paidLeaveDaysThElement = Array.from(ths).find((th) => th.textContent === '有休(全休)');
    const paidLeaveDaysTd = paidLeaveDaysThElement?.nextElementSibling;
    const paidLeaveDaysSpan = paidLeaveDaysTd?.querySelector('.info-content.text-right.text-nowrap.d-inline-block');
    const paidLeaveDays = paidLeaveDaysSpan?.textContent;
    console.log('取得した有休(全休)', paidLeaveDays);

    // 振休を取得
    const substituteHolidayThElement = Array.from(ths).find((th) => th.textContent === '振休(全休)');
    const substituteHolidayTd = substituteHolidayThElement?.nextElementSibling;
    const substituteHolidaySpan = substituteHolidayTd?.querySelector('.info-content.text-right.text-nowrap.d-inline-block');
    const substituteHoliday = substituteHolidaySpan?.textContent;
    console.log('振休(全休)', substituteHoliday);


    // オブジェクトにして返却する
    const result = {
      'actualWorkingHour': actualWorkingHour,
      'workingDays': workingDays,
      'todayWorkingHours': todayWorkingHours[0] ?? '00:00',
      'scheduledWorkingDays': actualScheduledWorkingDays,
      'monthProvisionWorkingHours': monthProvisionWorkingHours,
      'paidLeaveHours': paidLeaveHours,
      'paidLeaveDays': paidLeaveDays ?? '0',
      'substituteHoliday': substituteHoliday ?? '0'
    }
    sendResponse(result);
});
