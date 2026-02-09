


function generateCalendar(mm, yy) {
  const daysInMonth = new Date(yy, mm, 0).getDate();
  const firstDay = (new Date(yy, mm - 1, 1).getDay() + 6) % 7;
  const today = new Date();

  let table = "<table>";
table += "<tr><th colspan='7' style='text-align:center;'>"
       + "<button class='nav-btn' onclick='prevMonth()'><i class='fas fa-caret-left'></i></button> "
       + "" + mm + "/" + yy
       + " <button class='nav-btn' onclick='nextMonth()'><i class='fas fa-caret-right'></i></button>"
       + "</th></tr>";

  table += "<tr><th>T2</th><th>T3</th><th>T4</th><th>T5</th><th>T6</th><th>T7</th><th>CN</th></tr>";

  let date = 1;
  for (let i = 0; i < 6; i++) {
    table += "<tr>";
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        table += "<td></td>";
      } else if (date > daysInMonth) {
        table += "<td></td>";
      } else {
        const lunar = getLunarDate(date, mm, yy);

        // Tính ngày dương kế tiếp và ngày âm kế tiếp
        const nextGregorian = new Date(yy, mm - 1, date + 1);
        const nextLunar = getLunarDate(
          nextGregorian.getDate(),
          nextGregorian.getMonth() + 1,
          nextGregorian.getFullYear()
        );

        let classes = "";

// Uposatha: 8, 15, 23, và cuối tháng âm:
const isEndOfLunarMonth = (lunar.day === 30) || (lunar.day === 29 && nextLunar.day === 1);
const isUposatha = (lunar.day === 8) || (lunar.day === 15) || (lunar.day === 23) || isEndOfLunarMonth;

let iconHtml = ""; // Variable to hold the icon HTML

if (isUposatha) {
  classes += "uposatha ";
  if (lunar.day === 8) {
     iconHtml = '<i class="wi wi-moon-alt-first-quarter"></i>';
  } else if (lunar.day === 15) {
     iconHtml = '<i class="wi wi-moon-alt-full"></i>';
  } else if (lunar.day === 23) {
     iconHtml = '<i class="wi wi-moon-alt-third-quarter"></i>';
  } else {
     iconHtml = '<i class="wi wi-moon-alt-new"></i>';
  }
}

if (date === today.getDate() && mm === (today.getMonth() + 1) && yy === today.getFullYear()) {
  classes += "today ";
}

let lunarText = lunar.day;
if (lunar.day === 1) {
  lunarText += "/" + lunar.month;
}

// Combine: Date number + Lunar container (Lunar Text + Moon Icon)
let displayText = date + "<span class='lunar'>" + lunarText + " " + iconHtml + "</span>";

table += "<td class='cell " + classes + "'>" + displayText + "</td>";

        date++;
      }
    }
    table += "</tr>";
  }
  table += "</table>";
  return table;
}

// Đọc tháng/năm từ URL và hiển thị
function initCalendar() {
  getSelectedMonth(); // sets currentMonth/currentYear
  document.getElementById("calendar").innerHTML = generateCalendar(currentMonth, currentYear);
  document.SelectMonth.month.value = currentMonth;
  document.SelectMonth.year.value = currentYear;
}

// Nút "Xem lịch"
function viewMonth(mm, yy) {
  currentMonth = mm;
  currentYear = yy;
  document.getElementById("calendar").innerHTML = generateCalendar(mm, yy);
  document.SelectMonth.month.value = mm;
  document.SelectMonth.year.value = yy;
}


// Nút "Tháng trước"
function prevMonth() {
  let mm = currentMonth - 1;
  let yy = currentYear;
  if (mm < 1) { mm = 12; yy--; }
  viewMonth(mm, yy);
}

// Nút "Tháng sau"
function nextMonth() {
  let mm = currentMonth + 1;
  let yy = currentYear;
  if (mm > 12) { mm = 1; yy++; }
  viewMonth(mm, yy);
}

initCalendar();

function goToday() {
  const now = new Date();
  let mm = now.getMonth() + 1;
  let yy = now.getFullYear();
  const todayDate = now.getDate();

  // Hiển thị tháng hiện tại
  viewMonth(mm, yy);

  // Hàm phụ: tìm và highlight Uposatha sau today trong tháng mm/yy
  function highlightNextUposatha(mm, yy, todayDate) {
    const cells = document.querySelectorAll("#calendar td.uposatha");
    let closestCell = null;
    let minDiff = Infinity;

    cells.forEach(cell => {
      const dayText = cell.innerHTML.split("<span")[0];
      const day = parseInt(dayText);
      if (!isNaN(day) && day > todayDate) {
        const diff = day - todayDate;
        if (diff < minDiff) {
          minDiff = diff;
          closestCell = cell;
        }
      }
    });

    if (closestCell) {
      closestCell.classList.add("next-uposatha");
      return true;
    }
    return false;
  }

  // Thử highlight trong tháng hiện tại
  let found = highlightNextUposatha(mm, yy, todayDate);

  // Nếu không tìm thấy, nhảy sang tháng kế tiếp
  if (!found) {
    mm++;
    if (mm > 12) { mm = 1; yy++; }
    viewMonth(mm, yy);
    // highlight Uposatha đầu tiên trong tháng mới
    const cells = document.querySelectorAll("#calendar td.uposatha");
    if (cells.length > 0) {
      cells[0].classList.add("next-uposatha");
    }
  }
}




