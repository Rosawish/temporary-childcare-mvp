import type { Booking, BookingStatus, Center, CenterDocument, ChildProfile, IncidentReport, MockDb, ParentUser, Payment, Review, ReviewStatus, StaffProfile } from "./types";

export const todayIsoDate = () => new Date().toISOString().slice(0, 10);
export const atToday = (time: string) => `${todayIsoDate()}T${time}:00`;

const names = ["林怡安", "陳柏宏", "張心瑜", "王俊廷", "李佳蓉", "黃品安", "吳承恩", "周雅雯", "劉冠宇", "蔡孟庭", "許哲維", "鄭以柔", "郭明軒", "謝雨潔", "曾子豪", "楊舒涵", "羅柏翰", "葉欣妤", "蘇奕辰", "高采潔"];
const childNames = ["小安", "小恩", "小晴", "小宇", "小樂", "小米", "小睿", "小予", "小庭", "小翔", "小妍", "小謙", "小彤", "小杰", "小妮", "小晨", "小希", "小維", "小芯", "小穎", "小禾", "小亮", "小潔", "小宥", "小蓁", "小廷", "小菲", "小然", "小寧", "小禹"];
const centerNames = ["幸福小屋短託", "小星星課後照顧中心", "安心寶貝臨托站", "彩虹橋臨托中心", "橘子樹兒童照顧", "松果課後短托", "暖暖屋托育合作站", "城市小芽短託"];
const reviewStatuses: ReviewStatus[] = ["approved", "approved", "approved", "approved", "approved", "pending", "needs_revision", "suspended"];
const bookingStatusPlan: BookingStatus[] = [
  ...Array(60).fill("completed"),
  ...Array(15).fill("cancelled"),
  ...Array(10).fill("pending"),
  ...Array(8).fill("confirmed"),
  ...Array(3).fill("checked_in"),
  ...Array(3).fill("in_care"),
  "no_show"
];
const docStatuses: ReviewStatus[] = [
  ...Array(20).fill("approved"),
  ...Array(3).fill("pending"),
  ...Array(2).fill("needs_revision"),
  ...Array(2).fill("approved"),
  ...Array(3).fill("expired")
];
const staffStatuses: ReviewStatus[] = [
  ...Array(15).fill("approved"),
  ...Array(3).fill("pending"),
  "needs_revision",
  "expired"
];

function daysAgo(days: number, time = "10:00") {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const yyyyMmDd = date.toISOString().slice(0, 10);
  return `${yyyyMmDd}T${time}:00`;
}

function monthAgo(months: number, day: number, time = "16:30") {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  date.setDate(Math.min(day, 25));
  const yyyyMmDd = date.toISOString().slice(0, 10);
  return `${yyyyMmDd}T${time}:00`;
}

function addMinutes(iso: string, minutes: number) {
  return new Date(new Date(iso).getTime() + minutes * 60000).toISOString().slice(0, 19);
}

function amountFor(index: number) {
  return 420 + (index % 5) * 120;
}

function centerByIndex(index: number) {
  return `center-${index + 1}`;
}

const parents: ParentUser[] = names.map((name, index) => ({
  id: index === 0 ? "parent-lin" : index === 1 ? "parent-chen" : `parent-${index + 1}`,
  name,
  phone: `09${String(12000000 + index * 731).slice(0, 8)}`,
  email: index === 0 ? "parent@example.com" : index === 1 ? "chen@example.com" : `parent${index + 1}@example.com`,
  password: "password123",
  createdAt: daysAgo(360 - index * 13),
  updatedAt: daysAgo(Math.max(1, 35 - index)),
  lastLoginAt: index < 14 ? daysAgo(index + 1, "09:20") : undefined
}));

const children: ChildProfile[] = childNames.map((name, index) => {
  const parent = parents[index % parents.length];
  return {
    id: index === 0 ? "child-an" : index === 1 ? "child-en" : `child-${index + 1}`,
    parentUserId: parent.id,
    name,
    age: 4 + (index % 3),
    schoolName: index % 2 === 0 ? "公立幼兒園" : "私立幼兒園",
    className: index % 3 === 0 ? "大班" : index % 3 === 1 ? "中班" : "小班",
    schoolLeaveTime: index % 2 === 0 ? "16:00" : "16:30",
    allergies: index % 7 === 0 ? "花生過敏" : index % 5 === 0 ? "牛奶需少量" : "無",
    medicalNotes: index % 6 === 0 ? "需留意氣喘與劇烈活動" : "無特殊疾病",
    comfortNotes: index % 4 === 0 ? "想家時喜歡聽故事" : "可用繪本或積木安撫",
    emergencyContact: { name: parent.name, phone: parent.phone, relation: index % 2 === 0 ? "母親" : "父親" },
    authorizedPickupPeople: [parent.name, "授權親友"],
    createdAt: daysAgo(330 - index * 5),
    updatedAt: daysAgo(Math.max(1, 40 - index))
  };
});

