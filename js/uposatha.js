


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




const DHAMMAPADA = [
  {t:"\"Ý dẫn đầu các pháp,<br>        Ý làm chủ, ý tạo;<br>        Nếu với ý ô nhiễm,<br>        Nói lên hay hành động,<br>        Khổ não bước theo sau,<br>        Như xe, chân vật kéo \".", r:"Kinh Pháp Cú 1", l:"#"},
  {t:"\"Ý dẫn đầu các pháp,<br>        Ý làm chủ, ý tạo,<br>        Nếu với ý thanh tịnh,<br>        Nói lên hay hành động,<br>        An lạc bước theo sau,<br>        Như bóng, không rời hình \".", r:"Kinh Pháp Cú 2", l:"#"},
  {t:"\"Nó mắng tôi, đánh tôi,<br>        Nó thắng tôi, cướp tôi \"<br>        Ai ôm hiềm hận ấy,<br>        Hận thù không thể nguôi.", r:"Kinh Pháp Cú 3", l:"#"},
  {t:"\"Nó mắng tôi, đánh tôi,<br>        Nó thắng tôi, cướp tôi, \"<br>        Không ôm hiềm hận ấy,<br>        Hận thù được tự nguôi.", r:"Kinh Pháp Cú 4", l:"#"},
  {t:"\"Với hận diệt hận thù,<br>        Ðời này không có được.<br>        Không hận diệt hận thù,<br>        Là định luật ngàn thu \".", r:"Kinh Pháp Cú 5", l:"#"},
  {t:"\"Người khác không hiểu biết,<br>        Chúng ta đây bị hại.<br>        Chỗ ấy, ai biết được<br>        Tranh luận được lắng êm.\"", r:"Kinh Pháp Cú 6", l:"#"},
  {t:"\"Ai sống nhìn tịnh tướng,<br>        không hộ trì các căn,<br>        ăn uống thiếu tiết độ,<br>        biếng nhác, chẳng tinh cần.<br>        Ma uy hiếp kẻ ấy,<br>        như cây yếu trước gió \".", r:"Kinh Pháp Cú 7", l:"#"},
  {t:"\"Ai sống quán bất tịnh,<br>        Khéo hộ trì các căn,<br>        ăn uống có tiết độ,<br>        có lòng tin, tinh cần,<br>        Ma không uy hiếp được,<br>        Như núi đá, trước gió\"", r:"Kinh Pháp Cú 8", l:"#"},
  {t:"\"Ai mặc áo cà sa,<br>        tâm chưa rời uế trược,<br>        không tự chế, không thực,<br>        không xứng áo cà sa \".", r:"Kinh Pháp Cú 9", l:"#"},
  {t:"\"Ai rời bỏ uế trược,<br>        giới luật khéo nghiêm trì,<br>        tự chế, sống chơn thực,<br>        thật xứng áo cà sa.\"", r:"Kinh Pháp Cú 10", l:"#"},
  {t:"\"Không chân, tưởng chân thật,<br>        Chân thật, thấy không chân<br>        Họ không đạt chân thật<br>        Do tà tư tà hạnh", r:"Kinh Pháp Cú 11", l:"#"},
  {t:"\"Chân thật, biết chân thật,<br>        Không chân, biết không chân.<br>        Chúng đạt được chân thật,<br>        do chánh tư, chánh hạnh.\"", r:"Kinh Pháp Cú 12", l:"#"},
  {t:"\"Như ngôi nhà vụng lợp,<br>        Mưa liền xâm nhập vào.<br>        Cũng vậy tâm không tu,<br>        Tham dục liền xâm nhập.\"", r:"Kinh Pháp Cú 13", l:"#"},
  {t:"\"Như ngôi nhà khéo lợp,<br>        Mưa không xâm nhập vào.<br>        Cũng vậy tâm khéo tu,<br>        Tham dục không xâm nhập.\"", r:"Kinh Pháp Cú 14", l:"#"},
  {t:"\"Nay sầu, đời sau sầu,<br>        Kẻ ác, hai đời sầu;<br>        Nó sầu, nó ưu não,<br>        Thấy nghiệp uế mình làm.\"", r:"Kinh Pháp Cú 15", l:"#"},
  {t:"\"Nay vui, đời sau vui,<br>        Làm phước, hai đời vui.<br>        Người ấý vui, an vui,<br>        Thấy nghiệp tịnh mình làm.\"", r:"Kinh Pháp Cú 16", l:"#"},
  {t:"\"Nay than, đời sau than,<br>        Kẻ ác, hai đời than,<br>        than rằng: \"Ta làm ác \"<br>        Ðọa cõi dữ, than hơn.\"", r:"Kinh Pháp Cú 17", l:"#"},
  {t:"\"Nay sướng, đời sau sướng,<br>        Làm phước, hai đời sướng.<br>        Mừng rằng: \"Ta làm thiện \",<br>        Sanh cõi lành, sướng hơn.\"", r:"Kinh Pháp Cú 18", l:"#"},
  {t:"\"Nếu người nói nhiều kinh,<br>        Không hành trì, phóng dật;<br>        Như kẻ chăn bò người,<br>        Không phần Sa môn hạnh.\"", r:"Kinh Pháp Cú 19", l:"#"},
  {t:"\"Dầu nói ít kinh điển,<br>        Nhưng hành pháp, tùy pháp,<br>        Từ bỏ tham, sân, si,<br>        Tỉnh giác, tâm giải thoát,<br>        Không chấp thủ hai đời,<br>        Dự phần Sa môn hạnh.\"", r:"Kinh Pháp Cú 20", l:"#"},
  {t:"\"Không phóng dật, đường sống,<br>        Phóng dật là đường chết.<br>        Không phóng dật, không chết,<br>        Phóng dật như chết rồi.\"", r:"Kinh Pháp Cú 21", l:"#"},
  {t:"\"Biết rõ sai biệt ấy,<br>        Người trí không phóng dật,<br>        Hoan hỷ, không phóng dật,<br>        An vui hạnh bậc Thánh.\"", r:"Kinh Pháp Cú 22", l:"#"},
  {t:"\"Người hằng tu thiền định,<br>        Thường kiên trì tinh tấn.<br>        Bậc trí hưởng Niết Bàn,<br>        Ách an tịnh vô thượng.\"", r:"Kinh Pháp Cú 23", l:"#"},
  {t:"\"Nỗ lực, giữ chánh niệm,<br>        Tịnh hạnh, hành thận trọng<br>        Tự điều, sống theo pháp,<br>        Ai sống không phóng dật,<br>        Tiếng lành ngày tăng trưởng.\"", r:"Kinh Pháp Cú 24", l:"#"},
  {t:"\"Nỗ lực, không phóng dật,<br>        Tự điều, khéo chế ngự.<br>        Bậc trí xây hòn đảo,<br>        Nước lụt khó ngập tràn.\"", r:"Kinh Pháp Cú 25", l:"#"},
  {t:"\"Họ ngu si thiếu trí,<br>        Chuyên sống đời phóng dật.<br>        Người trí, không phóng dật,<br>        Như giữ tài sản quý.\"", r:"Kinh Pháp Cú 26", l:"#"},
  {t:"\"Chớ sống đời phóng dật,<br>        Chớ mê say dục lạc.<br>        Không phóng dật, thiền định,<br>        Ðạt được an lạc lớn.\"", r:"Kinh Pháp Cú 27", l:"#"},
  {t:"\"Người trí dẹp phóng dật,<br>        Với hạnh không phóng dật,<br>        Leo lầu cao trí tuệ,<br>        Không sầu, nhìn khổ sầu,<br>        Bậc trí đứng núi cao,<br>        Nhìn kẻ ngu, đất bằng.\"", r:"Kinh Pháp Cú 28", l:"#"},
  {t:"\"Tinh cần giữa phóng dật,<br>        Tỉnh thức giữa quần mê.<br>        Người trí như ngựa phi,<br>        Bỏ sau con ngựa hèn.\"", r:"Kinh Pháp Cú 29", l:"#"},
  {t:"\"Ðế Thích không phóng dật,<br>        Ðạt ngôi vị Thiên chủ.<br>        Không phóng dật, được khen;<br>        Phóng dật, thường bị trách.\"", r:"Kinh Pháp Cú 30", l:"#"},
  {t:"\"Vui thích không phóng dật,<br>        Tỷ kheo sợ phóng dật,<br>        Bước tới như lửa hừng,<br>        Thiêu kiết sử lớn nhỏ.\"", r:"Kinh Pháp Cú 31", l:"#"},
  {t:"\"Vui thích không phóng dật,<br>        Tỷ kheo sợ phóng dật,<br>        Không thể bị thối đọa,<br>        Nhất định gần Niết Bàn.\"", r:"Kinh Pháp Cú 32", l:"#"},
  {t:"\"Tâm hoảng hốt giao động,<br>        Khó hộ trì, khó nhiếp,<br>        Người trí làm tâm thẳng,<br>        Như thợ tên, làm tên.\"", r:"Kinh Pháp Cú 33", l:"#"},
  {t:"\"Như cá quăng trên bờ,<br>        Vất ra ngoài thủy giới;<br>        Tâm này vũng vẫy mạnh,<br>        Hãy đoạn thế lực Ma.\"", r:"Kinh Pháp Cú 34", l:"#"},
  {t:"\"Khó nắm giữ, khinh động,<br>        Theo các dục quay cuồng.<br>        Lành thay, điều phục tâm;<br>        Tâm điều, an lạc đến.\"", r:"Kinh Pháp Cú 35", l:"#"},
  {t:"\"Tâm khó thấy, tế nhị,<br>        Theo các dục quay cuồng.<br>        Người trí phòng hộ tâm,<br>        Tâm hộ, an lạc đến.\"", r:"Kinh Pháp Cú 36", l:"#"},
  {t:"\"Chạy xa, sống một mình,<br>        Không thân, ẩn hang sâu<br>        Ai điều phục được tâm,<br>        Thoát khỏi Ma trói buộc\"", r:"Kinh Pháp Cú 37", l:"#"},
  {t:"\"Ai tâm không an trú,<br>        Không biết chân diệu pháp,<br>        Tịnh tín bị rúng động,<br>        Trí tuệ không viên thành.\"", r:"Kinh Pháp Cú 38", l:"#"},
  {t:"\"Tâm không đầy tràn dục,<br>        Tâm không (hận) công phá,<br>        Ðoạn tuyệt mọi thiện ác,<br>        Kẻ tỉnh không sợ hãi,\"", r:"Kinh Pháp Cú 39", l:"#"},
  {t:"\"Biết thân như đồ gốm,<br>        Trú tâm như thành trì,<br>        Chống ma với gươm trí;<br>        Giữ chiến thắng không tham\"", r:"Kinh Pháp Cú 40", l:"#"},
  {t:"\"Không bao lâu thân này,<br>        Sẽ nằm dài trên đất,<br>        Bị vất bỏ, vô thức,<br>        Như khúc cây vô dụng.\"", r:"Kinh Pháp Cú 41", l:"#"},
  {t:"\"Kẻ thù hại kẻ thù,<br>        Oan gia hại oan gia,<br>        Không bằng tâm hướng tà,<br>        Gây ác cho tự thân.\"", r:"Kinh Pháp Cú 42", l:"#"},
  {t:"\"Ðiều mẹ cha bà con,<br>        Không có thể làm được<br>        Tâm hướng chánh làm được<br>        Làm được tốt đẹp hơn.\"", r:"Kinh Pháp Cú 43", l:"#"},
  {t:"\"Ai chinh phục đất này<br>        Dạ ma, Thiên giới này?<br>        Ai khéo giảng Pháp cú,<br>        Như người khéo hái hoa?\"", r:"Kinh Pháp Cú 44", l:"#"},
  {t:"\"Hữu học chinh phục đất,<br>        Dạ ma, Thiên giới này.<br>        Hữu học giảng Pháp cú,<br>        Như người khéo hái hoa.\"", r:"Kinh Pháp Cú 45", l:"#"},
  {t:"\"Biết thân như bọt nước,<br>        Ngộ thân là như huyễn,<br>        Bẻ tên hoa của ma,<br>        Vượt tầm mắt thần chết.\"", r:"Kinh Pháp Cú 46", l:"#"},
  {t:"\"Người nhặt các loại hoa,<br>        Ý đắm say, tham nhiễm,<br>        Bị thần chết mang đi,<br>        Như lụt trôi làng ngủ.\"", r:"Kinh Pháp Cú 47", l:"#"},
  {t:"\"Người nhặt các loại hoa,<br>        Ý đắm say tham nhiễm,<br>        Các dục chưa thỏa mãn,<br>        Ðã bị chết chinh phục.\"", r:"Kinh Pháp Cú 48", l:"#"},
  {t:"\"Như ong đến với hoa,<br>        Không hại sắc và hương,<br>        Che chở hoa, lấy nhụy.<br>        Bậc Thánh đi vào làng \".", r:"Kinh Pháp Cú 49", l:"#"},
  {t:"\"Không nên nhìn lỗi người,<br>        Người làm hay không làm.<br>        Nên nhìn tự chính mình.<br>        Có làm hay không làm.\"", r:"Kinh Pháp Cú 50", l:"#"},
  {t:"\"Như bông hoa tươi đẹp,<br>        Có sắc nhưng không hương.<br>        Cũng vậy, lời khéo nói,<br>        Không làm, không kết quả.\"", r:"Kinh Pháp Cú 51", l:"#"},
  {t:"\"Như bông hoa tươi đẹp,<br>        Có sắc lại thêm hương;<br>        Cũng vậy, lời khéo nói,<br>        Có làm, có kết quả.\"", r:"Kinh Pháp Cú 52", l:"#"},
  {t:"\"Như từ một đống hoa,<br>        Nhiều tràng hoa được làm.<br>        Cũng vậy, thân sanh tử,<br>        Phải làm nhiều việc lành.\"", r:"Kinh Pháp Cú 53", l:"#"},
  {t:"\"Hương các loại hoa thơm<br>        Không ngược bay chiều gió<br>        Nhưng hương người đức hạnh<br>        Ngược gió khắp tung bay<br>        Chỉ có bậc chân nhân<br>        Tỏa khắp mọi phương trời.\"", r:"Kinh Pháp Cú 54", l:"#"},
  {t:"\"Hoa chiên đàn, già la,<br>        Hoa sen, hoa vũ quý,<br>        Giữa những hương hoa ấy,<br>        Giới hương là vô thượng.\"", r:"Kinh Pháp Cú 55", l:"#"},
  {t:"\"Ít giá trị hương này,<br>        Hương già la, chiên đàn;<br>        Chỉ hương người đức hạnh,<br>        Tối thượng tỏa Thiên giới.\"", r:"Kinh Pháp Cú 56", l:"#"},
  {t:"\"Nhưng ai có giới hạnh,<br>        An trú không phóng dật,<br>        Chánh trí, chơn giải thoát,<br>        Ác ma không thấy đường.\"", r:"Kinh Pháp Cú 57", l:"#"},
  {t:"\"Như giữa đống rác nhớp,<br>        Quăng bỏ trên đường lớn,<br>        Chỗ ấy hoa sen nở,<br>        Thơm sạch, đẹp ý người.\"", r:"Kinh Pháp Cú 58", l:"#"},
  {t:"\"Cũng vậy giữa quần sanh,<br>        Uế nhiễm, mù, phàm tục,<br>        Ðệ tử bậc Chánh Giác,<br>        Sáng ngời với Tuệ Trí.\"", r:"Kinh Pháp Cú 59", l:"#"},
  {t:"\"Ðêm dài cho kẻ thức,<br>        Ðường dài cho kẻ mệt,<br>        Luân hồi dài, kẻ ngu,<br>        Không biết chơn diệu pháp.\"", r:"Kinh Pháp Cú 60", l:"#"},
  {t:"\"Tìm không được bạn đường,<br>        Hơn mình hay bằng mình,<br>        Thà quyết sống một mình,<br>        Không bè bạn kẻ ngu.\"", r:"Kinh Pháp Cú 61", l:"#"},
  {t:"\"Con tôi, tài sản tôi,<br>        Người ngu sanh ưu não,<br>        Tự ta, ta không có,<br>        Con đâu, tài sản đâu.\"", r:"Kinh Pháp Cú 62", l:"#"},
  {t:"\"Người ngu nghĩ mình ngu,<br>        Nhờ vậy thành có trí.<br>        Người ngu tưởng có trí,<br>        Thật xứng gọi chí ngu.\"", r:"Kinh Pháp Cú 63", l:"#"},
  {t:"\"Người ngu, dầu trọn đời,<br>        Thân cận người có trí,<br>        Không biết được Chánh pháp,<br>        Như muỗng với vị canh.\"", r:"Kinh Pháp Cú 64", l:"#"},
  {t:"\"Người trí, dầu một khắc,<br>        Thân cận người có trí,<br>        Biết ngay chân diệu pháp,<br>        Như lưỡi với vị canh.\"", r:"Kinh Pháp Cú 65", l:"#"},
  {t:"\"Người ngu si thiếu trí,<br>        Tự ngã thành kẻ thù.<br>        Làm các nghiệp không thiện,<br>        Phải chịu quả đắng cay.\"", r:"Kinh Pháp Cú 66", l:"#"},
  {t:"\"Nghiệp làm không chánh thiện,<br>        Làm rồi sanh ăn năn,<br>        Mặt nhuốm lệ, khóc than,<br>        Lãnh chịu quả dị thục.\"", r:"Kinh Pháp Cú 67", l:"#"},
  {t:"\"Và nghiệp làm chánh thiện,<br>        Làm rồi không ăn năn,<br>        Hoan hỷ, ý đẹp lòng,<br>        Hưởng thọ quả dị thục.\"", r:"Kinh Pháp Cú 68", l:"#"},
  {t:"\"Người ngu nghĩ là ngọt,<br>        Khi ác chưa chín muồi;<br>        Ác nghiệp chín muồi rồi,<br>        Người ngu chịu khổ đau.\"", r:"Kinh Pháp Cú 69", l:"#"},
  {t:"\"Tháng tháng với ngọn cỏ,<br>        Người ngu có ăn uống<br>        Không bằng phần mười sáu<br>        Người hiểu pháp hữu vi.\"", r:"Kinh Pháp Cú 70", l:"#"},
  {t:"\"Nghiệp ác đã được làm,<br>        Như sữa, không đông ngay,<br>        Cháy ngầm theo kẻ ngu,<br>        Như lửa tro che đậy.\"", r:"Kinh Pháp Cú 71", l:"#"},
  {t:"\"Tự nó chịu bất hạnh,<br>        Khi danh đến kẻ ngu.<br>        Vận may bị tổn hại,<br>        Ðầu nó bị nát tan.\"", r:"Kinh Pháp Cú 72", l:"#"},
  {t:"\"Ưa danh không tương xứng,<br>        Muốn ngồi trước tỷ kheo,<br>        Ưa quyền tại tịnh xá,<br>        Muốn mọi người lễ kính.\"", r:"Kinh Pháp Cú 73", l:"#"},
  {t:"\"Mong cả hai tăng, tục,<br>        Nghĩ rằng (chính ta làm).<br>        Trong mọi việc lớn nhỏ,<br>        Phải theo mệnh lệnh ta \"<br>        Người ngu nghĩ như vậy<br>        Dục và mạn tăng trưởng.", r:"Kinh Pháp Cú 74", l:"#"},
  {t:"\"Khác thay duyên thế lợi,<br>        Khác thay đường Niết Bàn.<br>        Tỷ kheo, đệ tử Phật,<br>        Hãy như vậy thắng tri.<br>        Chớ ưa thích cung kính,<br>        Hãy tu hạnh viễn ly.\"", r:"Kinh Pháp Cú 75", l:"#"},
  {t:"\"Nếu thấy bậc hiền trí,<br>        Chỉ lỗi và khiển trách,<br>        Như chỉ chỗ chôn vàng<br>        Hãy thân cận người trí!<br>        Thân cận người như vậy,<br>        Chỉ tốt hơn, không xấu.\"", r:"Kinh Pháp Cú 76", l:"#"},
  {t:"\"Những người hay khuyên dạy,<br>        Ngăn người khác làm ác,<br>        Ðược người hiền kính yêu,<br>        Bị người ác không thích.\"", r:"Kinh Pháp Cú 77", l:"#"},
  {t:"\"Chớ thân với bạn ác,<br>        Chớ thân kẻ tiểu nhân.<br>        Hãy thân người bạn lành,<br>        Hãy thân bậc thượng nhân.\"", r:"Kinh Pháp Cú 78", l:"#"},
  {t:"\"Pháp hỷ đem an lạc,<br>        Với tâm tư thuần tịnh;<br>        Người trí thường hoan hỷ,<br>        Với pháp bậc Thánh thuyết.\"", r:"Kinh Pháp Cú 79", l:"#"},
  {t:"\"Người trị thủy dẫn nước,<br>        Kẻ làm tên nắn tên,<br>        Người thợ mộc uốn gỗ,<br>        Bậc trí nhiếp tự thân.\"", r:"Kinh Pháp Cú 80", l:"#"},
  {t:"\"Như đá tảng kiên cố,<br>        Không gió nào giao động,<br>        Cũng vậy, giữa khen chê,<br>        Người trí không giao động.\"", r:"Kinh Pháp Cú 81", l:"#"},
  {t:"\"Như hồ nước sâu thẳm,<br>        Trong sáng, không khuấy đục,<br>        Cũng vậy, nghe chánh pháp,<br>        Người trí hưởng tịnh lạc.\"", r:"Kinh Pháp Cú 82", l:"#"},
  {t:"\"Người hiền bỏ tất cả,<br>        Người lành không bàn dục,<br>        Dầu cảm thọ lạc khổ,<br>        Bậc trí không vui buồn.\"", r:"Kinh Pháp Cú 83", l:"#"},
  {t:"\"Không vì mình, vì người.<br>        Không cầu được con cái,<br>        Không tài sản quốc độ,<br>        Không cầu mình thành tựu,<br>        Với việc làm phi pháp.<br>        Vị ấy thật trì giới,<br>        Có trí tuệ, đúng pháp.\"", r:"Kinh Pháp Cú 84", l:"#"},
  {t:"\"Ít người giữa nhân loại,<br>        Ðến được bờ bên kia<br>        Còn số người còn lại,<br>        Xuôi ngược chạy bờ này.\"", r:"Kinh Pháp Cú 85", l:"#"},
  {t:"\"Những ai hành trì pháp,<br>        Theo chánh pháp khéo dạy,<br>        Sẽ đến bờ bên kia,<br>        Vượt ma lực khó thoát.\"", r:"Kinh Pháp Cú 86", l:"#"},
  {t:"\"Kẻ trí bỏ pháp đen,<br>        Tu tập theo pháp trắng.<br>        Bỏ nhà, sống không nhà,<br>        Sống viễn ly khổ lạc.\"", r:"Kinh Pháp Cú 87", l:"#"},
  {t:"\"Hãy cầu vui Niết Bàn,<br>        Bỏ dục, không sở hữu,<br>        Kẻ trí tự rửa sạch,<br>        Cấu uế từ nội tâm.\"", r:"Kinh Pháp Cú 88", l:"#"},
  {t:"\"Những ai với chánh tâm,<br>        Khéo tu tập giác chi,<br>        Từ bỏ mọi ái nhiễm,<br>        Hoan hỷ không chấp thủ.<br>        Không lậu hoặc, sáng chói,<br>        Sống tịch tịnh ở đời.\"", r:"Kinh Pháp Cú 89", l:"#"},
  {t:"\"Ðích đã đến, không sầu,<br>        Giải thoát ngoài tất cả,<br>        Ðoạn trừ mọi buộc ràng,<br>        Vị ấy không nhiệt não.\"", r:"Kinh Pháp Cú 90", l:"#"},
  {t:"\"Tự sách tấn, chánh niệm,<br>        Không thích cư xá nào,<br>        Như ngỗng trời rời ao,<br>        Bỏ sau mọi trú ẩn.\"", r:"Kinh Pháp Cú 91", l:"#"},
  {t:"\"Tài sản không chất chứa,<br>        Ăn uống biết liễu tri,<br>        Tự tại trong hành xứ,<br>        \"Không vô tướng, giải thoát, \"<br>        Như chim giữa hư không,<br>        Hướng chúng đi khó tìm.\"", r:"Kinh Pháp Cú 92", l:"#"},
  {t:"\"Ai lậu hoặc đoạn sạch,<br>        Ăn uống không tham đắm,<br>        Tự tại trong hành xứ,<br>        \"Không, vô tướng giải thoát. \"<br>        Như chim giữa hư không,<br>        Dấu chân thật khó tìm. \"", r:"Kinh Pháp Cú 93", l:"#"},
  {t:"\"Ai nhiếp phục các căn,<br>        Như đánh xe điều ngự,<br>        Mạn trừ, lậu hoặc dứt,<br>        Người vậy, Chư Thiên mến.\"", r:"Kinh Pháp Cú 94", l:"#"},
  {t:"\"Như đất, không hiềm hận,<br>        Như cột trụ, kiên trì,<br>        Như hồ, không bùn nhơ,<br>        Không luân hồi, vị ấy.\"", r:"Kinh Pháp Cú 95", l:"#"},
  {t:"\"Người tâm ý an tịnh,<br>        Lời an, nghiệp cũng an,<br>        Chánh trí, chơn giải thoát,<br>        Tịnh lạc là vị ấy.\"", r:"Kinh Pháp Cú 96", l:"#"},
  {t:"\"Không tin, hiểu vô vi.<br>        Người cắt mọi hệ lụy<br>        Cơ hội tận, xả ly<br>        Vị ấy thật tối thượng.\"", r:"Kinh Pháp Cú 97", l:"#"},
  {t:"\"Làng mạc hay rừng núi<br>        Thung lũng hay đồi cao,<br>        La Hán trú chỗ nào,<br>        Ðất ấy thật khả ái \".", r:"Kinh Pháp Cú 98", l:"#"},
  {t:"\"Khả ái thay núi rừng,<br>        Chỗ người phàm không ưa,<br>        Vị ly tham ưa thích,<br>        Vì không tìm dục lạc.\"", r:"Kinh Pháp Cú 99", l:"#"},
  {t:"\"Dầu nói ngàn ngàn lời,<br>        Nhưng không gì lợi ích,<br>        Tốt hơn một câu nghĩa,<br>        Nghe xong, được tịnh lạc.\"", r:"Kinh Pháp Cú 100", l:"#"},
  {t:"\"Dầu nói ngàn câu kệ<br>        Nhưng không gì lợi ích,<br>        Tốt hơn nói một câu,<br>        Nghe xong, được tịnh lạc.\"", r:"Kinh Pháp Cú 101", l:"#"},
  {t:"\"Dầu nói trăm câu kệ<br>        Nhưng không gì lợi ích,<br>        Tốt hơn một câu pháp,<br>        Nghe xong, được tịnh lạc.\"", r:"Kinh Pháp Cú 102", l:"#"},
  {t:"\"Dầu tại bãi chiến trường<br>        Thắng ngàn ngàn quân địch,<br>        Tự thắng mình tốt hơn,<br>        Thật chiến thắng tối thượng.\"", r:"Kinh Pháp Cú 103", l:"#"},
  {t:"\"Tự thắng, tốt đẹp hơn,<br>        Hơn chiến thắng người khác.<br>        Người khéo điều phục mình,<br>        Thường sống tự chế ngự.\"", r:"Kinh Pháp Cú 104", l:"#"},
  {t:"\"Dầu Thiên Thần, Thát Bà,<br>        Dầu Ma vương, Phạm Thiên<br>        Không ai chiến thắng nổi,<br>        Người tự thắng như vậy.\"", r:"Kinh Pháp Cú 105", l:"#"},
  {t:"\"Tháng tháng bỏ ngàn vàng,<br>        Tế tự cả trăm năm,<br>        Chẳng bằng trong giây lát,<br>        Cúng dường bậc tự tu.<br>        Cùng dường vậy tốt hơn,<br>        Hơn trăm năm tế tự.\"", r:"Kinh Pháp Cú 106", l:"#"},
  {t:"\"Dầu trải một trăm năm,<br>        Thờ lửa tại rừng sâu,<br>        Chẳng bằng trong giây lát,<br>        Cúng dường bậc tự tu.<br>        Cúng dường vậy tốt hơn,<br>        Hơn trăm năm tế tự.\"", r:"Kinh Pháp Cú 107", l:"#"},
  {t:"\"Suốt năm cúng tế vật,<br>        Ðể cầu phước ở đời.<br>        Không bằng một phần tư<br>        Kính lễ bậc chánh trực.\"", r:"Kinh Pháp Cú 108", l:"#"},
  {t:"\"Thường tôn trọng, kính lễ<br>        Bậc kỳ lão trưởng thượng,<br>        Bốn pháp được tăng trưởng:<br>        Thọ, sắc, lạc, sức mạnh.\"", r:"Kinh Pháp Cú 109", l:"#"},
  {t:"\"Dầu sống một trăm năm<br>        Ác giới, không thiền định,<br>        Tốt hơn sống một ngày,<br>        Trì giới, tu thiền định.\"", r:"Kinh Pháp Cú 110", l:"#"},
  {t:"\"Ai sống một trăm năm,<br>        Ác tuệ, không thiền định.<br>        Tốt hơn sống một ngày,<br>        Có tuệ, tu thiền định.\"", r:"Kinh Pháp Cú 111", l:"#"},
  {t:"\"Ai sống một trăm năm,<br>        Lười nhác không tinh tấn,<br>        Tốt hơn sống một ngày<br>        Tinh tấn tận sức mình.\"", r:"Kinh Pháp Cú 112", l:"#"},
  {t:"\"Ai sống một trăm năm,<br>        Không thấy pháp sinh diệt,<br>        Tốt hơn sống một ngày,<br>        Thấy được pháp sinh diệt.\"", r:"Kinh Pháp Cú 113", l:"#"},
  {t:"\"Ai sống một trăm năm,<br>        Không thấy câu bất tử,<br>        Tốt hơn sống một ngày,<br>        Thấy được câu bất tử.\"", r:"Kinh Pháp Cú 114", l:"#"},
  {t:"\"Ai sống một trăm năm,<br>        Không thấy pháp tối thượng,<br>        Tốt hơn sống một ngày,<br>        Thấy được pháp tối thượng.\"", r:"Kinh Pháp Cú 115", l:"#"},
  {t:"\"Hãy gấp làm điều lành,<br>        Ngăn tâm làm điều ác.<br>        Ai chậm làm việc lành,<br>        Ý ưa thích việc ác.\"", r:"Kinh Pháp Cú 116", l:"#"},
  {t:"\"Nếu người làm điều ác,<br>        Chớ tiếp tục làm thêm.<br>        Chớ ước muốn điều ác,<br>        Chứa ác, tất chịu khổ.\"", r:"Kinh Pháp Cú 117", l:"#"},
  {t:"\"Nếu người làm điều thiện,<br>        Nên tiếp tục làm thêm.<br>        Hãy ước muốn điều thiện,<br>        Chứa thiện, được an lạc.\"", r:"Kinh Pháp Cú 118", l:"#"},
  {t:"\"Người ác thấy là hiền.<br>        Khi ác chưa chín muồi,<br>        Khi ác nghiệp chín muồi,<br>        Người ác mới thấy ác.\"", r:"Kinh Pháp Cú 119", l:"#"},
  {t:"\"Người hiền thấy là ác,<br>        Khi thiện chưa chín muồi.<br>        Khi thiện được chín muồi,<br>        Người hiền thấy là thiện.\"", r:"Kinh Pháp Cú 120", l:"#"},
  {t:"\"Chớ chê khinh điều ác,<br>        Cho rằng \"chưa đến mình \",<br>        Như nước nhỏ từng giọt,<br>        Rồi bình cũng đầy tràn.<br>        Người ngu chứa đầy ác<br>        Do chất chứa dần dần.\"", r:"Kinh Pháp Cú 121", l:"#"},
  {t:"\"Chớ chê khinh điều thiện<br>        Cho rằng \"Chưa đến mình, \"<br>        Như nước nhỏ từng giọt,<br>        Rồi bình cũng đầy tràn.<br>        Người trí chứa đầy thiện,<br>        Do chất chứa dần dần.\"", r:"Kinh Pháp Cú 122", l:"#"},
  {t:"\"Ít bạn đường, nhiều tiền,<br>        Người buôn tránh đường hiểm.<br>        Muốn sống, tránh thuốc độc,<br>        Hãy tránh ác như vậy.\"", r:"Kinh Pháp Cú 123", l:"#"},
  {t:"\"Bàn tay không thương tích,<br>        Có thể cầm thuốc độc.<br>        Không thương tích, tránh độc,<br>        Không làm, không có ác.\"", r:"Kinh Pháp Cú 124", l:"#"},
  {t:"\"Hại người không ác tâm,<br>        Người thanh tịnh, không uế,<br>        Tội ác đến kẻ ngu,<br>        Như ngược gió tung bụi.\"", r:"Kinh Pháp Cú 125", l:"#"},
  {t:"\"Một số sinh bào thai,<br>        Kẻ ác sinh địa ngục,<br>        Người thiện lên cõi trời,<br>        Vô lậu chứng Niết Bàn.\"", r:"Kinh Pháp Cú 126", l:"#"},
  {t:"\"Không trên trời, giữa biển,<br>        Không lánh vào động núi,<br>        Không chỗ nào trên đời,<br>        Trốn được quả ác nghiệp.\"", r:"Kinh Pháp Cú 127", l:"#"},
  {t:"\"Không trên trời, giữa biển,<br>        Không lánh vào động núi,<br>        Không chỗ nào trên đời,<br>        Trốn khỏi tay thần chết.\"", r:"Kinh Pháp Cú 128", l:"#"},
  {t:"\"Mọi người sợ hình phạt,<br>        Mọi người sợ tử vong.<br>        Lấy mình làm ví dụ<br>        Không giết, không bảo giết.\"", r:"Kinh Pháp Cú 129", l:"#"},
  {t:"\"Mọi người sợ hình phạt,<br>        Mọi người thích sống còn;<br>        Lấy mình làm ví dụ,<br>        Không giết, không bảo giết.\"", r:"Kinh Pháp Cú 130", l:"#"},
  {t:"\"Chúng sanh cầu an lạc,<br>        Ai dùng trượng hại người,<br>        Ðể tìm lạc cho mình,<br>        Ðời sau không được lạc.\"", r:"Kinh Pháp Cú 131", l:"#"},
  {t:"\"Chúng sanh cầu an lạc,<br>        Không dùng trượng hại người,<br>        Ðể tìm lạc cho mình,<br>        Ðời sau được hưởng lạc.\"", r:"Kinh Pháp Cú 132", l:"#"},
  {t:"\"Chớ nói lời ác độc,<br>        Nói ác, bị nói lại,<br>        Khổ thay lời phẩn nộ,<br>        Ðao trượng phản chạm mình.\"", r:"Kinh Pháp Cú 133", l:"#"},
  {t:"\"Nếu tự mình yên lặng,<br>        Như chiếc chuông bị bể.<br>        Ngươi đã chứng Niết Bàn<br>        Ngươi không còn phẩn nộ.\"", r:"Kinh Pháp Cú 134", l:"#"},
  {t:"\"Với gậy người chăn bò,<br>        Lùa bò ra bãi cỏ;<br>        Cũng vậy, già và chết,<br>        Lùa người đến mạng chung.\"", r:"Kinh Pháp Cú 135", l:"#"},
  {t:"\"Người ngu làm điều ác,<br>        Không ý thức việc làm.<br>        Do tự nghiệp, người ngu<br>        Bị nung nấu, như lửa.\"", r:"Kinh Pháp Cú 136", l:"#"},
  {t:"\"Dùng trượng phạt không trượng,<br>        Làm ác người không ác.<br>        Trong mười loại khổ đau,<br>        Chịu gấp một loại khổ.\"", r:"Kinh Pháp Cú 137", l:"#"},
  {t:"\"Hoặc khổ thọ khốc liệt,<br>        Thân thể bị thương vong,<br>        Hoặc thọ bệnh kịch liệt,<br>        Hay loạn ý tán tâm.\"", r:"Kinh Pháp Cú 138", l:"#"},
  {t:"\"Hoặc tai họa từ vua,<br>        Hay bị vu trọng tội;<br>        Bà con phải ly tán,<br>        Tài sản bị nát tan.\"", r:"Kinh Pháp Cú 139", l:"#"},
  {t:"\"Hoặc phòng ốc nhà cửa<br>        Bị hỏa tai thiêu đốt.<br>        Khi thân hoại mạng chung,<br>        Ác tuệ sanh địa ngục.\"", r:"Kinh Pháp Cú 140", l:"#"},
  {t:"\"Không phải sống lõa thể<br>        Bện tóc, tro trét mình,<br>        Tuyệt thực, lăn trên đất,<br>        Sống nhớp, siêng ngồi xổm,<br>        Làm con người được sạch,<br>        Nếu không trừ nghi hoặc.\"", r:"Kinh Pháp Cú 141", l:"#"},
  {t:"\"Ai sống tự trang sức,<br>        Nhưng an tịnh, nhiếp phục,<br>        Sống kiên trì, phạm hạnh,<br>        Không hại mọi sinh linh,<br>        Vị ấy là phạm chí,<br>        Hay sa môn, khất sĩ.\"", r:"Kinh Pháp Cú 142", l:"#"},
  {t:"\"Thật khó tìm ở đời,<br>        Người biết thẹn, tự chế,<br>        Biết tránh né chỉ trích<br>        Như ngựa hiền tránh roi.\"", r:"Kinh Pháp Cú 143", l:"#"},
  {t:"\"Như ngựa hiền chạm roi,<br>        Hãy nhiệt tâm, hăng hái,<br>        Với tín, giới, tinh tấn,<br>        Thiền định cùng trạch pháp.<br>        Minh hạnh đủ, chánh niệm,<br>        Ðoạn khổ này vô lượng.\"", r:"Kinh Pháp Cú 144", l:"#"},
  {t:"\"Người trị thủy dẫn nước,<br>        Kẻ làm tên nắn tên,<br>        Người thợ mộc uốn ván,<br>        Bậc tự điều, điều thân.\"", r:"Kinh Pháp Cú 145", l:"#"},
  {t:"\"Cười gì, hân hoan gì,<br>        Khi đời mãi bị thiêu?<br>        Bị tối tăm bao trùm,<br>        Sao không tìm ngọn đèn?\"", r:"Kinh Pháp Cú 146", l:"#"},
  {t:"\"Hãy xem bong bóng đẹp,<br>        Chỗ chất chứa vết thương,<br>        Bệnh hoạn nhiều suy tư,<br>        Thật không gì trường cửu.\"", r:"Kinh Pháp Cú 147", l:"#"},
  {t:"\"Sắc này bị suy già,<br>        Ổ tật bệnh, mỏng manh,<br>        Nhóm bất tịnh, đỗ vỡ,<br>        Chết chấm dứt mạng sống.\"", r:"Kinh Pháp Cú 148", l:"#"},
  {t:"\"Như trái bầu mùa thu,<br>        Bị vất bỏ quăng đi,<br>        Nhóm xương trắng bồ câu,<br>        Thấy chúng còn vui gì?\"", r:"Kinh Pháp Cú 149", l:"#"},
  {t:"\"Thành này làm bằng xương,<br>        Quét tô bằng thịt máu,<br>        Ở đây già và chết,<br>        Mạn, lừa đảo chất chứa.\"", r:"Kinh Pháp Cú 150", l:"#"},
  {t:"\"Xe vua đẹp cũng già.<br>        Thân này rồi sẽ già,<br>        Pháp bậc thiện, không già.<br>        Như vậy bậc chí thiện<br>        Nói lên cho bậc thiện.\"", r:"Kinh Pháp Cú 151", l:"#"},
  {t:"\"Người ít nghe kém học,<br>        Lớn già như trâu đực.<br>        Thịt nó tuy lớn lên,<br>        Nhưng tuệ không tăng trưởng.\"", r:"Kinh Pháp Cú 152", l:"#"},
  {t:"\"Lang thang bao kiếp sống<br>        Ta tìm nhưng chẳng gặp,<br>        Người xây dựng nhà này,<br>        Khổ thay, phải tái sanh.\"", r:"Kinh Pháp Cú 153", l:"#"},
  {t:"\"Ôi! Người làm nhà kia<br>        Nay ta đã thấy ngươi!<br>        Ngươi không làm nhà nữa.<br>        Ðòn tay ngươi bị gẫy,<br>        Kèo cột ngươi bị tan<br>        Tâm ta đạt tịch diệt,<br>        Tham ái thảy tiêu vong.\"", r:"Kinh Pháp Cú 154", l:"#"},
  {t:"\"Lúc trẻ, không phạm hạnh,<br>        Không tìm kiếm bạc tiền.<br>        Như cò già bên ao,<br>        Ủ rũ, không tôm cá.\"", r:"Kinh Pháp Cú 155", l:"#"},
  {t:"\"Lúc trẻ không phạm hạnh,<br>        Không tìm kiếm bạc tiền;<br>        Như cây cung bị gẫy,<br>        Thở than những ngày qua.\"", r:"Kinh Pháp Cú 156", l:"#"},
  {t:"\"Nếu biết yêu tự ngã,<br>        Phải khéo bảo vệ mình,<br>        Người trí trong ba canh,<br>        Phải luôn luôn tỉnh thức.\"", r:"Kinh Pháp Cú 157", l:"#"},
  {t:"\"Trước hết tự đặt mình,<br>        Vào những gì thích đáng.<br>        Sau mới giáo hóa người,<br>        Người trí khỏi bị nhiễm.\"", r:"Kinh Pháp Cú 158", l:"#"},
  {t:"\"Hãy tự làm cho mình,<br>        Như điều mình dạy người.<br>        Khéo tự điều, điều người,<br>        Khó thay, tự điều phục!\"", r:"Kinh Pháp Cú 159", l:"#"},
  {t:"\"Tự mình y chỉ mình,<br>        Nào có y chỉ khác.<br>        Nhờ khéo điều phục mình,<br>        Ðược y chỉ khó được.\"", r:"Kinh Pháp Cú 160", l:"#"},
  {t:"\"Ðiều ác tự mình làm,<br>        Tự mình sanh, mình tạo.<br>        Nghiền nát kẻ ngu si,<br>        Như kim cương, ngọc báu.\"", r:"Kinh Pháp Cú 161", l:"#"},
  {t:"\"Phá giới quá trầm trọng,<br>        Như dây leo bám cây<br>        Gieo hại cho tự thân,<br>        Như kẻ thù mong ước.\"", r:"Kinh Pháp Cú 162", l:"#"},
  {t:"\"Dễ làm các điều ác,<br>        Dễ làm tự hại mình.<br>        Còn việc lành, việc tốt,<br>        Thật tối thượng khó làm.\"", r:"Kinh Pháp Cú 163", l:"#"},
  {t:"\"Kẻ ngu si miệt thị,<br>        Giáo pháp bậc La Hán,<br>        Bậc Thánh, bậc chánh mạng.<br>        Chính do ác kiến này,<br>        Như quả loại cây lau<br>        Mang quả tự hoại diệt.\"", r:"Kinh Pháp Cú 164", l:"#"},
  {t:"\"Tự mình, làm điều ác,<br>        Tự mình làm nhiễm ô,<br>        Tự mình không làm ác,<br>        Tự mình làm thanh tịnh.<br>        Tịnh, không tịnh tự mình,<br>        Không ai thanh tịnh ai!\"", r:"Kinh Pháp Cú 165", l:"#"},
  {t:"\"Chớ theo pháp hạ liệt.<br>        Chớ sống mặc, buông lung;<br>        Chớ tin theo tà kiến,<br>        Chớ tăng trưởng tục trần.\"", r:"Kinh Pháp Cú 166", l:"#"},
  {t:"\"Dầu lợi người bao nhiêu,<br>        Chớ quên phần tư lợi,<br>        Nhờ thắng trí tư lợi.<br>        Hãy chuyên tâm lợi mình.\"", r:"Kinh Pháp Cú 167", l:"#"},
  {t:"\"Nỗ lực, chớ phóng dật!<br>        Hãy sống theo chánh hạnh;<br>        Người chánh hạnh hưởng lạc,<br>        Cả đời này, đời sau.\"", r:"Kinh Pháp Cú 168", l:"#"},
  {t:"\"Hãy khéo sống chánh hạnh,<br>        Chớ sống theo tà hạnh!<br>        Người chánh hạnh hưởng lạc,<br>        Cả đời này, đời sau.\"", r:"Kinh Pháp Cú 169", l:"#"},
  {t:"\"Hãy nhìn như bọt nước,<br>        Hãy nhìn như cảnh huyễn!<br>        Quán nhìn đời như vậy,<br>        Thần chết không bắt gặp.\"", r:"Kinh Pháp Cú 170", l:"#"},
  {t:"\"Hãy đến nhìn đời này,<br>        Như xe vua lộng lẫy,<br>        Người ngu mới tham đắm,<br>        Kẻ trí nào đắm say.\"", r:"Kinh Pháp Cú 171", l:"#"},
  {t:"\"Ai sống trước buông lung,<br>        Sau sống không phóng dật,<br>        Chói sáng rực đời này.<br>        Như trăng thoát mây che.\"", r:"Kinh Pháp Cú 172", l:"#"},
  {t:"\"Ai dùng các hạnh lành,<br>        Làm xóa mờ nghiệp ác,<br>        Chói sáng rực đời này,<br>        Như trăng thoát mây che.\"", r:"Kinh Pháp Cú 173", l:"#"},
  {t:"\"Ðời này thật mù quáng,<br>        Ít kẻ thấy rõ ràng.<br>        Như chim thoát khỏi lưới,<br>        Rất ít đi thiên giới.\"", r:"Kinh Pháp Cú 174", l:"#"},
  {t:"\"Như chim thiên nga bay,<br>        Thần thông liệng giữa trời;<br>        Chiến thắng ma, ma quân,<br>        Kẻ trí thoát đời này.\"", r:"Kinh Pháp Cú 175", l:"#"},
  {t:"\"Ai vi phạm một pháp,<br>        Ai nói lời vọng ngữ,<br>        Ai bác bỏ đời sau,<br>        Không ác nào không làm.\"", r:"Kinh Pháp Cú 176", l:"#"},
  {t:"\"Keo kiết không sanh thiên,<br>        Kẻ ngu ghét bố thí,<br>        Người trí thích bố thí,<br>        Ðời sau, được hưởng lạc.\"", r:"Kinh Pháp Cú 177", l:"#"},
  {t:"\"Hơn thống lãnh cõi đất,<br>        Hơn được sanh cõi trời,<br>        Hơn chủ trì vũ trụ,<br>        Quả Dự Lưu tối thắng.\"", r:"Kinh Pháp Cú 178", l:"#"},
  {t:"\"Vị chiến thắng không bại,<br>        Vị bước đi trên đời,<br>        Không dấu tích chiến thắng,<br>        Phật giới rộng mênh mông,<br>        Ai dùng chân theo dõi<br>        Bậc không để dấu tích?\"", r:"Kinh Pháp Cú 179", l:"#"},
  {t:"\"Ai giải tỏa lưới tham,<br>        Ái phược hết dắt dẫn,<br>        Phật giới rộng mênh mông,<br>        Ai dùng chân theo dõi,<br>        Bậc không để dấu tích?\"", r:"Kinh Pháp Cú 180", l:"#"},
  {t:"\"Người trí chuyên thiền định,<br>        Thích an tịnh viễn ly,<br>        Chư thiên đều ái kính,<br>        Bậc chánh giác, chánh niệm.\"", r:"Kinh Pháp Cú 181", l:"#"},
  {t:"\"Khó thay, được làm người,<br>        Khó thay, được sống còn,<br>        Khó thay, nghe diệu pháp,<br>        Khó thay, Phật ra đời!\"", r:"Kinh Pháp Cú 182", l:"#"},
  {t:"\"Không làm mọi điều ác.<br>        Thành tựu các hạnh lành,<br>        Tâm ý giữ trong sạch,<br>        Chính lời chư Phật dạy.\"", r:"Kinh Pháp Cú 183", l:"#"},
  {t:"\"Chư Phật thường giảng dạy;<br>        Nhẫn, khổ hạnh tối thượng,<br>        Niết bàn, quả tối thượng;<br>        Xuất gia không phá người;<br>        Sa môn không hại người.\"", r:"Kinh Pháp Cú 184", l:"#"},
  {t:"\"Không phỉ báng, phá hoại,<br>        Hộ trì giới căn bản,<br>        Ăn uống có tiết độ,<br>        Sàng tọa chỗ nhàn tịnh<br>        Chuyên chú tăng thượng tâm,<br>        Chính lời chư Phật dạy.\"", r:"Kinh Pháp Cú 185", l:"#"},
  {t:"\"Dầu mưa bằng tiền vàng,<br>        Các dục khó thỏa mãn.<br>        Dục đắng nhiều ngọt ít,<br>        Biết vậy là bậc trí.\"", r:"Kinh Pháp Cú 186", l:"#"},
  {t:"\"Ðệ tử bậc chánh giác,<br>        Không tìm cầu dục lạc,<br>        Dầu là dục chư thiên,<br>        Chỉ ưa thích ái diệt.\"", r:"Kinh Pháp Cú 187", l:"#"},
  {t:"\"Loài người sợ hoảng hốt,<br>        Tìm nhiều chỗ quy y,<br>        Hoặc rừng rậm, núi non,<br>        Hoặc vườn cây, đền tháp.\"", r:"Kinh Pháp Cú 188", l:"#"},
  {t:"\"Quy y ấy không ổn,<br>        Không quy y tối thượng.<br>        Quy y các chỗ ấy,<br>        Không thoát mọi khổ đau?\"", r:"Kinh Pháp Cú 189", l:"#"},
  {t:"\"Ai quy y Ðức Phật,<br>        Chánh pháp và chư tăng,<br>        Ai dùng chánh tri kiến,<br>        Thấy được bốn Thánh đế.\"", r:"Kinh Pháp Cú 190", l:"#"},
  {t:"\"Thấy khổ và khổ tập,<br>        Thấy sự khổ vượt qua,<br>        Thấy đường Thánh tám ngành,<br>        Ðưa đến khổ não tận.\"", r:"Kinh Pháp Cú 191", l:"#"},
  {t:"\"Thật quy y an ổn,<br>        Thật quy y tối thượng,<br>        Có quy y như vậy,<br>        Mới thoát mọi khổ đau.\"", r:"Kinh Pháp Cú 192", l:"#"},
  {t:"\"Khó gặp bậc thánh nhơn,<br>        Không phải đâu cũng có.<br>        Chỗ nào bậc trí sanh,<br>        Gia đình tất an lạc.\"", r:"Kinh Pháp Cú 193", l:"#"},
  {t:"\"Vui thay, Phật ra đời!<br>        Vui thay, Pháp được giảng!<br>        Vui thay, Tăng hòa hợp!<br>        Hòa hợp tu, vui thay!\"", r:"Kinh Pháp Cú 194", l:"#"},
  {t:"\"Cúng dường bậc đáng cúng,<br>        Chư Phật hoặc đệ tử,<br>        Các bậc vượt hý luận,<br>        Ðoạn diệt mọi sầu bi.\"", r:"Kinh Pháp Cú 195", l:"#"},
  {t:"\"Cúng dường bậc như vậy,<br>        Tịch tịnh, không sợ hãi,<br>        Các công đức như vậy,<br>        Không ai ước lường được.\"", r:"Kinh Pháp Cú 196", l:"#"},
  {t:"\"Vui thay, chúng ta sống,<br>        Không hận, giữa hận thù!<br>        Giữa những người thù hận,<br>        Ta sống, không hận thù!\"", r:"Kinh Pháp Cú 197", l:"#"},
  {t:"\"Vui thay, chúng ta sống,<br>        Không bệnh, giữa ốm đau!<br>        Giữa những người bệnh hoạn,<br>        Ta sống, không ốm đau.\"", r:"Kinh Pháp Cú 198", l:"#"},
  {t:"\"Vui thay, chúng ta sống,<br>        Không rộn giữa rộn ràng;<br>        Giữa những người rộn ràng,<br>        Ta sống, không rộn ràng.\"", r:"Kinh Pháp Cú 199", l:"#"},
  {t:"\"Vui thay chúng ta sống,<br>        Không gì, gọi của ta.<br>        Ta sẽ hưởng hỷ lạc,<br>        Như chư thiên Quang Âm.\"", r:"Kinh Pháp Cú 200", l:"#"},
  {t:"\"Chiến thắng sinh thù oán,<br>        Thất bại chịu khổ đau,<br>        Sống tịch tịnh an lạc.<br>        Bỏ sau mọi thắng bại.\"", r:"Kinh Pháp Cú 201", l:"#"},
  {t:"\"Lửa nào sánh lửa tham?<br>        Ác nào bằng sân hận?<br>        Khổ nào sánh khổ uẩn,<br>        Lạc nào bằng tịnh lạc.\"", r:"Kinh Pháp Cú 202", l:"#"},
  {t:"\"Ðói ăn, bệnh tối thượng,<br>        Các hành, khổ tối thượng,<br>        Hiểu như thực là vậy,<br>        Niết Bàn, lạc tối thượng.\"", r:"Kinh Pháp Cú 203", l:"#"},
  {t:"\"Không bệnh, lợi tối thượng,<br>        Biết đủ, tiền tối thượng,<br>        Thành tín đối với nhau,<br>        Là bà con tối thượng.<br>        Niết Bàn, lạc tối thượng.\"", r:"Kinh Pháp Cú 204", l:"#"},
  {t:"\"Ðã nếm vị độc cư,<br>        Ðược hưởng vị nhàn tịnh,<br>        Không sợ hải, không ác,<br>        Nếm được vị pháp hỷ.\"", r:"Kinh Pháp Cú 205", l:"#"},
  {t:"\"Lành thay, thấy thánh nhân,<br>        Sống chung thường hưởng lạc.<br>        Không thấy những người ngu,<br>        Thường thường được an lạc.\"", r:"Kinh Pháp Cú 206", l:"#"},
  {t:"\"Sống chung với người ngu,<br>        Lâu dài bị lo buồn.<br>        Khổ thay gần người ngu,<br>        Như thường sống kẻ thù.<br>        Vui thay, gần người trí,<br>        Như chung sống bà con.\"", r:"Kinh Pháp Cú 207", l:"#"},
  {t:"\"Bậc hiền sĩ, trí tuệ<br>        Bậc nghe nhiều, trì giới,<br>        Bậc tự chế, Thánh nhân;<br>        Hãy gần gũi, thân cận<br>        Thiện nhân, trí giả ấy,<br>        Như trăng theo đường sao.\"", r:"Kinh Pháp Cú 208", l:"#"},
  {t:"\"Tự chuyên, không đáng chuyên<br>        Không chuyên, việc đáng chuyên.<br>        Bỏ đích, theo hỷ ái,<br>        Ganh tị bậc tự chuyên.\"", r:"Kinh Pháp Cú 209", l:"#"},
  {t:"\"Chớ gần gũi người yêu,<br>        Trọn đời xa kẻ ghét.<br>        Yêu không gặp là khổ,<br>        Oán phải gặp cũng đau.\"", r:"Kinh Pháp Cú 210", l:"#"},
  {t:"\"Do vậy chớ yêu ai,<br>        Ái biệt ly là ác;<br>        Những ai không yêu ghét,<br>        Không thể có buộc ràng.\"", r:"Kinh Pháp Cú 211", l:"#"},
  {t:"\"Do ái sinh sầu ưu,<br>        Do ái sinh sợ hãi,<br>        Ai thoát khỏi tham ái,<br>        Không sầu, đâu sợ hãi?\"", r:"Kinh Pháp Cú 212", l:"#"},
  {t:"\"Ái luyến sinh sầu ưu,<br>        Ái luyến sinh sợ hải.<br>        Ai giải thoát ái luyến<br>        Không sầu, đâu sợ hải?\"", r:"Kinh Pháp Cú 213", l:"#"},
  {t:"\"Hỷ ái sinh sầu ưu,<br>        Hỷ ái sinh sợ hãi.<br>        Ai giải thoát hỷ ái,<br>        Không sầu, đâu sợ hãi?", r:"Kinh Pháp Cú 214", l:"#"},
  {t:"\"Dục ái sinh sầu ưu,<br>        Dục ái sinh sợ hãi,<br>        Ai thoát khỏi dục ái,<br>        Không sầu, đâu sợ hãi?\"", r:"Kinh Pháp Cú 215", l:"#"},
  {t:"\"Tham ái sinh sầu ưu,<br>        Tham ái sinh sợ hãi.<br>        Ai thoát khỏi tham ái,<br>        Không sầu, đâu sợ hãi.\"", r:"Kinh Pháp Cú 216", l:"#"},
  {t:"\"Ðủ giới đức, chánh kiến;<br>        Trú pháp, chứng chân lý,<br>        Tự làm công việc mình,<br>        Ðược quần chúng ái kính.\"", r:"Kinh Pháp Cú 217", l:"#"},
  {t:"\"Ước vọng pháp ly ngôn<br>        Ý cảm xúc thượng quả<br>        Tâm thoát ly ác dục,<br>        Xứng gọi bậc Thượng Lưu.\"", r:"Kinh Pháp Cú 218", l:"#"},
  {t:"\"Khách lâu ngày ly hương,<br>        An toàn từ xa về,<br>        Bà con cùng thân hữu,<br>        Hân hoan đón chào mừng.\"", r:"Kinh Pháp Cú 219", l:"#"},
  {t:"\"Cũng vậy các phước nghiệp,<br>        Ðón chào người làm lành,<br>        Ðời này đến đời kia.<br>        Như thân nhân, đón chào.\"", r:"Kinh Pháp Cú 220", l:"#"},
  {t:"\"Bỏ phẫn nộ, ly mạn,<br>        Vượt qua mọi kiết sử,<br>        Không chấp trước danh sắc.<br>        Khổ không theo vô sản.\"", r:"Kinh Pháp Cú 221", l:"#"},
  {t:"\"Ai chận được phẫn nộ,<br>        Như dừng xe đang lăn,<br>        Ta gọi người đánh xe,<br>        Kẻ khác, cầm cương hờ.\"", r:"Kinh Pháp Cú 222", l:"#"},
  {t:"\"Lấy không giận thắng giận,<br>        Lấy thiện thắng không thiện,<br>        Lấy thí thắng xan tham,<br>        Lấy chơn thắng hư ngụy.\"", r:"Kinh Pháp Cú 223", l:"#"},
  {t:"\"Nói thật, không phẫn nộ,<br>        Của ít, thí người xin,<br>        Nhờ ba việc lành này,<br>        Người đến gần thiên giới.\"", r:"Kinh Pháp Cú 224", l:"#"},
  {t:"\"Bậc hiền không hại ai,<br>        Thân thường được chế ngự,<br>        Ðạt được cảnh bất tử,<br>        Ðến đây, không ưu sầu.\"", r:"Kinh Pháp Cú 225", l:"#"},
  {t:"\"Những người thường giác tỉnh,<br>        Ngày đêm siêng tu học,<br>        Chuyên tâm hướng Niết Bàn,<br>        Mọi lậu hoặc được tiêu.\"", r:"Kinh Pháp Cú 226", l:"#"},
  {t:"\"A-tu-la, nên biết,<br>        Xưa vậy, nay cũng vậy,<br>        Ngồi im, bị người chê,<br>        Nói nhiều bị người chê.<br>        Nói vừa phải, bị chê.<br>        Làm người không bị chê,<br>        Thật khó tìm ở đời.\"", r:"Kinh Pháp Cú 227", l:"#"},
  {t:"\"Xưa, vị lai, và nay,<br>        Ðâu có sự kiện này,<br>        Người hoàn toàn bị chê,<br>        Người trọn vẹn được khen.\"", r:"Kinh Pháp Cú 228", l:"#"},
  {t:"\"Sáng sáng, thẩm xét kỹ.<br>        Bậc có trí tán thán.<br>        Bậc trí không tỳ vết,<br>        Ðầy đủ giới định tuệ.\"", r:"Kinh Pháp Cú 229", l:"#"},
  {t:"\"Hạnh sáng như vàng ròng,<br>        Ai dám chê vị ấy?<br>        Chư thiên phải khen thưởng,<br>        Phạm Thiên cũng tán dương \".", r:"Kinh Pháp Cú 230", l:"#"},
  {t:"\"Giữ thân đừng phẫn nộ,<br>        Phòng thân khéo bảo vệ,<br>        Từ bỏ thân làm ác,<br>        Với thân làm hạnh lành.\"", r:"Kinh Pháp Cú 231", l:"#"},
  {t:"\"Giữ lời đừng phẫn nộ,<br>        Phòng lời, khéo bảo vệ,<br>        Từ bỏ lời thô ác,<br>        Với lời, nói điều lành.\"", r:"Kinh Pháp Cú 232", l:"#"},
  {t:"\"Giữ ý đừng phẫn nộ,<br>        Phòng ý, khéo bảo vệ,<br>        Từ bỏ ý nghĩ ác,<br>        Với ý, nghĩ hạnh lành.’", r:"Kinh Pháp Cú 233", l:"#"},
  {t:"\"Bậc trí bảo vệ thân,<br>        Bảo vệ luôn lời nói<br>        Bảo vệ cả tâm tư,<br>        Ba nghiệp khéo bảo vệ.\"", r:"Kinh Pháp Cú 234", l:"#"},
  {t:"\"Ngươi nay giống lá héo,<br>        Diêm sứ đang chờ ngươi,<br>        Ngươi đứng trước cửa chết,<br>        Ðường trường thiếu tư lương.\"", r:"Kinh Pháp Cú 235", l:"#"},
  {t:"\"Hãy tự làm hòn đảo,<br>        Tinh cần gấp, sáng suốt.<br>        Trừ cấu uế, thanh tịnh,<br>        Ðến Thánh địa chư Thiên.\"", r:"Kinh Pháp Cú 236", l:"#"},
  {t:"\"Ðời ngươi nay sắp tàn,<br>        Tiến gần đến Diêm Vương.<br>        Giữa đường không nơi nghỉ,<br>        Ðường trường thiếu tư lương.\"", r:"Kinh Pháp Cú 237", l:"#"},
  {t:"\"Hãy tự làm hòn đảo,<br>        Tinh cần gấp sáng suốt.<br>        Trừ cấu uế, thanh tịnh,<br>        Chẳng trở lại sanh già.\"", r:"Kinh Pháp Cú 238", l:"#"},
  {t:"\"Bậc trí theo tuần tự.<br>        Từng sát na trừ dần.<br>        Như thợ vàng lọc bụi<br>        Trừ cấu uế nơi mình.\"", r:"Kinh Pháp Cú 239", l:"#"},
  {t:"\"Như sét từ sắt sanh,<br>        Sắt sanh lại ăn sắt,<br>        Cũng vậy, quá lợi dưỡng<br>        Tự nghiệp dẫn cõi ác.\"", r:"Kinh Pháp Cú 240", l:"#"},
  {t:"\"Không tụng làm nhớp kinh,<br>        Không đứng dậy, bẩn nhà,<br>        Biếng nhác làm nhơ sắc,<br>        Phóng dật uế người canh\"", r:"Kinh Pháp Cú 241", l:"#"},
  {t:"\"Tà hạnh nhơ đàn bà,<br>        Xan tham nhớp kẻ thí,<br>        Ác pháp là vết nhơ,<br>        Ðời này và đời sau.\"", r:"Kinh Pháp Cú 242", l:"#"},
  {t:"\"Trong hàng cấu uế ấy,<br>        Vô minh, nhơ tối thượng,<br>        Ðoạn nhơ ấy, tỷ kheo,<br>        Thành bậc không uế nhiễm.\"", r:"Kinh Pháp Cú 243", l:"#"},
  {t:"\"Dễ thay, sống không hổ<br>        Sống lỗ mãng như quạ,<br>        Sống công kích huênh hoang,<br>        Sống liều lĩnh, nhiễm ô.\"", r:"Kinh Pháp Cú 244", l:"#"},
  {t:"\"Khó thay, sống xấu hổ,<br>        Thường thường cầu thanh tịnh.<br>        Sống vô tư, khiêm tốn,<br>        Trong sạch và sáng suốt.\"", r:"Kinh Pháp Cú 245", l:"#"},
  {t:"\"Ai ở đời sát sinh,<br>        Nói láo không chân thật,<br>        Ở đời lấy không cho,<br>        Qua lại với vợ người.\"", r:"Kinh Pháp Cú 246", l:"#"},
  {t:"\"Uống rượu men, rượu nấu,<br>        Người sống đam mê vậy,<br>        Chính ngay tại đời này,<br>        Tự đào bới gốc mình.\"", r:"Kinh Pháp Cú 247", l:"#"},
  {t:"\"Vậy người, hãy nên biết,<br>        Không chế ngự là ác.<br>        Chớ để tham phi pháp,<br>        Làm người đau khổ dài.\"", r:"Kinh Pháp Cú 248", l:"#"},
  {t:"\"Do tín tâm, hỷ tâm<br>        Loài người mới bố thí.<br>        Ở đây ai bất mãn<br>        Người khác được ăn uống,<br>        Người ấy ngày hoặc đêm,<br>        Không đạt được tâm định?\"", r:"Kinh Pháp Cú 249", l:"#"},
  {t:"\"Ai cắt được, phá được,<br>        Tận gốc nhổ tâm ấy.<br>        Người ấy ngày hoặc đêm,<br>        Ðạt được tâm thiền định.\"", r:"Kinh Pháp Cú 250", l:"#"},
  {t:"\"Lửa nào bằng lửa tham!<br>        Chấp nào bằng sân hận!<br>        Lưới nào bằng lưới si!<br>        Sông nào bằng sông ái! \"", r:"Kinh Pháp Cú 251", l:"#"},
  {t:"\"Dễ thay thấy lỗi người,<br>        Lỗi mình thấy mới khó.<br>        Lỗi người ta phanh tìm,<br>        Như sàng trấu trong gạo,<br>        Còn lỗi mình, che đậy,<br>        Như kẻ gian dấu bài.\"", r:"Kinh Pháp Cú 252", l:"#"},
  {t:"\"Ai thấy lỗi của người,<br>        Thường sanh lòng chỉ trích,<br>        Người ấy lậu hoặc tăng,<br>        Rất xa lậu hoặc diệt.\"", r:"Kinh Pháp Cú 253", l:"#"},
  {t:"\"Hư không, không dấu chân,<br>        Ngoài đây, không sa môn,<br>        Chúng sanh thích hý luận,<br>        Như lai, hý luận trừ.\"", r:"Kinh Pháp Cú 254", l:"#"},
  {t:"\"Hư không, không dấu chân,<br>        Ngoài đây, không sa môn.<br>        Các hành không thường trú,<br>        Chư Phật không giao động.\"", r:"Kinh Pháp Cú 255", l:"#"},
  {t:"\"Ngươi đâu phải pháp trụ,<br>        Xử sự quá chuyên chế,<br>        Bậc trí cần phân biệt<br>        Cả hai chánh và tà!\"", r:"Kinh Pháp Cú 256", l:"#"},
  {t:"\"Không chuyên chế, đúng pháp,<br>        Công bằng, dắt dẫn người,<br>        Bậc trí sống đúng pháp,<br>        Thật xứng danh pháp trụ.\"", r:"Kinh Pháp Cú 257", l:"#"},
  {t:"\"Không phải vì nói nhiều,<br>        Mới xứng danh bậc trí.<br>        An ổn, không oán sợ.<br>        Thật đáng gọi bậc trí.\"", r:"Kinh Pháp Cú 258", l:"#"},
  {t:"\"Không phải vì nói nhiều,<br>        Mới xứng danh trì pháp,<br>        Những ai tuy nghe ít,<br>        Nhưng thân hành đúng pháp,<br>        Không phóng túng chánh pháp,<br>        Mới xứng danh trì pháp.\"", r:"Kinh Pháp Cú 259", l:"#"},
  {t:"\"Không phải là trưởng lão,<br>        Dầu cho có bạc đầu.<br>        Người chỉ tuổi tác cao,<br>        Ðược gọi là: \"Lão ngu.\"", r:"Kinh Pháp Cú 260", l:"#"},
  {t:"\"Ai chân thật, đúng pháp,<br>        Không hại, biết chế phục,<br>        Bậc trí không cấu uế,<br>        Mới xứng danh Trưởng Lão.\"", r:"Kinh Pháp Cú 261", l:"#"},
  {t:"\"Không phải nói lưu loát,<br>        Không phải sắc mặt đẹp,<br>        Thành được người lương thiện,<br>        Nếu ganh, tham, dối trá.\"", r:"Kinh Pháp Cú 262", l:"#"},
  {t:"\"Ai cắt được, phá được<br>        Tận gốc nhổ tâm ấy<br>        Người trí ấy diệt sân,<br>        Ðược gọi người hiền thiện.\"", r:"Kinh Pháp Cú 263", l:"#"},
  {t:"\"Ðầu trọc, không sa môn<br>        Nếu phóng túng, nói láo.<br>        Ai còn đầy dục tham,<br>        Sao được gọi sa môn?\"", r:"Kinh Pháp Cú 264", l:"#"},
  {t:"\"Ai lắng dịu hoàn toàn,<br>        Các điều ác lớn nhỏ,<br>        Vì lắng dịu ác pháp,<br>        Ðược gọi là Sa môn.\"", r:"Kinh Pháp Cú 265", l:"#"},
  {t:"\" Chỉ khất thực nhờ người,<br>        Ðâu phải là tỷ kheo!<br>        Phải theo pháp toàn diện,<br>        Khất sĩ không, không đủ.\"", r:"Kinh Pháp Cú 266", l:"#"},
  {t:"\" Ai vượt qua thiện ác,<br>        Chuyên sống đời Phạm Hạnh,<br>        Sống thẩm sát ở đời,<br>        Mới xứng danh tỷ kheo.\"", r:"Kinh Pháp Cú 267", l:"#"},
  {t:"\"Im lặng nhưng ngu si,<br>        Ðâu được gọi ẩn sĩ?<br>        Như người cầm cán cân,<br>        Bậc trí chọn điều lành.\"", r:"Kinh Pháp Cú 268", l:"#"},
  {t:"\" Từ bỏ các ác pháp,<br>        Mới thật là ẩn sĩ.<br>        Ai thật hiểu hai đời<br>        Mới được gọi ẩn sĩ.\"", r:"Kinh Pháp Cú 269", l:"#"},
  {t:"\" Còn sát hại sinh linh,<br>        Ðâu được gọi Hiền thánh.<br>        Không hại mọi hữu tình,<br>        Mới được gọi Hiền Thánh.\"", r:"Kinh Pháp Cú 270", l:"#"},
  {t:"\"Chẳng phải chỉ giới cấm<br>        Cũng không phải học nhiều,<br>        Chẳng phải chứng thiền định,<br>        Sống thanh vắng một mình.\"", r:"Kinh Pháp Cú 271", l:"#"},
  {t:"\"Ta hưởng an ổn lạc,<br>        Phàm phu chưa hưởng được.<br>        Tỷ kheo, chớ tự tin<br>        Khi lậu hoặc chưa diệt.\"", r:"Kinh Pháp Cú 272", l:"#"},
  {t:"\"Tám chánh, đường thù thắng,<br>        Bốn câu, lý thù thắng.<br>        Ly tham, pháp thù thắng,<br>        Giữa các loài hai chân,<br>        Pháp nhãn, người thù thắng.\"", r:"Kinh Pháp Cú 273", l:"#"},
  {t:"\"Ðường này, không đường khác<br>        Ðưa đến kiến thanh tịnh.<br>        Nếu ngươi theo đường này,<br>        Ma quân sẽ mê loạn.\"", r:"Kinh Pháp Cú 274", l:"#"},
  {t:"\"Nếu người theo đường này,<br>        Ðau khổ được đoạn tận.<br>        Ta dạy người con đường.<br>        Với trí, gai chướng diệt.\"", r:"Kinh Pháp Cú 275", l:"#"},
  {t:"\"Người hãy nhiệt tình làm,<br>        Như Lai chỉ thuyết dạy.<br>        Người hành trì thiền định<br>        Thoát trói buộc Ác ma.\"", r:"Kinh Pháp Cú 276", l:"#"},
  {t:"\"Tất cả hành vô thường \"<br>        Với Tuệ, quán thấy vậy<br>        Ðau khổ được nhàm chán;<br>        Chính con đường thanh tịnh.\"", r:"Kinh Pháp Cú 277", l:"#"},
  {t:"\"Tất cả hành khổ đau<br>        Với Tuệ quán thấy vậy,<br>        Ðau khổ được nhàm chán;<br>        Chính con đường thanh tịnh.\"", r:"Kinh Pháp Cú 278", l:"#"},
  {t:"\"Tất cả pháp vô ngã,<br>        Với Tuệ quán thấy vậy,<br>        Ðau khổ được nhàm chán<br>        Chính con đường thanh tịnh.\"", r:"Kinh Pháp Cú 279", l:"#"},
  {t:"\"Khi cần, không nỗ lực,<br>        Tuy trẻ mạnh, nhưng lười<br>        Chí nhu nhược, biếng nhác.<br>        Với trí tuệ thụ động,<br>        Sao tìm được chánh đạo?\"", r:"Kinh Pháp Cú 280", l:"#"},
  {t:"\"Lời nói được thận trọng,<br>        Tâm tư khéo hộ phòng,<br>        Thân chớ làm điều ác,<br>        Hãy giữ ba nghiệp tịnh,<br>        Chứng đạo thánh nhân dạy.\"", r:"Kinh Pháp Cú 281", l:"#"},
  {t:"\"Tu thiền, trí tuệ sanh,<br>        Bỏ Thiền, trí tuệ diệt.<br>        Biết con đường hai ngả<br>        Ðưa đến hữu, phi hữu,<br>        Hãy tự mình nỗ lực,<br>        Khiến trí tuệ tăng trưởng.\"", r:"Kinh Pháp Cú 282", l:"#"},
  {t:"\"Ðốn rừng không đốn cây<br>        Từ rừng, sinh sợ hãi;<br>        Ðốn rừng và ái dục,<br>        Tỷ kheo, hãy tịch tịnh.\"", r:"Kinh Pháp Cú 283", l:"#"},
  {t:"\"Khi nào chưa cắt tiệt,<br>        Ái dục giữa gái trai,<br>        Tâm ý vẫn buộc ràng,<br>        Như bò con vú mẹ.\"", r:"Kinh Pháp Cú 284", l:"#"},
  {t:"\"Tự cắt giây ái dục,<br>        Như tay bẻ sen thu,<br>        Hãy tu đạo tịch tịnh,<br>        Niết-Bàn, Thiện Thệ dạy.\"", r:"Kinh Pháp Cú 285", l:"#"},
  {t:"\"Mùa mưa ta ở đây<br>        Ðông, hạ cũng ở đây,<br>        Người ngu tâm tưởng vậy,<br>        Không tự giác hiểm nguy.\"", r:"Kinh Pháp Cú 286", l:"#"},
  {t:"\"Người tâm ý đắm say<br>        Con cái và súc vật,<br>        Tử thần bắt người ấy,<br>        Như lụt trôi làng ngủ. \"", r:"Kinh Pháp Cú 287", l:"#"},
  {t:"\"Một khi tử thần đến,<br>        Không có con che chở,<br>        Không cha, không bà con,<br>        Không thân thích che chở.\"", r:"Kinh Pháp Cú 288", l:"#"},
  {t:"\"Biết rõ ý nghĩa này,<br>        Bậc trí lo trì giới,<br>        Mau lẹ làm thanh tịnh,<br>        Con đường đến Niết-Bàn.\"", r:"Kinh Pháp Cú 289", l:"#"},
  {t:"\"Nhờ từ bỏ lạc nhỏ,<br>        Thấy được lạc lớn hơn,<br>        Bậc trí bỏ lạc nhỏ,<br>        Thấy được lạc lớn hơn.\"", r:"Kinh Pháp Cú 290", l:"#"},
  {t:"\"Gieo khổ đau cho người,<br>        Mong cầu lạc cho mình,<br>        Bị hận thù buộc ràng<br>        Không sao thoát hận thù.\"", r:"Kinh Pháp Cú 291", l:"#"},
  {t:"\"Việc đáng làm, không làm,<br>        Không đáng làm, lại làm,<br>        Người ngạo mạn, phóng dật,<br>        Lậu hoặc ắt tăng trưởng.\"", r:"Kinh Pháp Cú 292", l:"#"},
  {t:"\"Người siêng năng cần mẫn,<br>        Thường thường quán thân niệm,<br>        Không làm việc không đáng,<br>        Gắng làm việc đáng làm,<br>        Người tư niệm giác tỉnh,<br>        Lậu hoặc được tiêu trừ.\"", r:"Kinh Pháp Cú 293", l:"#"},
  {t:"\"Sau khi giết mẹ cha,<br>        Giết hai Vua Sát lỵ,<br>        Giết vương quốc, quần thần<br>        Vô ưu, phạm chí sống.\"", r:"Kinh Pháp Cú 294", l:"#"},
  {t:"\"Sau khi giết mẹ cha,<br>        Hai vua Bà-la-môn,<br>        Giết hổ tướng thứ năm<br>        Vô ưu, phạm chí sống.\"", r:"Kinh Pháp Cú 295", l:"#"},
  {t:"\"Ðệ tử Gotama,<br>        Luôn luôn tự tỉnh giác<br>        Vô luận ngày hay đêm,<br>        Tưởng Phật Ðà thường niệm.\"", r:"Kinh Pháp Cú 296", l:"#"},
  {t:"\"Ðệ tử Gotama,<br>        Luôn luôn tự tỉnh giác,<br>        Vô luận ngày hay đêm,<br>        Tưởng Chánh Pháp thường niệm\"", r:"Kinh Pháp Cú 297", l:"#"},
  {t:"\"Ðệ tử Gotama,<br>        Luôn luôn tự tỉnh giác,<br>        Vô luận ngày hay đêm,<br>        Tưởng Tăng Già thường niệm.\"", r:"Kinh Pháp Cú 298", l:"#"},
  {t:"\"Ðệ tử Gotama,<br>        Luôn luôn tự tỉnh giác,<br>        Vô luận ngày hay đêm,<br>        Tưởng sắc thân thường niệm.\"", r:"Kinh Pháp Cú 299", l:"#"},
  {t:"\"Ðệ tử Gotama,<br>        Luôn luôn tự tỉnh giác,<br>        Vô luận ngày hay đêm,<br>        Ý vui niềm bất hại.\"", r:"Kinh Pháp Cú 300", l:"#"},
  {t:"\"Ðệ tử Gotama,<br>        Luôn luôn tự tỉnh giác,<br>        Vô luận ngày hay đêm,<br>        Ý vui tu thiền quán.\"", r:"Kinh Pháp Cú 301", l:"#"},
  {t:"\"Vui hạnh xuất gia khó,<br>        Tại gia sinh hoạt khó,<br>        Sống bạn không đồng, khổ,<br>        Trôi lăn luân hồi, khổ,<br>        Vậy chớ sống luân hồi,<br>        Chớ chạy theo đau khổ.\"", r:"Kinh Pháp Cú 302", l:"#"},
  {t:"\"Tín tâm, sống giới hạnh<br>        Ðủ danh xưng tài sản,<br>        Chỗ nào người ấy đến,<br>        Chỗ ấy được cung kính.\"", r:"Kinh Pháp Cú 303", l:"#"},
  {t:"\"Người lành dầu ở xa<br>        Sáng tỏ như núi tuyết,<br>        Người ác dầu ở gần<br>        Như tên bắn đêm đen.\"", r:"Kinh Pháp Cú 304", l:"#"},
  {t:"\"Ai ngồi nằm một mình.<br>        Ðộc hành không buồn chán,<br>        Tự điều phục một mình<br>        Sống thoải mái rừng sâu.\"", r:"Kinh Pháp Cú 305", l:"#"},
  {t:"\"Nói láo đọa địa ngục<br>        Có làm nói không làm,<br>        Cả hai chết đồng đẳng,<br>       Làm người, nghiệp hạ liệt.\"", r:"Kinh Pháp Cú 306", l:"#"},
  {t:"\"Nhiều người khoác cà sa,<br>        Ác hạnh không nhiếp phục.<br>        Người ác, do ác hạnh,<br>        Phải sanh cõi Ðịa ngục.\"", r:"Kinh Pháp Cú 307", l:"#"},
  {t:"\"Tốt hơn nuốt hòn sắt<br>        Cháy đỏ như lửa hừng,<br>        Hơn ác giới, buông lung<br>        Ăn đồ ăn quốc độ.\"", r:"Kinh Pháp Cú 308", l:"#"},
  {t:"\"Bốn nạn chờ đợi người,<br>        Phóng dật theo vợ người;<br>        Mắc họa, ngủ không yên,<br>        Bị chê là thứ ba,<br>        Ðọa địa ngục, thứ bốn.\"", r:"Kinh Pháp Cú 309", l:"#"},
  {t:"\"Mắc họa, đọa ác thú,<br>        Bị hoảng sợ, ít vui.<br>        Quốc vương phạt trọng hình.<br>        Vậy chớ theo vợ người.\"", r:"Kinh Pháp Cú 310", l:"#"},
  {t:"\"Như cỏ sa vụng nắm,<br>        Tất bị họa đứt tay<br>        Hạnh Sa môn tà vạy,<br>        Tất bị đọa địa ngục.\"", r:"Kinh Pháp Cú 311", l:"#"},
  {t:"\"Sống phóng đãng buông lung,<br>        Theo giới cấm ô nhiễm,<br>        Sống Phạm hạnh đáng nghi<br>        Sao chứng được quả lớn?", r:"Kinh Pháp Cú 312", l:"#"},
  {t:"\"Cần phải làm, nên làm<br>        Làm cùng tận khả năng<br>        Xuất gia sống phóng đãng,<br>        Chỉ tăng loạn bụi đời.\"", r:"Kinh Pháp Cú 313", l:"#"},
  {t:"\"Ác hạnh không nên làm,<br>        Làm xong, chịu khổ lụy,<br>        Thiện hạnh, ắt nên làm,<br>        Làm xong, không ăn năn.\"", r:"Kinh Pháp Cú 314", l:"#"},
  {t:"\"Như thành ở biên thùy,<br>        Trong ngoài đều phòng hộ<br>        Cũng vậy, phòng hộ mình,<br>        Sát na chớ buông lung.<br>        Giây phút qua, sầu muộn.<br>        Khi rơi vào địa ngục.\"", r:"Kinh Pháp Cú 315", l:"#"},
  {t:"\"Không đáng hổ, lại hổ.<br>        Việc đáng hổ, lại không.<br>        Do chấp nhận tà kiến,<br>        Chúng sanh đi ác thú.\"", r:"Kinh Pháp Cú 316", l:"#"},
  {t:"\"Không đáng sợ, lại sợ,<br>        Ðáng sợ, lại thấy không,<br>        Do chấp nhận tà kiến.<br>        Chúng sanh đi ác thú.\"", r:"Kinh Pháp Cú 317", l:"#"},
  {t:"\"Không lỗi, lại thấy lỗi,<br>        Có lỗi, lại thấy không,<br>        Do chấp nhận tà kiến,<br>        Chúng sanh đi ác thú.\"", r:"Kinh Pháp Cú 318", l:"#"},
  {t:"\"Có lỗi, biết có lỗi,<br>        Không lỗi, biết là không,<br>        Do chấp nhận chánh kiến,<br>        Chúng sanh đi cõi lành.\"", r:"Kinh Pháp Cú 319", l:"#"},
  {t:"\"Ta như voi giữa trận,<br>        Hứng chịu cung tên rơi,<br>        Chịu đựng mọi phỉ báng.<br>        Ác giới rất nhiều người.\"", r:"Kinh Pháp Cú 320", l:"#"},
  {t:"\"Voi luyện, đưa dự hội,<br>        Ngựa luyện, được vua cưỡi,<br>        Người luyện, bậc tối thượng<br>        Chịu đựng mọi phỉ báng.\"", r:"Kinh Pháp Cú 321", l:"#"},
  {t:"\"Tốt thay, con la thuần,<br>        Thuần chủng loài ngựa Sin.<br>        Ðại tượng, voi có ngà.<br>        Tự điều mới tối thượng.\"", r:"Kinh Pháp Cú 322", l:"#"},
  {t:"\"Chẳng phải loài cưỡi ấy,<br>        Ðưa người đến Niết-Bàn,<br>        Chỉ có người tự điều,<br>        Ðến đích, nhờ điều phục.\"", r:"Kinh Pháp Cú 323", l:"#"},
  {t:"\"Con voi tên Tài Hộ,<br>        Phát dục, khó điều phục,<br>        Trói buộc, không ăn uống.<br>        Voi nhớ đến rừng voi.\"", r:"Kinh Pháp Cú 324", l:"#"},
  {t:"\"Người ưa ngủ, ăn lớn<br>        Nằm lăn lóc qua lại,<br>        Chẳng khác heo no bụng,<br>        Kẻ ngu nhập thai mãi.\"", r:"Kinh Pháp Cú 325", l:"#"},
  {t:"\"Trước tâm này buông lung,<br>        Chạy theo ái, dục, lạc.<br>        Nay Ta chánh chế ngự,<br>        Như cầm móc điều voi.\"", r:"Kinh Pháp Cú 326", l:"#"},
  {t:"\"Hãy vui không phóng dật,<br>        Khéo phòng hộ tâm ý.<br>        Kéo mình khỏi ác đạo,<br>        Như voi bị sa lầy.\"", r:"Kinh Pháp Cú 327", l:"#"},
  {t:"\"Nếu được bạn hiền trí<br>        Ðáng sống chung, hạnh lành,<br>        Nhiếp phục mọi hiểm nguy<br>        Hoan hỷ sống chánh niệm.\"", r:"Kinh Pháp Cú 328", l:"#"},
  {t:"\"Không gặp bạn hiền trí.<br>        Ðáng sống chung, hạnh lành<br>        Như vua bỏ nước bại,<br>        Hãy sống riêng cô độc,<br>        Như voi sống rừng voi.\"", r:"Kinh Pháp Cú 329", l:"#"},
  {t:"\"Tốt Hơn sống một mình,<br>        Không kết bạn người ngu.<br>        Ðộc thân, không ác hạnh<br>        Sống vô tư vô lự,<br>        Như voi sống rừng voi.\"", r:"Kinh Pháp Cú 330", l:"#"},
  {t:"\"Vui thay, bạn lúc cần!<br>        Vui thay, sống biết đủ,<br>        Vui thay, chết có đức!<br>        Vui thay, mọi khổ đoạn.\"", r:"Kinh Pháp Cú 331", l:"#"},
  {t:"\"Vui thay, hiếu kính mẹ,<br>        Vui thay, hiếu kính cha,<br>        Vui thay, kính Sa môn,<br>        Vui thay, kính Hiền Thánh.\"", r:"Kinh Pháp Cú 332", l:"#"},
  {t:"\"Vui thay, già có giới!<br>        Vui thay, tín an trú!<br>        Vui thay, được trí tuệ,<br>        Vui thay, ác không làm.\"", r:"Kinh Pháp Cú 333", l:"#"},
  {t:"\"Người sống đời phóng dật,<br>        Ái tăng như giây leo.<br>        Nhảy đời này đời khác,<br>        Như vượn tham quả rừng.\"", r:"Kinh Pháp Cú 334", l:"#"},
  {t:"\"Ai sống trong đời này,<br>        Bị ái dục buộc ràng<br>        Sầu khổ sẽ tăng trưởng,<br>        Như cỏ Bi gặp mưa.\"", r:"Kinh Pháp Cú 335", l:"#"},
  {t:"\"Ai sống trong đời này<br>        Ái dục được hàng phục<br>        Sầu rơi khỏi người ấy<br>        Như giọt nước lá sen.\"", r:"Kinh Pháp Cú 336", l:"#"},
  {t:"\"Ðây điều lành Ta dạy,<br>        Các người tụ họp đây.<br>        Hãy nhổ tận gốc ái<br>        Như nhổ gốc cỏ Bi.<br>        Chớ để ma phá hoại,<br>        Như giòng nước cỏ lau.\"", r:"Kinh Pháp Cú 337", l:"#"},
  {t:"\"Như cây bị chặt đốn,<br>        Gốc chưa hại vẫn bền<br>        Ái tùy miên chưa nhổ,<br>        Khổ này vẫn sanh hoài.\"", r:"Kinh Pháp Cú 338", l:"#"},
  {t:"\"Ba mươi sáu dòng Ái,<br>        Trôi người đốn khả ái.<br>        Các tư tưởng tham ái.<br>        Cuốn trôi người tà kiến.\"", r:"Kinh Pháp Cú 339", l:"#"},
  {t:"\"Dòng ái dục chảy khắp,<br>        Như giây leo mọc tràn,<br>        Thấy giây leo vừa sanh,<br>        Với tuệ, hãy đoạn gốc.\"", r:"Kinh Pháp Cú 340", l:"#"},
  {t:"\"Người đời nhớ ái dục,<br>        Ưa thích các hỷ lạc.<br>        Tuy mong cầu an lạc,<br>        Họ vẫn phải sanh già.\"", r:"Kinh Pháp Cú 341", l:"#"},
  {t:"\"Người bị ái buộc ràng,<br>        Vùng vẫy và hoảng sợ,<br>        Như thỏ bị sa lưới.<br>        Họ sanh ái trói buộc,<br>        Chịu khổ đau dài dài.\"", r:"Kinh Pháp Cú 342", l:"#"},
  {t:"\"Người bị ái buộc ràng,<br>        Vùng vẫy và hoảng sợ,<br>        Như thỏ bị sa lưới.<br>        Do vậy vị tỷ kheo,<br>        Mong cầu mình ly tham<br>        Nên nhiếp phục ái dục.\"", r:"Kinh Pháp Cú 343", l:"#"},
  {t:"\"Lìa rừng lại hướng rừng<br>        Thoát rừng chạy theo rừng.<br>        Nên xem người như vậy,<br>        Ðược thoát khỏi buộc ràng.<br>        Lại chạy theo ràng buộc.\"", r:"Kinh Pháp Cú 344", l:"#"},
  {t:"\"Sắt, cây, gai trói buộc<br>        Người trí xem chưa bền.<br>        Tham châu báu, trang sức<br>        Tham vọng vợ và con.\"", r:"Kinh Pháp Cú 345", l:"#"},
  {t:"\"Người có trí nói rằng:<br>        \"Trói buộc này thật bền.<br>        Rì kéo xuống, lún xuống,<br>        Nhưng thật sự khó thoát.<br>        Người trí cắt trừ nó,<br>        Bỏ dục lạc, không màng.\"", r:"Kinh Pháp Cú 346", l:"#"},
  {t:"\"Người đắm say ái dục<br>        Tự lao mình xuống dòng<br>        Như nhện sa lưới dệt.<br>        Người trí cắt trừ nó,<br>        Bỏ mọi khổ, không màng.\"", r:"Kinh Pháp Cú 347", l:"#"},
  {t:"\"Bỏ quá, hiện, vị lai,<br>        Ðến bờ kia cuộc đời,<br>        Ý giải thoát tất cả,<br>        Chớ vướng lại sanh già.\"", r:"Kinh Pháp Cú 348", l:"#"},
  {t:"\"Người tà ý nhiếp phục,<br>        Tham sắc bén nhìn tịnh,<br>        Người ấy ái tăng trưởng,<br>        Làm giây trói mình chặt.\"", r:"Kinh Pháp Cú 349", l:"#"},
  {t:"\"Ai vui, an tịnh ý,<br>        Quán bất tịnh, thường niệm,<br>        Người ấy sẽ diệt ái,<br>        Cắt đứt Ma trói buộc.\"", r:"Kinh Pháp Cú 350", l:"#"},
  {t:"\"Ai tới đích, không sợ,<br>        Ly ái, không nhiễm ô<br>        Nhổ mũi tên sanh tử,<br>        Thân này thân cuối cùng.\"", r:"Kinh Pháp Cú 351", l:"#"},
  {t:"\"Bỏ ái, không chấp thủ.<br>Cú pháp khéo biện tài<br>Thấu suốt từ vô ngại,<br>Hiểu thứ lớp trước sau.<br>Thân này thân cuối cùng<br>Vị như vậy được gọi,<br>Bậc Ðại trí, đại nhân.\"", r:"Kinh Pháp Cú 352", l:"#"},
  {t:"\"Ta hàng phục tất cả,<br>        Ta rõ biết tất cả,<br>        Không bị nhiễm pháp nào.<br>        Ta từ bỏ tất cả<br>        Ái diệt, tự giải thoát.<br>        Ðã tự mình thắng trí,<br>        Ta gọi ai thầy ta?\"", r:"Kinh Pháp Cú 353", l:"#"},
  {t:"\"Pháp thí, thắng mọi thí!<br>        Pháp vị, thắng mọi vị!<br>        Pháp hỷ, thắng mọi hỷ!<br>        Ái diệt, dứt mọi khổ!\"", r:"Kinh Pháp Cú 354", l:"#"},
  {t:"\"Tài sản hại người ngu.<br>        Không người tìm bờ kia<br>        Kẻ ngu vì tham giàu,<br>        Hại mình và hại người.\"", r:"Kinh Pháp Cú 355", l:"#"},
  {t:"\"Cỏ làm hại ruộng vườn,<br>        Tham làm hại người đời.<br>        Bố thí người ly tham,<br>        Do vậy được quả lớn.\"", r:"Kinh Pháp Cú 356", l:"#"},
  {t:"\"Cỏ làm hại ruộng vườn,<br>        Sân làm hại người đời.<br>        Bố thí người ly sân,<br>        Do vậy được quả lớn.\"", r:"Kinh Pháp Cú 357", l:"#"},
  {t:"\"Cỏ làm hại ruộng vườn,<br>        Si làm hại người đời,<br>        Bố thí người ly si,<br>        Do vậy được quả lớn.\"", r:"Kinh Pháp Cú 358", l:"#"},
  {t:"\"Cỏ làm hại ruộng vườn,<br>        Dục làm hại người đời.<br>        Bố thí người ly dục,<br>        Do vậy được quả lớn.\"", r:"Kinh Pháp Cú 359", l:"#"},
  {t:"\"Lành thay, phòng hộ mắt!<br>        Lành thay, phòng hộ tai.<br>        Lành thay, phòng hộ mũi,<br>        Lành thay, phòng hộ lưỡi.\"", r:"Kinh Pháp Cú 360", l:"#"},
  {t:"\"Lành thay,phòng hộ thân!<br>        Lành thay, phòng hộ lời,<br>        Lành thay, phòng hộ ý.<br>        Lành thay, phòng tất cả.<br>        Tỷ kheo phòng tất cả.<br>        Thoát được mọi khổ đau.\"", r:"Kinh Pháp Cú 361", l:"#"},
  {t:"\"Người chế ngự tay chân,<br>        Chế ngự lời và đầu,<br>        Vui thích nội thiền định.<br>        Ðộc thân, biết vừa đủ,<br>        Thật xứng gọi tỷ kheo.\"", r:"Kinh Pháp Cú 362", l:"#"},
  {t:"\"Tỷ kheo chế ngự miệng,<br>        Vừa lời, không cống cao,<br>        Khi trình bày pháp nghĩa,<br>        Lời lẽ dịu ngọt ngào.\"", r:"Kinh Pháp Cú 363", l:"#"},
  {t:"\"Vị tỷ kheo thích pháp,<br>        Mến pháp, suy tư Pháp.<br>        Tâm tư niệm chánh Pháp,<br>        Không rời bỏ chánh Pháp.\"", r:"Kinh Pháp Cú 364", l:"#"},
  {t:"\"Không khinh điều mình được,<br>        Không ganh người khác được<br>        Tỷ kheo ganh tị người,<br>        Không sao chứng Thiền Ðịnh.\"", r:"Kinh Pháp Cú 365", l:"#"},
  {t:"\"Tỷ kheo dầu được ít,<br>        Không khinh điều mình được,<br>        Sống thanh tịnh không nhác,<br>        Chư thiên khen vị này.\"", r:"Kinh Pháp Cú 366", l:"#"},
  {t:"\"Hoàn toàn, đối danh sắc,<br>        Không chấp Ta, của Ta.<br>        Không chấp, không sầu não.<br>        Thật xứng danh Tỷ kheo.\"", r:"Kinh Pháp Cú 367", l:"#"},
  {t:"\"Tỷ kheo trú từ bi,<br>        Tín thành giáo Pháp Phật,<br>        Chứng cảnh giới tịch tỉnh.<br>        Các hạnh an tịnh lạc.\"", r:"Kinh Pháp Cú 368", l:"#"},
  {t:"\"Tỷ-kheo, tát thuyền này,<br>        Thuyền không, nhẹ đi mau.<br>        Trừ tham, diệt sân hận,<br>        Tất chứng đạt Niết-Bàn.\"", r:"Kinh Pháp Cú 369", l:"#"},
  {t:"\"Ðoạn năm, từ bỏ năm<br>        Tụ tập năm tối thượng<br>        Tỷ kheo vượt năm ái<br>        Xứng danh \"Vượt bộc lưu\"", r:"Kinh Pháp Cú 370", l:"#"},
  {t:"\"Tỷ kheo, hãy tu thiền,<br>        Chớ buông lung phóng dật,<br>        Tâm chớ đắm say dục,<br>        Phóng dật, nuốt sắt nóng<br>        Bị đốt, chớ than khổ!\"", r:"Kinh Pháp Cú 371", l:"#"},
  {t:"\"Không trí tuệ, không thiền,<br>        Không thiền, không trí tuệ.<br>        Người có thiền có tuệ,<br>        Nhất định gần Niết-Bàn.\"", r:"Kinh Pháp Cú 372", l:"#"},
  {t:"\"Bước vào ngôi nhà trống,<br>        Tỷ kheo tâm an tịnh,<br>        Thọ hưởng vui siêu nhân<br>        Tịnh quán theo chánh pháp.\"", r:"Kinh Pháp Cú 373", l:"#"},
  {t:"\"Người luôn luôn chánh niệm,<br>        Sự sanh diệt các uẩn,<br>        Ðược hoan hỷ, hân hoan,<br>        Chỉ bậc bất tử biết.\"", r:"Kinh Pháp Cú 374", l:"#"},
  {t:"\"Ðây Tỷ kheo có trí,<br>        Tụ tập pháp căn bản<br>        Hộ căn, biết vừa đủ,<br>        Giữ gìn căn bản giới,<br>        Thường gần gũi bạn lành,<br>        Sống thanh tịnh tinh cần.\"", r:"Kinh Pháp Cú 375", l:"#"},
  {t:"\"\"Giao thiệp khéo thân thiện,<br>        Cử chỉ mực đoan trang.<br>        Do vậy hưởng vui nhiều,<br>        Sẽ dứt mọi khổ đau.\"", r:"Kinh Pháp Cú 376", l:"#"},
  {t:"\"Như hoa Vassikà,<br>        Quăng bỏ cánh úa tàn,<br>        Cũng vậy vị Tỷ kheo,<br>        Hãy giải thoát tham sân.\"", r:"Kinh Pháp Cú 377", l:"#"},
  {t:"\"Thân tịnh, lời an tịnh,<br>        An tịnh, khéo thiền tịnh.<br>        Tỷ kheo bỏ thế vật,<br>        Xứng danh \"bậc tịch tịnh \".", r:"Kinh Pháp Cú 378", l:"#"},
  {t:"\"Tự mình chỉ trích mình,<br>        Tự mình dò xét mình,<br>        Tỷ kheo tự phòng hộ<br>        Chánh niệm, trú an lạc.\"", r:"Kinh Pháp Cú 379", l:"#"},
  {t:"\"Tự mình y chỉ mình,<br>        Tự mình đi đến mình,<br>        Vậy hãy tự điều phục,<br>        Như khách buôn ngựa hiền.\"", r:"Kinh Pháp Cú 380", l:"#"},
  {t:"\"Tỷ kheo nhiều hân hoan,<br>        Tịnh tín giáo pháp Phật,<br>        Chứng cảnh giới tịch tịnh,<br>        Các hạnh an tịnh lạc.\"", r:"Kinh Pháp Cú 381", l:"#"},
  {t:"\"Tỷ kheo tuy tuổi nhỏ<br>        Siêng tu giáo pháp Phật,<br>        Soi sáng thế gian này,<br>        Như trăng thoát khỏi mây.\"", r:"Kinh Pháp Cú 382", l:"#"},
  {t:"\"Hỡi này Bà là môn,<br>        Hãy tinh tấn đoạn dòng,<br>        Từ bỏ các dục lạc,<br>        Biết được hành đoạn diệt,<br>        Người là bậc vô vi.\"", r:"Kinh Pháp Cú 383", l:"#"},
  {t:"\"Nhờ thường trú hai pháp<br>        Ðến được bờ bên kia.<br>        Bà-la-môn có trí,<br>        Mọi kiết sử dứt sạch.\"", r:"Kinh Pháp Cú 384", l:"#"},
  {t:"\"Không bờ này, bờ kia<br>        Cả hai bờ không có,<br>        Lìa khổ, không trói buộc<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 385", l:"#"},
  {t:"\"Tu thiền, trú ly trần<br>        Phận sự xong, vô lậu,<br>        Ðạt được đích tối thượng,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 386", l:"#"},
  {t:"\"Mặt trời sáng ban ngày,<br>        Mặt trăng sáng ban đêm.<br>        Khí giới sáng Sát lỵ,<br>        Thiền định sáng Phạm chí.<br>        Còn hào quang đức Phật,<br>        Chói sáng cả ngày đêm.\"", r:"Kinh Pháp Cú 387", l:"#"},
  {t:"\"Dứt ác gọi Phạm chí,<br>        Tịnh hạnh gọi Sa môn,<br>        Tự mình xuất cấu uế,<br>        Nên gọi bậc xuất gia.\"", r:"Kinh Pháp Cú 388", l:"#"},
  {t:"\"Chớ có đập Phạm chí!<br>        Phạm chí chớ đập lại!<br>        Xấu thay đập Phạm chí<br>        Ðập trả lại xấu hơn!\"", r:"Kinh Pháp Cú 389", l:"#"},
  {t:"\"Ðối vị Bà-la-môn,<br>        Ðây không lợi ích nhỏ.<br>        Khi ý không ái luyến,<br>        Tâm hại được chận đứng,<br>        Chỉ khi ấy khổ diệt,\"", r:"Kinh Pháp Cú 390", l:"#"},
  {t:"\"Với người thân miệng ý,<br>        Không làm các ác hạnh<br>        Ba nghiệp được phòng hộ,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 391", l:"#"},
  {t:"\"Từ ai, biết chánh pháp<br>        Bậc Chánh Giác thuyết giảng,<br>        Hãy kính lễ vị ấy,<br>        Như phạm chí chờ lửa.\"", r:"Kinh Pháp Cú 392", l:"#"},
  {t:"\"Ðược gọi Bà-la-môn,<br>        Không vì đầu bện tóc,<br>        Không chủng tộc, thọ sanh,<br>        Ai thật chân, chánh, tịnh,<br>        Mới gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 393", l:"#"},
  {t:"\"Kẻ ngu, có ích gì<br>        Bện tóc với da dê,<br>        Nội tâm toàn phiền não,<br>        Ngoài mặt đánh bóng suông.\"", r:"Kinh Pháp Cú 394", l:"#"},
  {t:"\"Người mặc áo đống rác,<br>        Gầy ốm, lộ mạch gân,<br>        Ðộc thân thiền trong rừng.<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 395", l:"#"},
  {t:"\"Ta không gọi Phạm Chí,<br>        Vì chỗ sanh, mẹ sanh.<br>        Chỉ được gọi tên suông<br>        Nếu tâm còn phiền não.<br>        Không phiền não, chấp trước<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 396", l:"#"},
  {t:"\"Ðoạn hết các kiết sử,<br>        Không còn gì lo sợ<br>        Không đắm trước buộc ràng<br>        Ta gọi Bà-la-môn", r:"Kinh Pháp Cú 397", l:"#"},
  {t:"\"Bỏ đai da, bỏ cương<br>        Bỏ dây, đồ sở thuộc,<br>        Bỏ then chốt, sáng suốt,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 398", l:"#"},
  {t:"\"Không ác ý, nhẫn chịu,<br>        Phỉ báng, đánh, phạt hình,<br>        Lấy nhẫn làm quân lực,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 399", l:"#"},
  {t:"\"Không hận, hết bổn phận,<br>        Trì giới, không tham ái,<br>        Nhiếp phục, thân cuối cùng,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 400", l:"#"},
  {t:"\"Như nước trên lá sen,<br>        Như hột cải đầu kim,<br>        Người không nhiễm ái dục,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 401", l:"#"},
  {t:"\"Ai tự trên đời này,<br>        Giác khổ, diệt trừ khổ,<br>        Bỏ gánh nặng, giải thoát,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 402", l:"#"},
  {t:"\"Người trí tuệ sâu xa,<br>        Khéo biết đạo, phi đạo<br>        Chứng đạt đích vô thượng,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 403", l:"#"},
  {t:"\"Không liên hệ cả hai,<br>        Xuất gia và thế tục,<br>        Sống độc thân, ít dục,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 404", l:"#"},
  {t:"\"Bỏ trượng, đối chúng sanh,<br>        Yếu kém hay kiên cường,<br>        Không giết, không bảo giết,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 405", l:"#"},
  {t:"\"Thân thiện giữa thù địch<br>        Ôn hòa giữa hung hăng.<br>        Không nhiễm, giữa nhiễm trước,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 406", l:"#"},
  {t:"\"Người bỏ rơi tham sân,<br>        Không mạn không ganh tị,<br>        Như hột cải đầu kim,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 407", l:"#"},
  {t:"\"Nói lên lời ôn hòa,<br>        Lợi ích và chân thật,<br>        Không mất lòng một ai,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 408", l:"#"},
  {t:"\"Ở đời, vật dài, ngắn,<br>        Nhỏ, lớn, đẹp hay xấu<br>        Phàm không cho không lấy,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 409", l:"#"},
  {t:"\"Người không có hy cầu,<br>        Ðời này và đời sau,<br>        Không hy cầu, giải thoát,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 410", l:"#"},
  {t:"\"Người không còn tham ái,<br>        Có trí, không nghi hoặc,<br>        Thể nhập vào bất tử,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 411", l:"#"},
  {t:"\"Người sống ở đời này<br>        Không nhiễm cả thiện ác,<br>        Không sầu, sạch không bụi<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 412", l:"#"},
  {t:"\"Như trăng, sạch không uế<br>        Sáng trong và tịnh lặng,<br>        Hữu ái, được đoạn tận,<br>        Ta gọi Bà là môn.\"", r:"Kinh Pháp Cú 413", l:"#"},
  {t:"\"Vượt đường nguy hiểm này,<br>        Nhiếp phục luân hồi, si,<br>        Ðến bờ kia thiền định<br>        Không dục ái, không nghi,<br>        Không chấp trước, tịch tịnh,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 414", l:"#"},
  {t:"\"Ai ở đời, đoạn dục,<br>        Bỏ nhà, sống xuất gia,<br>        Dục hữu được đoạn tận,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 415", l:"#"},
  {t:"\"Ai ở đời đoạn ái<br>        Bỏ nhà, sống xuất gia,<br>        Ái hữu được đoạn tận,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 416", l:"#"},
  {t:"\"Bỏ trói buộc loài người,<br>        Vượt trói buộc cõi trời.<br>        Giải thoát mọi buộc ràng,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 417", l:"#"},
  {t:"\"Bỏ điều ưa, điều ghét,<br>        Mát lạnh, diệt sanh y<br>        Bậc anh hùng chiến thắng,<br>        Nhiếp phục mọi thế giới,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 418", l:"#"},
  {t:"\"Ai hiểu rõ hoàn toàn<br>        Sanh tử các chúng sanh,<br>        Không nhiễm, khéo vượt qua,<br>        Sáng suốt chân giác ngộ,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 419", l:"#"},
  {t:"\"Với ai, loài trời, người<br>        Cùng với Càn thát bà,<br>        Không biết chỗ thọ sanh<br>        Lậu tận bậc La hán.<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 420", l:"#"},
  {t:"\"Ai quá, hiện, vị lai<br>        Không một sở hữu gì,<br>        Không sở hữu không nắm,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 421", l:"#"},
  {t:"\"Bậc trâu chúa, thù thắng<br>        Bậc anh hùng, đại sĩ,<br>        Bậc chiến thắng, không nhiễm,<br>        Bậc tẩy sạch, giác ngộ,<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 422", l:"#"},
  {t:"\"Ai biết được đời trước,<br>        Thấy thiên giới, đọa xứ,<br>        Ðạt được sanh diệt tận<br>        Thắng trí, tự viên thành<br>        Bậc mâu ni đạo sĩ.<br>        Viên mãn mọi thành tựu<br>        Ta gọi Bà-la-môn.\"", r:"Kinh Pháp Cú 423", l:"#"},
];
// Tổng cộng: 423 câu


function showPhapCu() {
  const v = DHAMMAPADA[Math.floor(Math.random()*DHAMMAPADA.length)];
  document.getElementById("phapcu-content").innerHTML = `
    <div style="margin-bottom:24px; font-size:18px;">${v.t}</div>
    <p style="font-weight:bold; color:#7b5e57; margin:20px 0; font-size:18px;">
      ${v.r}
    </p>
  `;
  document.getElementById("phapcu-modal").style.display = "flex";
}

// Đóng modal khi nhấn ESC
document.addEventListener("keydown", e => { if(e.key==="Escape") document.getElementById("phapcu-modal").style.display="none"; });

// Click vào bất kỳ ô ngày nào → hiện Pháp Cú
document.getElementById("calendar").addEventListener("click", e => {
  const cell = e.target.closest("td.cell");
  if (cell && cell.textContent.trim() !== "") {
    showPhapCu();
  }
});