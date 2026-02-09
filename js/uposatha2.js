


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

  table += "<tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr>";

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
let displayText = date + "<span class='lunar'>" + iconHtml + "</span>";

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
  {t:"\"Intention shapes experiences;<br> intention is first, they’re made by intention.<br> If with corrupt intent<br> you speak or act,<br> suffering follows you,<br> like a wheel, the ox’s foot.\"", r:"Dhammapada 1",},
 {t:"\"Intention shapes experiences;<br> intention is first, they’re made by intention.<br> If with pure intent<br> you speak or act,<br> happiness follows you<br> like a shadow that never leaves.\"", r:"Dhammapada 2",},
 {t:"\"“They abused me, they hit me!<br> They beat me, they robbed me!”<br> For those who bear such a grudge,<br> hatred is never laid to rest.\"", r:"Dhammapada 3",},
 {t:"\"“They abused me, they hit me!<br> They beat me, they robbed me!”<br> For those who bear no such grudge,<br> hatred is laid to rest.\"", r:"Dhammapada 4",},
 {t:"\"For never is hatred<br> laid to rest by hate,<br> it’s laid to rest by love:<br> this is an ancient teaching.\"", r:"Dhammapada 5",},
 {t:"\"When others do not understand,<br> let us, who do understand this,<br> restrain ourselves in this regard;<br> for that is how conflicts are laid to rest.\"", r:"Dhammapada 6",},
 {t:"\"Those who contemplate the beautiful,<br> their faculties unrestrained,<br> immoderate in eating,<br> lazy, lacking energy:<br> Māra strikes them down<br> like the wind, a feeble tree.\"", r:"Dhammapada 7",},
 {t:"\"Those who contemplate the ugly,<br> their faculties well-restrained,<br> eating in moderation,<br> faithful and energetic:<br> Māra cannot strike them down,<br> like the wind, a rocky mountain.\"", r:"Dhammapada 8",},
 {t:"\"One who, not free of stains themselves,<br> would wear the robe stained in ocher,<br> bereft of self-control and of truth:<br> they are not worthy of the ocher robe.\"", r:"Dhammapada 9",},
 {t:"\"One who’s purged all their stains,<br> steady in ethics,<br> possessed of self-control and of truth,<br> they are truly worthy of the ocher robe.\"", r:"Dhammapada 10",},
 {t:"\"Thinking the inessential is essential,<br> seeing the essential as inessential;<br> they don’t realize the essential,<br> for wrong thoughts are their habitat.\"", r:"Dhammapada 11",},
 {t:"\"Having known the essential as essential,<br> and the inessential as inessential;<br> they realize the essential,<br> for right thoughts are their habitat.\"", r:"Dhammapada 12",},
 {t:"\"Just as rain seeps into<br> a poorly roofed house,<br> lust seeps into<br> an undeveloped mind.\"", r:"Dhammapada 13",},
 {t:"\"Just as rain doesn’t seep into<br> a well roofed house,<br> lust doesn’t seep into<br> a well developed mind.\"", r:"Dhammapada 14",},
 {t:"\"Here they grieve, hereafter they grieve,<br> an evildoer grieves in both places.<br> They grieve and fret,<br> seeing their own corrupt deeds.\"", r:"Dhammapada 15",},
 {t:"\"Here they rejoice, hereafter they rejoice,<br> one who does good rejoices in both places.<br> They rejoice and celebrate,<br> seeing their own pure deeds.\"", r:"Dhammapada 16",},
 {t:"\"Here they’re tormented,<br> hereafter they’re tormented,<br> an evildoer is tormented in both places.<br> They’re tormented<br> thinking of bad things they’ve done;<br> when gone to a bad place,<br> they’re tormented all the more.\"", r:"Dhammapada 17",},
 {t:"\"Here they delight, hereafter they delight,<br> one who does good delights in both places.<br> They delight thinking of good things they’ve done;<br> when gone to a good place, they delight all the more.\"", r:"Dhammapada 18",},
 {t:"\"Much though they may recite scripture,<br> if a negligent person does not apply them,<br> then, like a cowherd who counts the cattle of others,<br> they miss out on the blessings of the ascetic life.\"", r:"Dhammapada 19",},
 {t:"\"Little though they may recite scripture,<br> if they live in line with the teaching,<br> having given up greed, hate, and delusion,<br> with deep understanding and heart well freed,<br> not grasping to this life or the next,<br> they share in the blessings of the ascetic life.\"", r:"Dhammapada 20",},
 {t:"\"Heedfulness is the state free of death;<br> heedlessness is the state of death.<br> The heedful do not die,<br> while the heedless are like the dead.\"", r:"Dhammapada 21",},
 {t:"\"Understanding this distinction<br> when it comes to heedfulness,<br> the astute rejoice in heedfulness,<br> happy in the noble ones’ domain.\"", r:"Dhammapada 22",},
 {t:"\"They who regularly meditate,<br> always staunchly vigorous;<br> the attentive realize extinguishment,<br> the supreme sanctuary from the yoke.\"", r:"Dhammapada 23",},
 {t:"\"For the hard-working and mindful,<br> pure of deed and attentive,<br> restrained, living righteously, and diligent,<br> their reputation only grows.\"", r:"Dhammapada 24",},
 {t:"\"By hard work and diligence,<br> by restraint and by self-control,<br> a smart person would build an island<br> that the floods cannot overflow.\"", r:"Dhammapada 25",},
 {t:"\"Fools and simpletons<br> devote themselves to negligence.<br> But the wise protect diligence<br> as their best treasure.\"", r:"Dhammapada 26",},
 {t:"\"Don’t devote yourself to negligence,<br> or delight in erotic intimacy.<br> For if you’re diligent and meditate,<br> you’ll attain abundant happiness.\"", r:"Dhammapada 27",},
 {t:"\"When the astute dispel negligence<br> by means of diligence,<br> ascending the palace of wisdom,<br> sorrowless, they behold this generation of sorrow,<br> as an attentive one on a mountain top<br> beholds the fools below.\"", r:"Dhammapada 28",},
 {t:"\"Heedful among the heedless,<br> wide awake while others sleep—<br> a true sage leaves them behind,<br> like a swift horse passing a feeble.\"", r:"Dhammapada 29",},
 {t:"\"Maghavā became chief of the gods<br> by means of diligence.<br> People praise diligence,<br> while negligence is always deplored.\"", r:"Dhammapada 30",},
 {t:"\"A mendicant who loves to be diligent,<br> seeing fear in negligence—<br> advances like fire,<br> burning up fetters big and small.\"", r:"Dhammapada 31",},
 {t:"\"A mendicant who loves to be diligent,<br> seeing fear in negligence—<br> such a one can’t decline,<br> and has drawn near to extinguishment.\"", r:"Dhammapada 32",},
 {t:"\"The mind quivers and shakes,<br> hard to guard, hard to curb.<br> The discerning straighten it out,<br> like a fletcher straightens an arrow.\"", r:"Dhammapada 33",},
 {t:"\"Like a fish pulled from the sea<br> and cast upon the shore,<br> this mind flounders about,<br> trying to throw off Māra’s dominion.\"", r:"Dhammapada 34",},
 {t:"\"Hard to hold back, flighty,<br> alighting where it will;<br> it’s good to tame the mind;<br> a tamed mind leads to bliss.\"", r:"Dhammapada 35",},
 {t:"\"So hard to see, so subtle,<br> alighting where it will;<br> the discerning protect the mind,<br> a guarded mind leads to bliss.\"", r:"Dhammapada 36",},
 {t:"\"The mind travels far, wandering alone;<br> incorporeal, it lies hidden in the heart.<br> Those who will restrain the mind<br> are freed from Māra’s bonds.\"", r:"Dhammapada 37",},
 {t:"\"Those of unsteady mind,<br> who don’t understand the true teaching,<br> and whose confidence wavers,<br> do not perfect their wisdom.\"", r:"Dhammapada 38",},
 {t:"\"One whose mind is not festering,<br> whose heart is undamaged,<br> who’s given up right and wrong,<br> alert, has nothing to fear.\"", r:"Dhammapada 39",},
 {t:"\"Knowing this body breaks like a pot,<br> and fortifying the mind like a citadel,<br> attack Māra with the sword of wisdom,<br> guard your conquest, and never settle.\"", r:"Dhammapada 40",},
 {t:"\"All too soon this body<br> will lie upon the earth,<br> bereft of consciousness,<br> tossed aside like a worthless log.\"", r:"Dhammapada 41",},
 {t:"\"A wrongly directed mind<br> would do you more harm<br> than a hater to the hated,<br> or an enemy to their foe.\"", r:"Dhammapada 42",},
 {t:"\"A rightly directed mind<br> would do you more good<br> than your mother or father<br> or any other relative.\"", r:"Dhammapada 43",},
 {t:"\"Who bestirs this earth,<br> and the Yama realm with its gods?<br> Who sets out the well-taught word of truth,<br> as an expert a flower?\"", r:"Dhammapada 44",},
 {t:"\"A trainee bestirs this earth,<br> and the Yama realm with its gods.<br> A trainee sets out the well-taught word of truth,<br> as an expert a flower.\"", r:"Dhammapada 45",},
 {t:"\"Knowing this body’s like foam,<br> realizing it’s all just a mirage,<br> and cutting off Māra’s blossoming,<br> vanish from the King of Death.\"", r:"Dhammapada 46",},
 {t:"\"As a mighty flood sweeps off a sleeping village,<br> death steals away a man<br> even as he gathers flowers,<br> his mind caught up in them.\"", r:"Dhammapada 47",},
 {t:"\"The terminator gains control of the man<br> who has not had his fill of pleasures,<br> even as he gathers flowers,<br> his mind caught up in them.\"", r:"Dhammapada 48",},
 {t:"\"A bee takes the nectar<br> and moves on, doing no damage<br> to the flower’s beauty and fragrance;<br> and that’s how a sage should walk in the village.\"", r:"Dhammapada 49",},
 {t:"\"Don’t find fault with others,<br> with what they’ve done or left undone.<br> You should only watch yourself,<br> what you’ve done or left undone.\"", r:"Dhammapada 50",},
 {t:"\"Just like a glorious flower<br> that’s colorful but lacks fragrance;<br> eloquent speech is fruitless<br> for one who does not act on it.\"", r:"Dhammapada 51",},
 {t:"\"Just like a glorious flower<br> that’s both colorful and fragrant,<br> eloquent speech is fruitful<br> for one who acts on it.\"", r:"Dhammapada 52",},
 {t:"\"Just as one would create many garlands<br> from a heap of flowers,<br> when a person has come to be born,<br> they should do many skillful things.\"", r:"Dhammapada 53",},
 {t:"\"The fragrance of flowers doesn’t spread upwind,<br> nor sandalwood, pinwheel, or jasmine;<br> but the fragrance of the good spreads upwind;<br> a true person’s virtue spreads in every direction.\"", r:"Dhammapada 54",},
 {t:"\"Among all the fragrances—<br> sandalwood or pinwheel<br> or lotus or jasmine—<br> the fragrance of virtue is supreme.\"", r:"Dhammapada 55",},
 {t:"\"Faint is the fragrance<br> of sandal or pinwheel;<br> but the fragrance of the virtuous<br> floats to the highest gods.\"", r:"Dhammapada 56",},
 {t:"\"For those accomplished in ethics,<br> meditating diligently,<br> freed through the highest knowledge,<br> Māra cannot find their path.\"", r:"Dhammapada 57",},
 {t:"\"From a heap of trash<br> discarded on the highway,<br> a lotus might blossom,<br> fragrant and delightful.\"", r:"Dhammapada 58",},
 {t:"\"So too, among those thought of as trash,<br> a disciple of the perfect Buddha<br> outshines with their wisdom<br> the blind ordinary folk.\"", r:"Dhammapada 59",},
 {t:"\"Long is the night for the wakeful;<br> long is the league for the weary;<br> long transmigrate the fools<br> who don’t understand the true teaching.\"", r:"Dhammapada 60",},
 {t:"\"If while wandering you find no partner<br> equal or better than yourself,<br> then firmly resolve to wander alone—<br> there’s no fellowship with fools.\"", r:"Dhammapada 61",},
 {t:"\"“Sons are mine, wealth is mine”—<br> thus the fool frets.<br> For even your self is not your own,<br> let alone your sons or wealth.\"", r:"Dhammapada 62",},
 {t:"\"The fool who thinks they’re a fool<br> is wise at least to that extent.<br> But the true fool is said to be one<br> who imagines that they are wise.\"", r:"Dhammapada 63",},
 {t:"\"Though a fool attends to the wise<br> even for the rest of their life,<br> they still don’t understand the teaching,<br> like a spoon the taste of the soup.\"", r:"Dhammapada 64",},
 {t:"\"If a clever person attends to the wise<br> even just for an hour or so,<br> they swiftly understand the teaching,<br> like a tongue the taste of the soup.\"", r:"Dhammapada 65",},
 {t:"\"Fools and simpletons behave<br> like their own worst enemies,<br> doing wicked deeds<br> that ripen as bitter fruit.\"", r:"Dhammapada 66",},
 {t:"\"It’s not good to do a deed<br> that plagues you later on,<br> for which you weep and wail,<br> as its effect stays with you.\"", r:"Dhammapada 67",},
 {t:"\"It is good to do a deed<br> that doesn’t plague you later on,<br> that gladdens and cheers,<br> as its effect stays with you.\"", r:"Dhammapada 68",},
 {t:"\"The fool imagines that evil is sweet,<br> so long as it has not yet ripened.<br> But as soon as that evil ripens,<br> they fall into suffering.\"", r:"Dhammapada 69",},
 {t:"\"Month after month a fool may eat<br> food from a grass-blade’s tip;<br> but they’ll never be worth a sixteenth part<br> of one who has appraised the teaching.\"", r:"Dhammapada 70",},
 {t:"\"For a wicked deed that has been done<br> does not curdle quickly like milk.<br> Smoldering, it follows the fool,<br> like a fire smothered over with ash.\"", r:"Dhammapada 71",},
 {t:"\"Whatever fame a fool may get,<br> it only gives rise to harm.<br> Whatever good features they have it ruins,<br> and blows their head into bits.\"", r:"Dhammapada 72",},
 {t:"\"They’d seek the esteem that they lack,<br> and status among the mendicants;<br> authority over monasteries,<br> and honor among other families.\"", r:"Dhammapada 73",},
 {t:"\"“Let both layfolk and renunciants think<br> the work was done by me alone.<br> In anything at all that’s to be done,<br> let them fall under my sway alone.”<br> So thinks the fool,<br> their greed and pride only growing.\"", r:"Dhammapada 74",},
 {t:"\"For the means to profit and the path to quenching<br> are two quite different things.<br> A mendicant disciple of the Buddha,<br> understanding what this really means,<br> would never delight in honors,<br> but rather would foster seclusion.\"", r:"Dhammapada 75",},
 {t:"\"Regard one who sees your faults<br> as a guide to a hidden treasure.<br> Stay close to one so wise and astute<br> who corrects you when you need it.<br> Sticking close to such an impartial person,<br> things get better, not worse.\"", r:"Dhammapada 76",},
 {t:"\"Advise and instruct;<br> curb wickedness:<br> for you shall be loved by the good,<br> and disliked by the bad.\"", r:"Dhammapada 77",},
 {t:"\"Don’t mix with bad friends,<br> nor with the worst of men.<br> Mix with spiritual friends,<br> and with the best of men.\"", r:"Dhammapada 78",},
 {t:"\"Through joy in the teaching you sleep at ease,<br> with clear and confident heart.<br> An astute person always delights in the teaching<br> proclaimed by the Noble One.\"", r:"Dhammapada 79",},
 {t:"\"Irrigators guide water,<br> fletchers straighten arrows,<br> carpenters carve timber,<br> the astute tame themselves.\"", r:"Dhammapada 80",},
 {t:"\"As the wind cannot stir<br> a solid mass of rock,<br> so too blame and praise<br> do not affect the wise.\"", r:"Dhammapada 81",},
 {t:"\"Like a deep lake,<br> clear and unclouded,<br> so clear are the astute<br> when they hear the teachings.\"", r:"Dhammapada 82",},
 {t:"\"True persons give up everything,<br> they don’t cajole for the things they desire.<br> Though touched by sadness or happiness,<br> the astute appear neither depressed nor elated.\"", r:"Dhammapada 83",},
 {t:"\"Never wish for success by unjust means,<br> for your own sake or that of another,<br> desiring children, wealth, or nation;<br> rather, be virtuous, wise, and just.\"", r:"Dhammapada 84",},
 {t:"\"Few are those among humans<br> who cross to the far shore.<br> The rest just run around<br> on the near shore.\"", r:"Dhammapada 85",},
 {t:"\"When the teaching is well explained,<br> those who practice accordingly<br> will cross over<br> Death’s dominion so hard to pass.\"", r:"Dhammapada 86",},
 {t:"\"Rid of dark qualities,<br> an astute person should develop the bright.<br> Leaving home behind<br> for the seclusion so hard to enjoy,\"", r:"Dhammapada 87",},
 {t:"\"try to find satisfaction there,<br> having left behind sensual pleasures.<br> Owning nothing, an astute person<br> would cleanse themselves of mental corruptions.\"", r:"Dhammapada 88",},
 {t:"\"Those whose minds are rightly developed<br> in the awakening factors;<br> who, letting go of attachments,<br> delight in not grasping:<br> with defilements ended, brilliant,<br> they are quenched in this world.\"", r:"Dhammapada 89",},
 {t:"\"At journey’s end, rid of sorrow;<br> everywhere free,<br> all ties given up,<br> no fever is found in them.\"", r:"Dhammapada 90",},
 {t:"\"The mindful apply themselves;<br> they delight in no abode.<br> Like a swan gone from the marsh,<br> they leave home after home behind.\"", r:"Dhammapada 91",},
 {t:"\"Those with nothing stored up,<br> who have understood their food,<br> whose domain is the liberation<br> of the signless and the empty:<br> their path is hard to trace,<br> like birds in the sky.\"", r:"Dhammapada 92",},
 {t:"\"One whose defilements have ended;<br> who’s not attached to food;<br> whose domain is the liberation<br> of the signless and the empty:<br> their track is hard to trace,<br> like birds in the sky.\"", r:"Dhammapada 93",},
 {t:"\"Whose faculties have become serene,<br> like horses tamed by a charioteer,<br> who has abandoned conceit and defilements;<br> the unaffected one is envied by even the gods.\"", r:"Dhammapada 94",},
 {t:"\"Undisturbed like the earth,<br> true to their vows, steady as Indra’s pillar,<br> like a lake clear of mud;<br> such a one does not transmigrate.\"", r:"Dhammapada 95",},
 {t:"\"Their mind is peaceful,<br> peaceful are their speech and deeds.<br> Such a one is at peace,<br> rightly freed through enlightenment.\"", r:"Dhammapada 96",},
 {t:"\"Lacking faith, a house-breaker,<br> one who acknowledges nothing,<br> purged of hope, they’ve wasted their chance:<br> that is indeed the supreme person!\"", r:"Dhammapada 97",},
 {t:"\"Whether in village or wilderness,<br> in a valley or the uplands,<br> wherever the perfected ones live<br> is a delightful place.\"", r:"Dhammapada 98",},
 {t:"\"Delightful are the wildernesses<br> where no people delight.<br> Those free of greed will delight there,<br> not those who seek sensual pleasures.\"", r:"Dhammapada 99",},
 {t:"\"Better than a thousand<br> meaningless sayings<br> is a single meaningful saying,<br> hearing which brings you peace.\"", r:"Dhammapada 100",},
 {t:"\"Better than a thousand<br> meaningless verses<br> is a single meaningful verse,<br> hearing which brings you peace.\"", r:"Dhammapada 101",},
 {t:"\"Better than reciting<br> a hundred meaningless verses<br> is a single saying of Dhamma,<br> hearing which brings you peace.\"", r:"Dhammapada 102",},
 {t:"\"The supreme conqueror is<br> not he who conquers a million men in battle,<br> but he who conquers a single man:<br> himself.\"", r:"Dhammapada 103",},
 {t:"\"It is surely better to conquer oneself<br> than all those other folk.<br> When a person has tamed themselves,<br> always living restrained,\"", r:"Dhammapada 104",},
 {t:"\"No god nor angel,<br> nor Māra nor divinity,<br> can undo the victory<br> of such a personage.\"", r:"Dhammapada 105",},
 {t:"\"Rather than a thousandfold sacrifice,<br> every month for a full century,<br> it’s better to honor for a single hour<br> one who has developed themselves.<br> That offering is better<br> than the hundred year sacrifice.\"", r:"Dhammapada 106",},
 {t:"\"Rather than serve the sacred flame<br> in the forest for a hundred years,<br> it’s better to honor for a single hour<br> a personage who has developed themselves.<br> That offering is better<br> than the hundred year sacrifice.\"", r:"Dhammapada 107",},
 {t:"\"Whatever sacrifice or offering in the world<br> a seeker of merit may make for a year,<br> none of it is worth a quarter<br> of bowing to the sincere.\"", r:"Dhammapada 108",},
 {t:"\"For one in the habit of bowing,<br> always honoring the elders,<br> four blessings grow:<br> lifespan, beauty, happiness, and strength.\"", r:"Dhammapada 109",},
 {t:"\"Better to live a single day<br> ethical and absorbed in meditation<br> than to live a hundred years<br> unethical and lacking immersion.\"", r:"Dhammapada 110",},
 {t:"\"Better to live a single day<br> wise and absorbed in meditation<br> than to live a hundred years<br> witless and lacking immersion.\"", r:"Dhammapada 111",},
 {t:"\"Better to live a single day<br> energetic and strong,<br> than to live a hundred years<br> lazy and lacking energy.\"", r:"Dhammapada 112",},
 {t:"\"Better to live a single day<br> seeing rise and fall<br> than to live a hundred years<br> blind to rise and fall.\"", r:"Dhammapada 113",},
 {t:"\"Better to live a single day<br> seeing the state free of death<br> than to live a hundred years<br> blind to the state free of death.\"", r:"Dhammapada 114",},
 {t:"\"Better to live a single day<br> seeing the supreme teaching<br> than to live a hundred years<br> blind to the supreme teaching.\"", r:"Dhammapada 115",},
 {t:"\"Rush to do good,<br> shield your mind from evil;<br> for when you’re slow to do good,<br> your thoughts delight in wickedness.\"", r:"Dhammapada 116",},
 {t:"\"If you do something bad,<br> don’t do it again and again,<br> don’t set your heart on it,<br> for piling up evil is suffering.\"", r:"Dhammapada 117",},
 {t:"\"If you do something good,<br> do it again and again,<br> set your heart on it,<br> for piling up goodness is joyful.\"", r:"Dhammapada 118",},
 {t:"\"Even the wicked see good things,<br> so long as their wickedness has not ripened.<br> But as soon as that wickedness ripens,<br> then the wicked see wicked things.\"", r:"Dhammapada 119",},
 {t:"\"Even the good see wicked things,<br> so long as their goodness has not ripened.<br> But as soon as that goodness ripens,<br> then the good see good things.\"", r:"Dhammapada 120",},
 {t:"\"Think not lightly of evil,<br> that it won’t come back to you.<br> The pot is filled with water<br> falling drop by drop;<br> the fool is filled with wickedness<br> piled up bit by bit.\"", r:"Dhammapada 121",},
 {t:"\"Think not lightly of goodness,<br> that it won’t come back to you.<br> The pot is filled with water<br> falling drop by drop;<br> the attentive one is filled with goodness<br> piled up bit by bit.\"", r:"Dhammapada 122",},
 {t:"\"Avoid wickedness,<br> as a merchant with rich cargo and small escort<br> would avoid a dangerous road,<br> or one who loves life would avoid drinking poison.\"", r:"Dhammapada 123",},
 {t:"\"You can carry poison in your hand<br> if it has no wound,<br> for poison does not infect without a wound;<br> nothing bad happens unless you do bad.\"", r:"Dhammapada 124",},
 {t:"\"Whoever wrongs a man who has done no wrong,<br> a pure man who has not a blemish,<br> the evil backfires on the fool,<br> like fine dust thrown upwind.\"", r:"Dhammapada 125",},
 {t:"\"Some are born in a womb;<br> evil-doers go to hell;<br> the virtuous go to heaven;<br> the undefiled are fully extinguished.\"", r:"Dhammapada 126",},
 {t:"\"Not in midair, nor mid-ocean,<br> nor hiding in a mountain cleft;<br> you’ll find no place on the planet<br> to escape your wicked deeds.\"", r:"Dhammapada 127",},
 {t:"\"Not in midair, nor mid-ocean,<br> nor hiding in a mountain cleft;<br> you’ll find no place on the planet<br> where you won’t be vanquished by death.\"", r:"Dhammapada 128",},
 {t:"\"All tremble at the rod,<br> all fear death.<br> Treating others like oneself,<br> neither kill nor incite to kill.\"", r:"Dhammapada 129",},
 {t:"\"All tremble at the rod,<br> all love life.<br> Treating others like oneself,<br> neither kill nor incite to kill.\"", r:"Dhammapada 130",},
 {t:"\"Creatures love happiness,<br> so if you harm them with a stick<br> in search of your own happiness,<br> after death you won’t find happiness.\"", r:"Dhammapada 131",},
 {t:"\"Creatures love happiness,<br> so if you don’t harm them with a stick<br> in search of your own happiness,<br> after death you will find happiness.\"", r:"Dhammapada 132",},
 {t:"\"Don’t speak harshly,<br> they may speak harshly back.<br> For aggressive speech is painful,<br> and the rod may spring back on you.\"", r:"Dhammapada 133",},
 {t:"\"If you still yourself<br> like a broken gong,<br> you reach extinguishment<br> and know no conflict.\"", r:"Dhammapada 134",},
 {t:"\"As a cowherd drives the cows<br> to pasture with the rod,<br> so too old age and death<br> drive life from living beings.\"", r:"Dhammapada 135",},
 {t:"\"The fool does not understand<br> the evil that they do.<br> But because of those deeds, that simpleton<br> is tormented as if burnt by fire.\"", r:"Dhammapada 136",},
 {t:"\"One who violently attacks<br> the peaceful and the innocent<br> swiftly falls<br> to one of ten bad states:\"", r:"Dhammapada 137",},
  {t:"\"Harsh pain; loss;<br> the breakup of the body;<br> serious illness;<br> mental distress;\"", r:"Dhammapada 138",},
 {t:"\"Hazards from rulers;<br> vicious slander;<br> loss of kin;<br> destruction of wealth;\"", r:"Dhammapada 139",},
{t:"\"Or else their home<br> is consumed by fire.<br> When their body breaks up, that witless person<br> is reborn in hell.\"", r:"Dhammapada 140",},
 {t:"\"Not nudity, nor matted hair, nor mud,<br> nor fasting, nor lying on bare ground,<br> nor wearing dust and dirt, or squatting on the heels,<br> will cleanse a mortal not free of doubt.\"", r:"Dhammapada 141",},
 {t:"\"Dressed up they may be, but if they live well—<br> peaceful, tamed, committed to the spiritual path,<br> having laid aside violence towards all creatures—<br> they are a brahmin, an ascetic, a mendicant.\"", r:"Dhammapada 142",},
 {t:"\"Can a person constrained by conscience<br> be found in the world?<br> Who shies away from blame,<br> like a fine horse from the whip?\"", r:"Dhammapada 143",},
 {t:"\"Like a fine horse under the whip,<br> be keen and full of urgency.<br> With faith, ethics, and energy,<br> immersion, and investigation of principles,<br> accomplished in knowledge and conduct, mindful,<br> give up this vast suffering.\"", r:"Dhammapada 144",},
 {t:"\"While irrigators guide water,<br> fletchers shape arrows,<br> and carpenters carve timber—<br> those true to their vows tame themselves.\"", r:"Dhammapada 145",},
 {t:"\"What is joy, what is laughter,<br> when the flames are ever burning?<br> Shrouded by darkness,<br> would you not seek a light?\"", r:"Dhammapada 146",},
 {t:"\"See this fancy puppet,<br> a body built of sores,<br> diseased, obsessed over,<br> in which nothing lasts at all.\"", r:"Dhammapada 147",},
 {t:"\"This body is decrepit and frail,<br> a nest of disease.<br> This foul carcass falls apart,<br> for life ends in death.\"", r:"Dhammapada 148",},
 {t:"\"These dove-grey bones<br> are tossed away like<br> dried gourds in the autumn—<br> what joy is there in such a sight?\"", r:"Dhammapada 149",},
 {t:"\"In this city built of bones,<br> plastered with flesh and blood,<br> old age and death are stashed away,<br> along with conceit and contempt.\"", r:"Dhammapada 150",},
 {t:"\"Fancy chariots of kings wear out,<br> and even this body gets old.<br> But the truth of the good never gets old—<br> so the good proclaim to the good.\"", r:"Dhammapada 151",},
 {t:"\"A person of little learning<br> ages like an ox—<br> their flesh grows,<br> but not their wisdom.\"", r:"Dhammapada 152",},
 {t:"\"Transmigrating through countless rebirths,<br> I’ve journeyed without reward,<br> searching for the house-builder;<br> painful is birth again and again.\"", r:"Dhammapada 153",},
 {t:"\"I’ve seen you, house-builder!<br> You won’t build a house again!<br> Your rafters are all broken,<br> your roof-peak is demolished.<br> My mind, set on demolition,<br> has reached the end of craving.\"", r:"Dhammapada 154",},
 {t:"\"When young they spurned the spiritual path<br> and failed to earn any wealth.<br> Now they brood like old cranes<br> in a pond bereft of fish.\"", r:"Dhammapada 155",},
 {t:"\"When young they spurned the spiritual path<br> and failed to earn any wealth.<br> Now they lie like spent arrows,<br> bemoaning over things past.\"", r:"Dhammapada 156",},
 {t:"\"If you knew your self as beloved,<br> you’d look after it so well.<br> In one of the night’s three watches,<br> an astute person would remain alert.\"", r:"Dhammapada 157",},
 {t:"\"The astute would avoid being corrupted<br> by first grounding themselves<br> in what is suitable,<br> and then instructing others.\"", r:"Dhammapada 158",},
 {t:"\"If one were to treat oneself<br> as one instructs another,<br> the well-tamed indeed would tame:<br> for the self, it seems, is hard to tame.\"", r:"Dhammapada 159",},
 {t:"\"One is indeed the lord of oneself,<br> for who else would be one’s lord?<br> By means of a well-tamed self,<br> one gains a lord that’s rare indeed.\"", r:"Dhammapada 160",},
 {t:"\"For the evil that is done by oneself,<br> born and produced in oneself,<br> grinds down a simpleton,<br> as diamond grinds a lesser gem.\"", r:"Dhammapada 161",},
 {t:"\"One choked by immorality,<br> as a sal tree by a creeper,<br> does to themselves<br> what a foe only wishes.\"", r:"Dhammapada 162",},
 {t:"\"It’s easy to do bad things<br> harmful to oneself,<br> but good things that are helpful<br> are the hardest things to do.\"", r:"Dhammapada 163",},
 {t:"\"On account of wicked views—<br> scorning the guidance<br> of the perfected ones,<br> the noble ones living righteously—<br> the idiot begets their own self’s demise,<br> like the bamboo bearing fruit.\"", r:"Dhammapada 164",},
 {t:"\"For it is by oneself that evil’s done,<br> one is corrupted by oneself.<br> It’s by oneself that evil’s not done,<br> one is purified by oneself.<br> Purity and impurity are personal matters,<br> no one can purify another.\"", r:"Dhammapada 165",},
 {t:"\"Never neglect what is good for yourself<br> for the sake of another, however great.<br> Knowing well what is good for yourself,<br> be intent upon your heart’s goal.\"", r:"Dhammapada 166",},
 {t:"\"Don’t resort to lowly things,<br> don’t abide in negligence,<br> don’t resort to wrong views,<br> don’t perpetuate the world.\"", r:"Dhammapada 167",},
 {t:"\"Get up, don’t be heedless,<br> live by principle, with good conduct.<br> For one of good conduct sleeps at ease,<br> in this world and the next.\"", r:"Dhammapada 168",},
 {t:"\"Live by principle, with good conduct,<br> don’t conduct yourself badly.<br> For one of good conduct sleeps at ease,<br> in this world and the next.\"", r:"Dhammapada 169",},
 {t:"\"Look upon the world<br> as a bubble<br> or a mirage,<br> then the King of Death won’t see you.\"", r:"Dhammapada 170",},
 {t:"\"Come, see this world decked out<br> like a fancy royal chariot.<br> Here fools founder,<br> but the discerning are not chained.\"", r:"Dhammapada 171",},
 {t:"\"He who once was heedless,<br> but turned to heedfulness,<br> lights up the world<br> like the moon freed from clouds.\"", r:"Dhammapada 172",},
 {t:"\"Someone whose bad deed<br> is supplanted by the good,<br> lights up the world,<br> like the moon freed from clouds.\"", r:"Dhammapada 173",},
 {t:"\"Blind is the world,<br> few are those who clearly see.<br> Only a handful go to heaven,<br> like a bird freed from a net.\"", r:"Dhammapada 174",},
 {t:"\"Swans fly by the sun’s path,<br> psychic sages fly through space.<br> The attentive leave the world,<br> having vanquished Māra with his legions.\"", r:"Dhammapada 175",},
 {t:"\"When a personage, spurning the hereafter,<br> transgresses in just one thing—<br> lying—<br> there is no evil they would not do.\"", r:"Dhammapada 176",},
 {t:"\"The miserly don’t ascend to heaven,<br> it takes a fool to not praise giving.<br> The attentive celebrate giving,<br> and so find happiness in the hereafter.\"", r:"Dhammapada 177",},
 {t:"\"The fruit of stream-entry is better<br> than being the one king of the earth,<br> than going to heaven,<br> than lordship over all the world.\"", r:"Dhammapada 178",},
 {t:"\"He whose victory may not be undone,<br> a victory unrivaled in all the world;<br> by what track would you trace that Buddha,<br> who leaves no track in his infinite range?\"", r:"Dhammapada 179",},
 {t:"\"Of craving, the weaver, the clinger, he has none:<br> so where can he be traced?<br> By what track would you trace that Buddha,<br> who leaves no track in his infinite range?\"", r:"Dhammapada 180",},
 {t:"\"The attentive intent on absorption,<br> who love the peace of renunciation,<br> the Buddhas, ever mindful,<br> are envied by even the gods.\"", r:"Dhammapada 181",},
 {t:"\"It’s hard to gain a human birth;<br> the life of mortals is hard;<br> it’s hard to hear the true teaching;<br> the arising of Buddhas is hard.\"", r:"Dhammapada 182",},
 {t:"\"Not to do any evil;<br> to embrace the good;<br> to purify one’s mind:<br> this is the instruction of the Buddhas.\"", r:"Dhammapada 183",},
 {t:"\"Patient acceptance is the ultimate fervor.<br> Extinguishment is the ultimate, say the Buddhas.<br> No true renunciate injures another,<br> nor does an ascetic hurt another.\"", r:"Dhammapada 184",},
 {t:"\"Not speaking ill nor doing harm;<br> restraint in the monastic code;<br> moderation in eating;<br> staying in remote lodgings;<br> commitment to the higher mind—<br> this is the instruction of the Buddhas.\"", r:"Dhammapada 185",},
 {t:"\"Even if it were raining money,<br> you’d not be sated in sensual pleasures.<br> An astute person understands that sensual pleasures<br> offer little gratification and much suffering.\"", r:"Dhammapada 186",},
 {t:"\"Thus they find no delight<br> even in celestial pleasures.<br> A disciple of the fully awakened Buddha<br> delights in the ending of craving.\"", r:"Dhammapada 187",},
 {t:"\"So many go for refuge<br> to mountains and forest groves,<br> to shrines in tended parks;<br> those people are driven by fear.\"", r:"Dhammapada 188",},
 {t:"\"But such refuge is no sanctuary,<br> it is no supreme refuge.<br> By going to that refuge,<br> you’re not released from all suffering.\"", r:"Dhammapada 189",},
 {t:"\"One gone for refuge to the Buddha,<br> to his teaching and to the Saṅgha,<br> sees the four noble truths<br> with right understanding:\"", r:"Dhammapada 190",},
 {t:"\"Suffering, suffering’s origin,<br> suffering’s transcendence,<br> and the noble eightfold path<br> that leads to the stilling of suffering.\"", r:"Dhammapada 191",},
 {t:"\"Such refuge is a sanctuary,<br> it is the supreme refuge.<br> By going to that refuge,<br> you’re released from all suffering.\"", r:"Dhammapada 192",},
 {t:"\"It’s hard to find a thoroughbred man:<br> they’re not born just anywhere.<br> A family where that attentive one is born<br> prospers in happiness.\"", r:"Dhammapada 193",},
 {t:"\"Happy, the arising of Buddhas!<br> Happy, the teaching of Dhamma!<br> Happy is the harmony of the Saṅgha,<br> and the striving of the harmonious is happy.\"", r:"Dhammapada 194",},
 {t:"\"When a person venerates the worthy—<br> the Buddha or his disciple,<br> who have transcended proliferation,<br> and have left behind grief and lamentation,\"", r:"Dhammapada 195",},
 {t:"\"Fearing nothing from any quarter—<br> the merit of one venerating such as these,<br> cannot be calculated by anyone,<br> saying it is just this much.\"", r:"Dhammapada 196",},
 {t:"\"Let us live so very happily,<br> loving among the hostile.<br> Among hostile humans,<br> let us live with love.\"", r:"Dhammapada 197",},
 {t:"\"Let us live so very happily,<br> healthy among the ailing.<br> Among ailing humans<br> let us live healthily.\"", r:"Dhammapada 198",},
 {t:"\"Let us live so very happily,<br> content among the greedy.<br> Among greedy humans,<br> let us live content.\"", r:"Dhammapada 199",},
 {t:"\"Let us live so very happily,<br> we who have nothing.<br> We shall feed on rapture,<br> like the gods of streaming radiance.\"", r:"Dhammapada 200",},
 {t:"\"Victory breeds enmity;<br> the defeated sleep badly.<br> The peaceful sleep at ease,<br> having left victory and defeat behind.\"", r:"Dhammapada 201",},
 {t:"\"There is no fire like greed,<br> no crime like hate,<br> no suffering like the aggregates,<br> no bliss beyond peace.\"", r:"Dhammapada 202",},
 {t:"\"Hunger is the worst illness,<br> conditions are the worst suffering.<br> For one who truly knows this,<br> extinguishment is the ultimate happiness.\"", r:"Dhammapada 203",},
 {t:"\"Health is the ultimate blessing;<br> contentment, the ultimate wealth;<br> trust is the ultimate family;<br> extinguishment, the ultimate happiness.\"", r:"Dhammapada 204",},
 {t:"\"Having drunk the nectar of seclusion<br> and the nectar of peace—<br> free of stress, free of evil,<br> drink the joyous nectar of truth.\"", r:"Dhammapada 205",},
 {t:"\"It’s good to see the noble ones,<br> staying with them is always good.<br> Were you not to see fools,<br> you’d always be happy.\"", r:"Dhammapada 206",},
 {t:"\"For one who consorts with fools<br> grieves long.<br> Painful is living with fools,<br> like being stuck with your enemy.<br> Happy is living with an attentive one,<br> like meeting with your kin.\"", r:"Dhammapada 207",},
 {t:"\"Therefore:<br> An attentive one, wise and learned,<br> a behemoth of virtue, true to their vows, noble:<br> follow a true and intelligent person such as this,<br> as the moon tracks the path of the stars.\"", r:"Dhammapada 208",},
 {t:"\"Applying yourself where you ought not,<br> neglecting what you should be doing,<br> forgetting your goal, you cling to what you hold dear,<br> jealous of those devoted to their heart’s goal.\"", r:"Dhammapada 209",},
 {t:"\"Don’t ever get too close<br> to those you like or dislike.<br> For not seeing the liked is suffering,<br> and so is seeing the disliked.\"", r:"Dhammapada 210",},
 {t:"\"Therefore don’t hold anything dear,<br> for it’s bad to lose those you love.<br> No ties are found in they who<br> hold nothing loved or loathed.\"", r:"Dhammapada 211",},
 {t:"\"Sorrow springs from what we hold dear,<br> fear springs from what we hold dear;<br> one free from holding anything dear<br> has no sorrow, let alone fear.\"", r:"Dhammapada 212",},
 {t:"\"Sorrow springs from attachment,<br> fear springs from attachment;<br> one free from attachment<br> has no sorrow, let alone fear.\"", r:"Dhammapada 213",},
 {t:"\"Sorrow springs from relishing,<br> fear springs from relishing;<br> one free from relishing<br> has no sorrow, let alone fear.\"", r:"Dhammapada 214",},
 {t:"\"Sorrow springs from desire,<br> fear springs from desire;<br> one free from desire<br> has no sorrow, let alone fear.\"", r:"Dhammapada 215",},
 {t:"\"Sorrow springs from craving,<br> fear springs from craving;<br> one free from craving<br> has no sorrow, let alone fear.\"", r:"Dhammapada 216",},
 {t:"\"One accomplished in virtue and vision,<br> firmly principled, and truthful,<br> doing oneself what ought be done:<br> that’s who the people love.\"", r:"Dhammapada 217",},
 {t:"\"One eager to realize the ineffable<br> would be filled with awareness.<br> Their mind not bound to pleasures of sense,<br> they’re said to be heading upstream.\"", r:"Dhammapada 218",},
 {t:"\"When a man returns safely<br> after a long time spent abroad,<br> family, friends, and loved ones<br> celebrate his return.\"", r:"Dhammapada 219",},
 {t:"\"Just so, when one who has done good<br> goes from this world to the next,<br> their good deeds receive them there,<br> as family welcomes home one they love.\"", r:"Dhammapada 220",},
 {t:"\"Give up anger, get rid of conceit,<br> and escape every fetter.<br> Sufferings don’t befall one who has nothing,<br> not clinging to name and form.\"", r:"Dhammapada 221",},
 {t:"\"When anger surges like a lurching chariot,<br> keep it in check.<br> That’s what I call a charioteer;<br> others just hold the reins.\"", r:"Dhammapada 222",},
 {t:"\"Defeat anger with kindness,<br> villainy with virtue,<br> stinginess with giving,<br> and lies with truth.\"", r:"Dhammapada 223",},
 {t:"\"Speak the truth, do not be angry,<br> and give when asked, if only a little.<br> By these three means,<br> you may enter the presence of the gods.\"", r:"Dhammapada 224",},
 {t:"\"Those harmless sages,<br> always restrained in body,<br> go to the state that does not pass,<br> where there is no sorrow.\"", r:"Dhammapada 225",},
 {t:"\"Always wakeful,<br> practicing night and day,<br> focused only on extinguishment,<br> their defilements come to an end.\"", r:"Dhammapada 226",},
 {t:"\"It’s always been this way, Atula,<br> it’s not just today.<br> They blame you when you’re silent,<br> they blame you when you speak a lot,<br> and even when you speak just right:<br> no-one in the world escapes blame.\"", r:"Dhammapada 227",},
 {t:"\"There never was, nor will be,<br> nor is there today,<br> someone who is wholly praised<br> or wholly blamed.\"", r:"Dhammapada 228",},
 {t:"\"If, after watching them day in day out,<br> discerning people praise<br> that sage of impeccable conduct,<br> endowed with ethics and wisdom;\"", r:"Dhammapada 229",},
 {t:"\"like a pendant of Black Plum River gold,<br> who is worthy to criticize them?<br> Even the gods praise them,<br> and by the Divinity, too, they’re praised.\"", r:"Dhammapada 230",},
 {t:"\"Guard against ill-tempered deeds,<br> be restrained in body.<br> Giving up bad bodily conduct,<br> conduct yourself well in body.\"", r:"Dhammapada 231",},
 {t:"\"Guard against ill-tempered words,<br> be restrained in speech.<br> Giving up bad verbal conduct,<br> conduct yourself well in speech.\"", r:"Dhammapada 232",},
 {t:"\"Guard against ill-tempered thoughts,<br> be restrained in mind.<br> Giving up bad mental conduct,<br> conduct yourself well in mind.\"", r:"Dhammapada 233",},
 {t:"\"An attentive one is restrained in body<br> restrained also in speech,<br> in thought, too, they are restrained:<br> they are restrained in every way.\"", r:"Dhammapada 234",},
 {t:"\"Today you’re like a withered leaf,<br> Yama’s men await you.<br> You stand at the departure gates,<br> yet you have no supplies for the road.\"", r:"Dhammapada 235",},
 {t:"\"Make an island of yourself!<br> Swiftly strive, learn to be wise!<br> Purged of stains, flawless,<br> you’ll go to the heavenly realm of the noble ones.\"", r:"Dhammapada 236",},
 {t:"\"You’ve journeyed the stages of life,<br> and now you set out to meet Yama.<br> Along the way there’s nowhere to stay,<br> yet you have no supplies for the road.\"", r:"Dhammapada 237",},
 {t:"\"Make an island of yourself!<br> Swiftly strive, learn to be wise!<br> Purged of stains, flawless,<br> you’ll not come again to rebirth and old age.\"", r:"Dhammapada 238",},
 {t:"\"A smart person would purge<br> their own stains gradually,<br> bit by bit, moment by moment,<br> like a smith smelting silver.\"", r:"Dhammapada 239",},
 {t:"\"It is the rust born on the iron<br> that eats away the place it arose.<br> And so it is their own deeds<br> that lead the overly-ascetic to a bad place.\"", r:"Dhammapada 240",},
 {t:"\"Not rehearsing is the stain of hymns.<br> The stain of houses is neglect.<br> Laziness is the stain of beauty.<br> A guard’s stain is negligence.\"", r:"Dhammapada 241",},
 {t:"\"Misconduct is a woman’s stain.<br> A giver’s stain is stinginess.<br> Bad qualities are a stain<br> in this world and the next.\"", r:"Dhammapada 242",},
 {t:"\"But a worse stain than these<br> is ignorance, the worst stain of all.<br> Having given up that stain,<br> be without stains, mendicants!\"", r:"Dhammapada 243",},
 {t:"\"Life is easy for the shameless.<br> With all the rude courage of a crow,<br> they live pushy,<br> rude, and corrupt.\"", r:"Dhammapada 244",},
 {t:"\"Life is hard for the conscientious,<br> always seeking purity,<br> neither clinging nor rude,<br> pure of livelihood and discerning.\"", r:"Dhammapada 245",},
 {t:"\"Take anyone in this world<br> who kills living creatures,<br> speaks falsely, steals,<br> commits adultery,\"", r:"Dhammapada 246",},
 {t:"\"and indulges in drinking<br> beer and wine.<br> Right here they dig up<br> the root of their own self.\"", r:"Dhammapada 247",},
 {t:"\"Know this, good fellow:<br> they are unrestrained and wicked.<br> Don’t let that greed and unrighteousness<br> inflict pain on you for long.\"", r:"Dhammapada 248",},
 {t:"\"The people give according to their faith,<br> according to their confidence.<br> If you get upset over that,<br> over other’s food and drink,<br> you’ll not, by day or by night,<br> become immersed in samādhi.\"", r:"Dhammapada 249",},
 {t:"\"Those who have cut that out,<br> dug it up at the root, eradicated it,<br> they will, by day or by night,<br> become immersed in samādhi.\"", r:"Dhammapada 250",},
 {t:"\"There is no fire like greed,<br> no crime like hate,<br> no net like delusion,<br> no river like craving.\"", r:"Dhammapada 251",},
 {t:"\"It’s easy to see the faults of others,<br> hard to see one’s own.<br> For the faults of others<br> are tossed high like hay,<br> while one’s own are hidden,<br> as a cheat hides a bad hand.\"", r:"Dhammapada 252",},
 {t:"\"When you look for the flaws of others,<br> always finding fault,<br> your defilements only grow,<br> you’re far from ending defilements.\"", r:"Dhammapada 253",},
 {t:"\"In the atmosphere there is no track,<br> there’s no true ascetic outside here.<br> People enjoy proliferation,<br> the Realized Ones are free of proliferation.\"", r:"Dhammapada 254",},
 {t:"\"In the atmosphere there is no track,<br> there’s no true ascetic outside here.<br> No conditions last forever,<br> the Awakened Ones are not shaken.\"", r:"Dhammapada 255",},
 {t:"\"You don’t become just<br> by passing hasty judgment.<br> An astute person evaluates both<br> what is pertinent and what is irrelevant.\"", r:"Dhammapada 256",},
 {t:"\"A wise one judges others without haste,<br> justly and impartially;<br> that guardian of the law<br> is said to be just.\"", r:"Dhammapada 257",},
 {t:"\"You’re not an astute scholar<br> just because you speak a lot.<br> One who is secure, free of enmity and fear,<br> is said to be astute.\"", r:"Dhammapada 258",},
 {t:"\"You’re not one who has memorized the teaching<br> just because you recite a lot.<br> Someone who directly sees the teaching<br> after hearing only a little<br> is truly one who has memorized the teaching,<br> for they can never forget it.\"", r:"Dhammapada 259",},
 {t:"\"You don’t become a senior<br> by getting some grey hairs;<br> for one ripe only in age,<br> is said to have aged in vain.\"", r:"Dhammapada 260",},
 {t:"\"One who is truthful and principled,<br> harmless, restrained, and self-controlled,<br> attentive, purged of stains,<br> is said to be a senior.\"", r:"Dhammapada 261",},
 {t:"\"Not by mere enunciation,<br> or a beautiful complexion<br> does a person become holy,<br> if they’re jealous, stingy, and devious.\"", r:"Dhammapada 262",},
 {t:"\"But if they’ve cut that out,<br> dug it up at the root, eradicated it,<br> that wise one, purged of vice,<br> is said to be holy.\"", r:"Dhammapada 263",},
 {t:"\"A liar and breaker of vows is no ascetic<br> just because they shave their head.<br> How on earth can one be an ascetic<br> who’s full of desire and greed?\"", r:"Dhammapada 264",},
 {t:"\"One who stops all wicked deeds,<br> great and small,<br> because of stopping wicked deeds<br> is said to be an ascetic.\"", r:"Dhammapada 265",},
 {t:"\"You don’t become a mendicant<br> just by begging from others.<br> One who has undertaken domestic duties<br> has not yet become a mendicant.\"", r:"Dhammapada 266",},
 {t:"\"But one living a spiritual life,<br> who has banished both merit and evil,<br> who wanders having appraised the world,<br> is said to be a mendicant.\"", r:"Dhammapada 267",},
 {t:"\"You don’t become a sage by being sagelike,<br> while still confused and ignorant.<br> The astute one who holds the scales,<br> taking only the best,\"", r:"Dhammapada 268",},
 {t:"\"And shunning the bad—<br> that is a sage,<br> and that is how one becomes a sage.<br> One who sagely weighs both in the world,<br> is thereby said to be a sage.\"", r:"Dhammapada 269",},
 {t:"\"You don’t become a noble one<br> by harming living beings.<br> One harmless towards all living beings<br> is said to be a noble one.\"", r:"Dhammapada 270",},
 {t:"\"Not by precepts and observances,<br> nor by much learning,<br> nor by meditative immersion,<br> nor by living in seclusion,\"", r:"Dhammapada 271",},
 {t:"\"Do I experience the bliss of renunciation<br> not frequented by ordinary people.<br> A mendicant cannot rest confident<br> without attaining the end of defilements.\"", r:"Dhammapada 272",},
 {t:"\"Of paths, the eightfold is the best;<br> of truths, the four statements;<br> dispassion is the best of things,<br> and the Clear-eyed One is the best of humans.\"", r:"Dhammapada 273",},
 {t:"\"This is the path, there is no other<br> for the purification of vision.<br> You all must practice this,<br> it is the way to baffle Māra.\"", r:"Dhammapada 274",},
 {t:"\"When you all are practicing this,<br> you will make an end of suffering.<br> I have explained the path to you<br> for extracting the thorn with wisdom.\"", r:"Dhammapada 275",},
 {t:"\"You yourselves must do the work,<br> the Realized Ones just show the way.<br> Meditators practicing absorption<br> are released from Māra’s bonds.\"", r:"Dhammapada 276",},
 {t:"\"All conditions are impermanent—<br> when this is seen with wisdom,<br> one grows disillusioned with suffering:<br> this is the path to purity.\"", r:"Dhammapada 277",},
 {t:"\"All conditions are suffering—<br> when this is seen with wisdom,<br> one grows disillusioned with suffering:<br> this is the path to purity.\"", r:"Dhammapada 278",},
 {t:"\"All things are not-self—<br> when this is seen with wisdom,<br> one grows disillusioned with suffering:<br> this is the path to purity.\"", r:"Dhammapada 279",},
 {t:"\"They don’t get going when it’s time to start;<br> they’re young and strong, but given to sloth.<br> Their mind depressed in sunken thought,<br> lazy and slothful, they can’t discern the path.\"", r:"Dhammapada 280",},
 {t:"\"Guarded in speech, restrained in mind,<br> doing no unskillful bodily deed.<br> Purify these three ways of performing deeds,<br> and win the path known to seers.\"", r:"Dhammapada 281",},
 {t:"\"From meditation springs wisdom,<br> without meditation, wisdom ends.<br> Knowing these two paths—<br> of progress and decline—<br> you should conduct yourself<br> so that wisdom grows.\"", r:"Dhammapada 282",},
 {t:"\"Cut down the jungle, not just a tree;<br> from the jungle springs fear.<br> Having cut down jungle and snarl,<br> be free of jungles, mendicants!\"", r:"Dhammapada 283",},
 {t:"\"So long as the vine, no matter how small,<br> that ties a man to women is not cut,<br> his mind remains trapped,<br> like a calf suckling its mother.\"", r:"Dhammapada 284",},
 {t:"\"Cut out affection for oneself,<br> like plucking an autumn lotus.<br> Foster only the path to peace,<br> the extinguishment the Holy One taught.\"", r:"Dhammapada 285",},
 {t:"\"“Here I will stay for the rains;<br> here for winter, here the summer”;<br> thus the fool thinks,<br> not realizing the danger.\"", r:"Dhammapada 286",},
 {t:"\"As a mighty flood sweeps away a sleeping village,<br> death steals away a man<br> who dotes on children and cattle,<br> his mind caught up in them.\"", r:"Dhammapada 287",},
 {t:"\"Children provide you no shelter,<br> nor does father, nor relatives.<br> When you’re seized by the terminator,<br> there’s no shelter in family.\"", r:"Dhammapada 288",},
 {t:"\"Knowing the reason for this,<br> astute, and ethically restrained,<br> one would quickly clear the path<br> that leads to extinguishment.\"", r:"Dhammapada 289",},
 {t:"\"If by giving up material happiness<br> one sees abundant happiness,<br> the attentive would give up material happiness,<br> seeing the abundant happiness.\"", r:"Dhammapada 290",},
 {t:"\"Seeking their own happiness<br> by imposing suffering on others,<br> living intimate with enmity,<br> they’re not freed from enmity.\"", r:"Dhammapada 291",},
 {t:"\"They dump what should be done,<br> and do what should not be done.<br> For the insolent and the negligent,<br> their defilements only grow.\"", r:"Dhammapada 292",},
 {t:"\"Those that have properly undertaken<br> constant mindfulness of the body,<br> don’t cultivate what should not be done,<br> but always do what should be done.<br> Mindful and aware,<br> their defilements come to an end.\"", r:"Dhammapada 293",},
 {t:"\"Having slain mother and father,<br> and two aristocratic kings,<br> and having wiped out<br> the kingdom with its tax collector,<br> the brahmin walks on untroubled.\"", r:"Dhammapada 294",},
 {t:"\"Having slain mother and father,<br> and two prosperous kings,<br> and a tiger as the fifth,<br> the brahmin walks on untroubled.\"", r:"Dhammapada 295",},
 {t:"\"The disciples of Gotama<br> always wake up refreshed,<br> who day and night<br> constantly recollect the Buddha.\"", r:"Dhammapada 296",},
 {t:"\"The disciples of Gotama<br> always wake up refreshed,<br> who day and night<br> constantly recollect the teaching.\"", r:"Dhammapada 297",},
 {t:"\"The disciples of Gotama<br> always wake up refreshed,<br> who day and night<br> constantly recollect the Saṅgha.\"", r:"Dhammapada 298",},
 {t:"\"The disciples of Gotama<br> always wake up refreshed,<br> who day and night<br> are constantly mindful of the body.\"", r:"Dhammapada 299",},
 {t:"\"The disciples of Gotama<br> always wake up refreshed,<br> whose minds day and night<br> delight in harmlessness.\"", r:"Dhammapada 300",},
 {t:"\"The disciples of Gotama<br> always wake up refreshed,<br> whose minds day and night<br> delight in meditation.\"", r:"Dhammapada 301",},
 {t:"\"Going forth is hard, it’s hard to be happy;<br> life at home is hard too, and painful,<br> it’s painful to stay when you’ve nothing in common.<br> A traveler is a prey to pain,<br> so don’t be a traveler,<br> don’t be prey to pain.\"", r:"Dhammapada 302",},
 {t:"\"One who is faithful, accomplished in ethics,<br> blessed with fame and wealth,<br> is honored in whatever place<br> they frequent.\"", r:"Dhammapada 303",},
 {t:"\"The good shine from afar,<br> like the Himalayan peaks,<br> but the wicked are not seen,<br> like arrows scattered in the night.\"", r:"Dhammapada 304",},
 {t:"\"Sitting alone, sleeping alone,<br> tirelessly wandering alone;<br> one who tames themselves alone<br> would delight within a forest.\"", r:"Dhammapada 305",},
 {t:"\"A liar goes to hell,<br> as does one who denies what they did.<br> Both are equal in the hereafter,<br> those men of base deeds.\"", r:"Dhammapada 306",},
 {t:"\"Many who wear a scrap of ocher cloth<br> are unrestrained and wicked.<br> Being wicked, they are reborn in hell<br> due to their bad deeds.\"", r:"Dhammapada 307",},
 {t:"\"It’d be better for the immoral and unrestrained<br> to eat an iron ball,<br> scorching, like a burning flame,<br> than to eat the nation’s alms.\"", r:"Dhammapada 308",},
 {t:"\"Four things befall a heedless man<br> who sleeps with another’s wife:<br> wickedness, poor sleep,<br> ill-repute, and rebirth in hell.\"", r:"Dhammapada 309",},
 {t:"\"He accrues wickedness and is reborn in a bad place,<br> all so a frightened couple<br> may snatch a moment’s pleasure,<br> for which rulers impose a heavy punishment.<br> That’s why a man should not<br> sleep with another’s wife.\"", r:"Dhammapada 310",},
 {t:"\"When kusa grass is wrongly grasped<br> it only cuts the hand.<br> So too, the ascetic life, when wrongly taken,<br> drags you to hell.\"", r:"Dhammapada 311",},
 {t:"\"Any lax act,<br> any corrupt observance,<br> or suspicious spiritual life,<br> is not very fruitful.\"", r:"Dhammapada 312",},
 {t:"\"If one is to do what should be done,<br> one should staunchly strive.<br> For the life gone forth when laxly led<br> just stirs up dust all the more.\"", r:"Dhammapada 313",},
 {t:"\"A bad deed is better left undone,<br> for it will plague you later on.<br> A good deed is better done,<br> one that does not plague you.\"", r:"Dhammapada 314",},
 {t:"\"As a frontier city<br> is guarded inside and out,<br> so you should ward yourselves—<br> don’t let the moment pass you by.<br> For if you miss your moment<br> you’ll grieve when sent to hell.\"", r:"Dhammapada 315",},
 {t:"\"Unashamed of what is shameful,<br> ashamed of what is not shameful;<br> beings who uphold wrong view<br> go to a bad place.\"", r:"Dhammapada 316",},
 {t:"\"Seeing danger where there is none,<br> and blind to the actual danger,<br> beings who uphold wrong view<br> go to a bad place.\"", r:"Dhammapada 317",},
 {t:"\"Seeing fault where there is none,<br> and blind to the actual fault,<br> beings who uphold wrong view<br> go to a bad place.\"", r:"Dhammapada 318",},
 {t:"\"Knowing a fault as a fault<br> and the faultless as faultless,<br> beings who uphold right view<br> go to a good place.\"", r:"Dhammapada 319",},
 {t:"\"Like an elephant struck<br> with arrows in battle,<br> I shall withstand abuse,<br> for so many folk are badly behaved.\"", r:"Dhammapada 320",},
 {t:"\"The well-tamed beast is the one led to the crowd;<br> the tamed elephant’s the one the king mounts;<br> the tamed person who withstands abuse<br> is the best of human beings.\"", r:"Dhammapada 321",},
 {t:"\"Those who have tamed themselves are better<br> than fine tamed mules,<br> thoroughbreds from Sindh,<br> or giant tuskers.\"", r:"Dhammapada 322",},
 {t:"\"For not on those mounts<br> would you go to the untrodden place,<br> whereas, with the help of one<br> whose self is well tamed,<br> you go there, tamed by the tamed.\"", r:"Dhammapada 323",},
 {t:"\"The tusker named Dhanapāla<br> is musky in rut, hard to control.<br> Bound, he eats not a morsel,<br> for he misses the elephant forest.\"", r:"Dhammapada 324",},
 {t:"\"One who gets drowsy from overeating,<br> fond of sleep, rolling round the bed<br> like a great hog stuffed with grain:<br> that dullard returns to the womb again and again.\"", r:"Dhammapada 325",},
 {t:"\"In the past my mind wandered<br> how it wished, where it liked, as it pleased.<br> Now I’ll carefully guide it,<br> as a trainer with a hook guides a rutting elephant.\"", r:"Dhammapada 326",},
 {t:"\"Delight in diligence!<br> Take good care of your mind!<br> Pull yourself out of this pit,<br> like an elephant sunk in a bog.\"", r:"Dhammapada 327",},
 {t:"\"If you find an alert companion,<br> an attentive friend to live happily together,<br> then, overcoming all adversities,<br> wander with them, joyful and mindful.\"", r:"Dhammapada 328",},
 {t:"\"If you find no alert companion,<br> no attentive friend to live happily together,<br> then, like a king who flees his conquered realm,<br> wander alone like a tusker in the wilds.\"", r:"Dhammapada 329",},
 {t:"\"It’s better to wander alone,<br> there’s no fellowship with fools.<br> Wander alone and do no wrong,<br> at ease like a tusker in the wilds.\"", r:"Dhammapada 330",},
 {t:"\"A friend in need is a blessing;<br> it’s a blessing to be content with whatever;<br> good deeds are a blessing at the end of life,<br> and giving up all suffering is a blessing.\"", r:"Dhammapada 331",},
 {t:"\"In this world it’s a blessing to serve<br> one’s mother and one’s father.<br> And it’s a blessing also to serve<br> ascetics and brahmins.\"", r:"Dhammapada 332",},
 {t:"\"It’s a blessing to keep precepts until you grow old;<br> a blessing to be grounded in faith;<br> the getting of wisdom’s a blessing;<br> and it’s a blessing to avoid doing wrong.\"", r:"Dhammapada 333",},
 {t:"\"When a man lives heedlessly,<br> craving grows in them like a camel’s foot creeper.<br> They jump from one thing to the next, like a langur<br> greedy for fruit in a forest grove.\"", r:"Dhammapada 334",},
 {t:"\"Whoever is beaten by this wretched craving,<br> this attachment to the world,<br> their sorrow grows,<br> like grass in the rain.\"", r:"Dhammapada 335",},
 {t:"\"But whoever prevails over this wretched craving,<br> so hard to get over in the world,<br> their sorrows fall from them,<br> like a drop from a lotus-leaf.\"", r:"Dhammapada 336",},
 {t:"\"I say this to you, good people,<br> all those who have gathered here:<br> dig up the root of craving,<br> as you’d dig up grass in search of roots.<br> Don’t let Māra break you again and again,<br> like a stream breaking a reed.\"", r:"Dhammapada 337",},
 {t:"\"A tree grows back even when cut down,<br> so long as its roots are strong and undamaged;<br> suffering springs up again and again,<br> so long as the tendency to craving is not pulled out.\"", r:"Dhammapada 338",},
 {t:"\"A person of low views<br> in whom the thirty-six streams<br> that flow to pleasure are mighty,<br> is swept away by lustful thoughts.\"", r:"Dhammapada 339",},
 {t:"\"The streams flow everywhere;<br> a weed springs up and remains.<br> Seeing this weed that has been born,<br> cut the root with wisdom.\"", r:"Dhammapada 340",},
 {t:"\"A personage’s joys<br> flow from senses and cravings.<br> Seekers of happiness, bent on pleasure,<br> continue to be reborn and grow old.\"", r:"Dhammapada 341",},
 {t:"\"People governed by thirst,<br> crawl about like a trapped rabbit.<br> Bound and fettered, for a long time<br> they return to pain time and again.\"", r:"Dhammapada 342",},
 {t:"\"People governed by thirst,<br> crawl about like a trapped rabbit.<br> That’s why one who longs for dispassion<br> should dispel thirst.\"", r:"Dhammapada 343",},
 {t:"\"Unsnarled, they set out for the jungle,<br> then they run right back to the jungle they left behind.<br> Just look at this individual!<br> Freed, they run to bondage.\"", r:"Dhammapada 344",},
 {t:"\"The attentive say that shackle is not strong<br> that’s made of iron, wood, or knots.<br> But obsession with jeweled earrings,<br> concern for your partners and children:\"", r:"Dhammapada 345",},
 {t:"\"This, say the attentive, is a strong shackle<br> dragging the indulgent down, hard to escape.<br> Having cut this one too they go forth,<br> unconcerned, having given up sensual pleasures.\"", r:"Dhammapada 346",},
 {t:"\"Besotted by lust they fall into the stream,<br> like a spider caught in the web she wove.<br> The attentive proceed, having cut this one too,<br> unconcerned, having given up all suffering.\"", r:"Dhammapada 347",},
 {t:"\"Let go of the past, let go of the future,<br> let go of the present, having gone beyond rebirth.<br> With your heart freed in every respect,<br> you’ll not come again to rebirth and old age.\"", r:"Dhammapada 348",},
 {t:"\"For a personage churned by thoughts,<br> very lustful, focusing on beauty,<br> their craving grows and grows,<br> tying them with a stout bond.\"", r:"Dhammapada 349",},
 {t:"\"But one who loves to calm their thoughts,<br> developing perception of ugliness, ever mindful,<br> will surely eliminate that craving,<br> cutting off the bonds of Māra.\"", r:"Dhammapada 350",},
 {t:"\"One who is confident, unafraid,<br> rid of craving, free of blemish,<br> having struck down the arrows flying to future lives,<br> this bag of bones is their last.\"", r:"Dhammapada 351",},
 {t:"\"Rid of craving, free of grasping,<br> expert in the definition of terms,<br> knowing the correct<br> structure and sequence of syllables,<br> they are said to be one who bears their final body,<br> one of great wisdom, a great person.\"", r:"Dhammapada 352",},
 {t:"\"I am the champion, the knower of all,<br> unsullied in the midst of all things.<br> I’ve given up all, freed in the ending of craving.<br> Since I know for myself, whose follower should I be?\"", r:"Dhammapada 353",},
 {t:"\"The gift of the teaching surmounts all other gifts;<br> the taste of the teaching surmounts all other tastes;<br> the joy of the teaching surmounts all other joys;<br> the ending of craving surmounts all suffering.\"", r:"Dhammapada 354",},
 {t:"\"Riches ruin a simpleton,<br> but not a seeker of the far shore.<br> From craving for wealth, a simpleton<br> ruins themselves and others.\"", r:"Dhammapada 355",},
 {t:"\"Weeds are the bane of crops,<br> but greed is these folk’s bane.<br> That’s why a gift to one rid of greed<br> is so very fruitful.\"", r:"Dhammapada 356",},
 {t:"\"Weeds are the bane of crops,<br> but hate is these folk’s bane.<br> That’s why a gift to one rid of hate<br> is so very fruitful.\"", r:"Dhammapada 357",},
 {t:"\"Weeds are the bane of crops,<br> but delusion is these folk’s bane.<br> That’s why a gift to one rid of delusion<br> is so very fruitful.\"", r:"Dhammapada 358",},
 {t:"\"Weeds are the bane of crops,<br> but desire is these folk’s bane.<br> That’s why a gift to one rid of desire<br> is so very fruitful.\"", r:"Dhammapada 359",},
 {t:"\"Restraint of the eye is good;<br> good is restraint of the ear;<br> restraint of the nose is good;<br> good is restraint of the tongue.\"", r:"Dhammapada 360",},
 {t:"\"Restraint of the body is good;<br> good is restraint of speech;<br> restraint of mind is good;<br> everywhere, restraint is good.<br> The mendicant restrained everywhere<br> is released from all suffering.\"", r:"Dhammapada 361",},
 {t:"\"One restrained in hand and foot,<br> and in speech, the supreme restraint;<br> happy inside, serene,<br> solitary, content, I call a mendicant.\"", r:"Dhammapada 362",},
 {t:"\"When a mendicant of restrained mouth,<br> thoughtful in counsel, not restless,<br> explains the text and its meaning,<br> their words are sweet.\"", r:"Dhammapada 363",},
 {t:"\"Delighting in the teaching, enjoying the teaching,<br> contemplating the teaching,<br> a mendicant who recollects the teaching<br> doesn’t fall away from the true teaching.\"", r:"Dhammapada 364",},
 {t:"\"A well-off mendicant ought not look down<br> on others, nor should they be envious.<br> A mendicant who envies others<br> does not achieve immersion.\"", r:"Dhammapada 365",},
 {t:"\"If a mendicant is poor in offerings,<br> the well-to-do ought not look down on them.<br> For the gods indeed praise them,<br> who are tireless and pure of livelihood.\"", r:"Dhammapada 366",},
 {t:"\"One who has no sense of ownership<br> in the whole realm of name and form,<br> who does not grieve for that which is not,<br> is said to be a mendicant.\"", r:"Dhammapada 367",},
 {t:"\"A mendicant who meditates on love,<br> devoted to the Buddha’s teaching,<br> would realize the peaceful state,<br> the blissful stilling of conditions.\"", r:"Dhammapada 368",},
 {t:"\"Bail out this boat, mendicant!<br> When bailed out it will float lightly.<br> Having cut off desire and hate,<br> you shall reach extinguishment.\"", r:"Dhammapada 369",},
 {t:"\"Five to cut, five to drop,<br> and five more to develop.<br> When a mendicant slips five chains<br> they’re said to have crossed the flood.\"", r:"Dhammapada 370",},
 {t:"\"Practice absorption, don’t be negligent!<br> Don’t let the mind delight in the senses!<br> Don’t heedlessly swallow a hot iron ball!<br> And when it burns, don’t cry, “Oh, the pain!”\"", r:"Dhammapada 371",},
 {t:"\"No absorption for one without wisdom,<br> no wisdom for one without absorption.<br> But one with absorption and wisdom—<br> they have truly drawn near to extinguishment.\"", r:"Dhammapada 372",},
 {t:"\"A mendicant who enters an empty hut<br> with mind at peace<br> finds a superhuman delight<br> as they rightly discern the Dhamma.\"", r:"Dhammapada 373",},
 {t:"\"Whenever they are mindful<br> of the rise and fall of the aggregates,<br> they feel rapture and joy:<br> that is freedom from death for one who knows.\"", r:"Dhammapada 374",},
 {t:"\"This is the very start of the path<br> for a wise mendicant:<br> guarding the senses, contentment,<br> and restraint in the monastic code.\"", r:"Dhammapada 375",},
 {t:"\"Mix with spiritual friends,<br> who are tireless and pure of livelihood.<br> Share what you have with others,<br> being skillful in your conduct.<br> And when you’re full of joy,<br> you’ll make an end to suffering.\"", r:"Dhammapada 376",},
 {t:"\"As a jasmine sheds<br> its withered flowers,<br> O mendicants,<br> shed greed and hate.\"", r:"Dhammapada 377",},
 {t:"\"Calm in body, calm in speech,<br> peaceful and serene;<br> a mendicant who’s spat out the world’s bait<br> is said to be one at peace.\"", r:"Dhammapada 378",},
 {t:"\"Urge yourself on,<br> reflect on yourself.<br> A mendicant self-controlled and mindful<br> will always dwell in happiness.\"", r:"Dhammapada 379",},
 {t:"\"Self is indeed the lord of self,<br> for who else would be one’s lord?<br> Self is indeed the home of self,<br> so restrain yourself,<br> as a merchant his thoroughbred steed.\"", r:"Dhammapada 380",},
 {t:"\"A monk full of joy<br> trusting in the Buddha’s teaching,<br> would realize the peaceful state,<br> the blissful stilling of conditions.\"", r:"Dhammapada 381",},
 {t:"\"A young mendicant<br> devoted to the Buddha’s teaching,<br> lights up the world,<br> like the moon freed from clouds.\"", r:"Dhammapada 382",},
 {t:"\"Cut the stream, striving!<br> Cast aside sensual pleasures, brahmin.<br> Knowing the ending of conditions,<br> know the uncreated, brahmin.\"", r:"Dhammapada 383",},
 {t:"\"When a brahmin has gone beyond<br> dualistic phenomena,<br> then they consciously<br> make an end of all fetters.\"", r:"Dhammapada 384",},
 {t:"\"One for whom there is no crossing over<br> or crossing back, or crossing over and back;<br> stress-free, detached,<br> that’s who I declare a brahmin.\"", r:"Dhammapada 385",},
 {t:"\"Absorbed, rid of hopes,<br> their task completed, without defilements,<br> arrived at the highest goal:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 386",},
 {t:"\"The sun blazes by day,<br> the moon radiates at night,<br> the aristocrat shines in armor,<br> and the brahmin shines in absorption.<br> But all day and all night,<br> the Buddha blazes with glory.\"", r:"Dhammapada 387",},
 {t:"\"A brahmin’s so-called<br> since they’ve banished evil,<br> an ascetic’s so-called<br> since they live a serene life.<br> One who has renounced all stains<br> is said to be a “renunciant”.\"", r:"Dhammapada 388",},
 {t:"\"One should never strike a brahmin,<br> nor should a brahmin retaliate.<br> Woe to the one who hurts a brahmin,<br> and woe for the one who retaliates.\"", r:"Dhammapada 389",},
 {t:"\"Nothing is better for a brahmin<br> than to hold their mind back from attachment.<br> From wherever a cruel wish recoils,<br> right there suffering subsides.\"", r:"Dhammapada 390",},
 {t:"\"Who does nothing wrong<br> by body, speech or mind,<br> restrained in these three respects,<br> that’s who I declare a brahmin.\"", r:"Dhammapada 391",},
 {t:"\"You should graciously honor<br> the one from whom you learn the Dhamma<br> taught by the awakened Buddha,<br> as a brahmin honors the sacred flame.\"", r:"Dhammapada 392",},
 {t:"\"Not by matted hair or family,<br> or birth is one a brahmin.<br> Those who are truthful and principled:<br> they are pure, they are brahmins.\"", r:"Dhammapada 393",},
 {t:"\"Why the matted hair, you simpleton,<br> and why the skin of deer?<br> The tangle is inside you,<br> yet you polish up your outsides.\"", r:"Dhammapada 394",},
 {t:"\"A personage who wears robes of rags,<br> lean, their limbs showing veins,<br> meditating alone in the forest,<br> that’s who I declare a brahmin.\"", r:"Dhammapada 395",},
 {t:"\"I don’t call someone a brahmin<br> after the mother’s womb they’re born from.<br> If they still have attachments,<br> they’re just someone who says “worthy”.<br> Having nothing, taking nothing:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 396",},
 {t:"\"Having cut off all fetters<br> they have no anxiety.<br> They’ve slipped their chains and are detached:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 397",},
 {t:"\"They’ve cut the strap and harness,<br> the halter and bridle too,<br> with cross-bar lifted, they’re awakened:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 398",},
 {t:"\"Abuse, killing, caging:<br> they withstand these without anger.<br> Patience is their powerful army:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 399",},
 {t:"\"Not irritable or pretentious,<br> dutiful in precepts and observances,<br> tamed, bearing their final body:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 400",},
 {t:"\"Like water from a lotus leaf,<br> like a mustard seed off a pin-point,<br> sensual pleasures slip off them:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 401",},
 {t:"\"They understand for themselves<br> the end of suffering in this life;<br> with burden put down, detached:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 402",},
 {t:"\"Deep in wisdom, intelligent,<br> expert in the path and what is not the path;<br> arrived at the highest goal:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 403",},
 {t:"\"Mixing with neither<br> householders nor the homeless;<br> a migrant with no bastion, few in wishes:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 404",},
 {t:"\"They’ve laid aside violence<br> against creatures firm and frail;<br> not killing or making others kill:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 405",},
 {t:"\"Not fighting among those who fight,<br> quenched among those who have taken up arms,<br> not grasping among those who grasp:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 406",},
 {t:"\"They’ve discarded greed and hate,<br> along with conceit and contempt,<br> like a mustard seed off the point of a pin:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 407",},
 {t:"\"The words they utter<br> are polished, informative, and true,<br> and don’t offend anyone:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 408",},
 {t:"\"They don’t steal anything in the world,<br> long or short,<br> fine or coarse, beautiful or ugly:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 409",},
 {t:"\"They have no hope<br> in this world or the next;<br> with no need for hope, detached:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 410",},
 {t:"\"They have no clinging,<br> knowledge has freed them of indecision,<br> they’ve arrived at the objective, freedom from death:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 411",},
 {t:"\"They’ve escaped clinging<br> to both good and bad deeds;<br> sorrowless, stainless, pure:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 412",},
 {t:"\"Pure as the spotless moon,<br> clear and undisturbed,<br> they’ve ended relish for rebirth:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 413",},
 {t:"\"They’ve got past this grueling swamp<br> of delusion, transmigration.<br> Meditating in stillness, free of indecision,<br> they have crossed over to the far shore.<br> They’re quenched by not grasping:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 414",},
 {t:"\"They’ve given up sensual stimulations,<br> and have gone forth from lay life;<br> they’ve ended rebirth in the sensual realm:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 415",},
 {t:"\"They’ve given up craving,<br> and have gone forth from lay life;<br> they’ve ended craving to be reborn:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 416",},
 {t:"\"They’ve thrown off the human yoke,<br> and slipped out of the heavenly yoke;<br> unyoked from all yokes:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 417",},
 {t:"\"Giving up desire and discontent,<br> they’re cooled and free of attachments;<br> a hero, master of the whole world:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 418",},
 {t:"\"They know the passing away<br> and rebirth of all beings;<br> unattached, holy, awakened:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 419",},
 {t:"\"Gods, centaurs, and humans<br> don’t know their destiny;<br> the perfected ones with defilements ended:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 420",},
 {t:"\"They have nothing before or after,<br> or even in between.<br> Having nothing, taking nothing:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 421",},
 {t:"\"Captain of the herd, excellent hero,<br> great seer and victor;<br> unstirred, washed, awakened:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 422",},
 {t:"\"One who knows their past lives,<br> sees heaven and places of loss,<br> and has attained the end of rebirth;<br> a sage of perfect insight<br> at the summit of spiritual perfection:<br> that’s who I declare a brahmin.\"", r:"Dhammapada 423",},
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