const centers: Center[] = centerNames.map((name, index) => ({
  id: centerByIndex(index),
  name,
  businessNumber: `${24567000 + index * 137}`,
  registrationNumber: `北市幼托字第 ${String(1023 + index).padStart(4, "0")} 號`,
  address: index === 0 ? "台北市大安區和平東路二段 88 號" : `台北市文教區安心路 ${60 + index * 12} 號`,
  latitude: 25.02 + index * 0.004,
  longitude: 121.53 + index * 0.006,
  phone: `02-27${String(100000 + index * 911).slice(0, 6)}`,
  email: `center${index + 1}@care.test`,
  description: `${name} 提供放學後臨時短時段照顧、點心、閱讀與安全接回核對。`,
  reviewStatus: reviewStatuses[index],
  isBookable: index < 5,
  distanceKm: Number((0.5 + index * 0.4).toFixed(1)),
  openHours: index % 2 === 0 ? "15:30-20:00" : "16:00-21:00",
  tags: index === 0 ? ["步行可達", "開放空間監控", "點心透明", "臨時預約"] : ["小班制", "透明價格", "近學校"],
  safetyMeasures: ["門禁磁扣", "照顧人員背景審核", "每日環境消毒", "接回身分核對"],
  cameraPolicy: "僅活動區開放家長於服務時段查看，不提供錄影、下載或截圖。"
}));

centers[0].id = "center-happy";
centers[1].id = "center-star";
centers[2].id = "center-safe";
centers[1].registrationNumber = "北市社兒字第 B2210 號";
centers[2].reviewStatus = "needs_revision";
centers[7].reviewStatus = "suspended";
centers[7].isBookable = false;

const servicePlans = centers.map((center, index) => ({
  id: index === 0 ? "plan-happy-temp" : index === 1 ? "plan-star-temp" : `plan-${index + 1}`,
  centerId: center.id,
  name: index % 2 === 0 ? "今日臨時短託" : "放學後短託",
  serviceType: "temporary" as const,
  pricePerHour: 300 + (index % 5) * 30,
  minimumMinutes: 60,
  maxMinutes: 240,
  cancellationPolicy: "開始前 30 分鐘可取消並回補名額。",
  overtimePolicy: "逾時每 15 分鐘 100 元。",
  isActive: center.reviewStatus === "approved"
}));

const slots = centers.flatMap((center, index) => [0, 1].map((slotIndex) => ({
  id: `slot-${center.id}-${slotIndex}`,
  centerId: center.id,
  servicePlanId: servicePlans[index].id,
  startTime: atToday(slotIndex === 0 ? "16:30" : "18:00"),
  endTime: atToday(slotIndex === 0 ? "18:00" : "20:00"),
  capacity: 5,
  remainingCapacity: center.reviewStatus === "approved" ? Math.max(1, 5 - ((index + slotIndex) % 4)) : 0,
  status: center.reviewStatus === "approved" ? "open" as const : "closed" as const
})));

const documents: CenterDocument[] = Array.from({ length: 30 }, (_, index) => {
  const status = docStatuses[index];
  const center = centers[index % centers.length];
  const validUntil = index >= 25
    ? daysAgo(20 + index, "00:00").slice(0, 10)
    : index === 23 || index === 24
      ? daysAgo(-15 - index, "00:00").slice(0, 10)
      : daysAgo(-180 - index * 7, "00:00").slice(0, 10);
  return {
    id: index === 0 ? "doc-1" : `doc-${index + 1}`,
    centerId: center.id,
    documentType: index % 3 === 0 ? "立案證明" : index % 3 === 1 ? "公共安全" : "消防",
    documentName: index % 3 === 0 ? "托育服務登記證" : index % 3 === 1 ? "建築物安全檢查" : "消防設備檢修申報",
    documentNumber: `DOC-${String(index + 1).padStart(4, "0")}`,
    issuedBy: index % 2 === 0 ? "台北市政府" : "合格檢查機構",
    validUntil,
    reviewStatus: status,
    fileUrl: `mock://document-${index + 1}.pdf`
  };
});

const staff: StaffProfile[] = Array.from({ length: 20 }, (_, index) => ({
  id: index === 0 ? "staff-1" : `staff-${index + 1}`,
  centerId: centers[index % centers.length].id,
  name: ["張雅婷", "吳宗翰", "黃詩涵", "李彥廷", "林郁文"][index % 5] + (index > 4 ? index : ""),
  title: index % 2 === 0 ? "主責照顧老師" : "助理照顧員",
  qualification: index % 2 === 0 ? "幼教教師證" : "保母證照",
  experienceYears: 2 + (index % 9),
  bio: "熟悉幼兒情緒安撫、點心照顧與接回身分核對。",
  isActive: index < 18,
  reviewStatus: staffStatuses[index]
}));

const bookings: Booking[] = bookingStatusPlan.map((status, index) => {
  const month = index % 12;
  const startTime = index < 3 ? atToday(["16:30", "18:00", "16:00"][index]) : monthAgo(month, (index % 25) + 1, index % 2 === 0 ? "16:30" : "17:00");
  const minutes = 90 + (index % 4) * 30;
  const finalAmount = status === "completed" || status === "cancelled" ? amountFor(index) : undefined;
  const commissionRate = 0.15;
  const parent = parents[index % parents.length];
  const child = children.filter((item) => item.parentUserId === parent.id)[0] ?? children[index % children.length];
  const center = centers[index % centers.length];
  return {
    id: index === 0 ? "booking-demo-care" : index === 1 ? "booking-pending" : index === 2 ? "booking-confirmed" : `booking-${index + 1}`,
    parentUserId: parent.id,
    childProfileId: child.id,
    centerId: center.id,
    servicePlanId: servicePlans[index % servicePlans.length].id,
    startTime,
    endTime: addMinutes(startTime, minutes),
    actualCheckinTime: ["checked_in", "in_care", "completed"].includes(status) ? addMinutes(startTime, 4) : undefined,
    actualCheckoutTime: status === "completed" ? addMinutes(startTime, minutes) : undefined,
    status,
    estimatedAmount: amountFor(index),
    finalAmount,
    commissionRate,
    platformFeeAmount: finalAmount ? Math.round(finalAmount * commissionRate) : undefined,
    providerRevenueAmount: finalAmount ? Math.round(finalAmount * (1 - commissionRate)) : undefined,
    createdAt: index < 3 ? daysAgo(index, "11:10") : monthAgo(month, (index % 25) + 1, "11:10"),
    updatedAt: daysAgo(index % 28, "18:20"),
    cancelledAt: status === "cancelled" ? addMinutes(startTime, -45) : undefined,
    teacherNoticeText: `老師您好，我是 ${child.name} 的家長 ${parent.name}。\n因今日臨時有工作安排，放學後將由我本人接送孩子至已預約之短託機構。\n\n短託機構：${center.name}\n機構地址：${center.address}\n預約時段：${startTime.slice(11, 16)} 至 ${addMinutes(startTime, minutes).slice(11, 16)}\n家長聯絡電話：${parent.phone}\n孩子注意事項：${child.allergies} / ${child.medicalNotes} / ${child.comfortNotes}\n\n以上資訊提供老師知悉，謝謝。`,
    checkinCode: String(1000 + ((index * 73) % 8999))
  };
});

bookings[0].parentUserId = "parent-lin";
bookings[0].childProfileId = "child-an";
bookings[0].centerId = "center-happy";
bookings[0].servicePlanId = "plan-happy-temp";
bookings[0].status = "in_care";
bookings[1].status = "pending";
bookings[2].status = "confirmed";

const paymentStatuses = [...Array(65).fill("paid"), ...Array(10).fill("pending"), ...Array(3).fill("failed"), ...Array(2).fill("refunded")] as Payment["paymentStatus"][];
const payments: Payment[] = paymentStatuses.map((paymentStatus, index) => {
  const booking = bookings[index % bookings.length];
  const amount = booking.finalAmount ?? booking.estimatedAmount;
  return {
    id: index === 0 ? "payment-paid-1" : `payment-${index + 1}`,
    bookingId: booking.id,
    amount,
    paymentMethod: "mock",
    paymentStatus,
    paidAt: paymentStatus === "paid" || paymentStatus === "refunded" ? booking.updatedAt ?? booking.createdAt : undefined,
    refundedAmount: paymentStatus === "refunded" ? Math.round(amount * 0.8) : 0,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt
  };
});

const reviews: Review[] = Array.from({ length: 45 }, (_, index) => {
  const booking = bookings[index % bookings.length];
  const rating = (index % 5) + 1;
  return {
    id: index === 0 ? "review-1" : index === 1 ? "review-2" : `review-${index + 1}`,
    bookingId: booking.id,
    parentUserId: booking.parentUserId,
    centerId: booking.centerId,
    rating,
    comment: rating <= 2 ? "等待時間偏長，孩子回報活動較少。" : "老師回報清楚，臨時加班時很有幫助。",
    wouldUseAgain: rating >= 3,
    createdAt: monthAgo(index % 12, (index % 24) + 1, "20:30"),
    updatedAt: monthAgo(index % 12, (index % 24) + 1, "20:30")
  };
});

const cameras = centers.flatMap((center, index) => [
  { id: `camera-${center.id}-open`, centerId: center.id, spaceName: "活動區開放鏡頭", feedUrl: "https://www.youtube.com/embed/jfKfPfyJRdk", isOpenArea: true, isActive: true, reviewStatus: index < 5 ? "approved" as ReviewStatus : "pending" as ReviewStatus },
  { id: `camera-${center.id}-entry`, centerId: center.id, spaceName: "出入口內部鏡頭", feedUrl: "https://www.youtube.com/embed/jfKfPfyJRdk", isOpenArea: false, isActive: true, reviewStatus: "pending" as ReviewStatus }
]);
cameras[0].id = "camera-happy-open";

const cameraAccessLogs = Array.from({ length: 100 }, (_, index) => {
  const booking = bookings[index % bookings.length];
  const feed = cameras.find((camera) => camera.centerId === booking.centerId && camera.isOpenArea) ?? cameras[0];
  return {
    id: `camlog-${index + 1}`,
    bookingId: booking.id,
    parentUserId: booking.parentUserId,
    cameraFeedId: feed.id,
    accessedAt: index < 8 ? daysAgo(index % 2, "17:10") : monthAgo(index % 12, (index % 24) + 1, "17:10"),
    userAgent: "Mock Browser"
  };
});

const incidents: IncidentReport[] = Array.from({ length: 10 }, (_, index) => {
  const booking = bookings[index % bookings.length];
  const statuses: IncidentReport["status"][] = ["open", "open", "open", "investigating", "investigating", "resolved", "resolved", "resolved", "resolved", "resolved"];
  const severities: IncidentReport["severity"][] = ["medium", "high", "low", "medium", "high", "low", "medium", "critical", "low", "medium"];
  return {
    id: `incident-${index + 1}`,
    bookingId: booking.id,
    centerId: booking.centerId,
    parentUserId: booking.parentUserId,
    title: index === 7 ? "接回身分核對異常" : "照顧紀錄需追蹤",
    description: "Demo 事件資料，用於平台風險儀錶板。",
    status: statuses[index],
    severity: severities[index],
    createdAt: index < 3 ? daysAgo(index + 1, "19:00") : monthAgo(index % 12, (index % 24) + 1, "19:00"),
    updatedAt: daysAgo(index, "19:30")
  };
});

export const seedData: MockDb = {
  admins: [{ id: "admin-demo", name: "平台管理員", email: "admin@example.com", password: "password123", role: "admin", createdAt: daysAgo(400), updatedAt: daysAgo(1) }],
  parents,
  children,
  centers,
  documents,
  staff,
  photos: [
    { id: "photo-1", centerId: "center-happy", spaceName: "活動區", photoUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80", description: "防撞地墊與開放式活動空間" },
    { id: "photo-2", centerId: "center-happy", spaceName: "閱讀區", photoUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80", description: "低書櫃與安靜閱讀角" },
    { id: "photo-3", centerId: "center-star", spaceName: "點心區", photoUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80", description: "分桌用餐與過敏標示" }
  ],
  servicePlans,
  slots,
  bookings,
  bookingStatusLogs: [],
  careLogs: [
    { id: "care-1", bookingId: "booking-demo-care", statusType: "arrived", note: "小安已完成報到，狀態穩定。", createdBy: "張雅婷", createdAt: atToday("16:35") },
    { id: "care-2", bookingId: "booking-demo-care", statusType: "activity", note: "正在閱讀區聽故事，與同伴互動良好。", createdBy: "張雅婷", createdAt: atToday("16:50") }
  ],
  cameras,
  cameraAccessLogs,
  payments,
  reviews,
  incidents
};
