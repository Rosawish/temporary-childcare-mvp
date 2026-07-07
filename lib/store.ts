"use client";

import { atToday, seedData } from "./mockData";
import type {
  Booking,
  BookingStatus,
  CameraFeed,
  CareStatusType,
  ChildProfile,
  MockDb,
  ParentUser,
  Payment,
  Review
} from "./types";

const DB_KEY = "temporary-childcare-mvp-db-v2";
const PARENT_KEY = "temporary-childcare-parent-id";
const PROVIDER_KEY = "temporary-childcare-provider-center-id";

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

export function loadDb(): MockDb {
  if (typeof window === "undefined") return seedData;
  const raw = window.localStorage.getItem(DB_KEY);
  if (!raw) {
    window.localStorage.setItem(DB_KEY, JSON.stringify(seedData));
    return structuredClone(seedData);
  }
  return JSON.parse(raw) as MockDb;
}

export function saveDb(db: MockDb) {
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function resetDemoData() {
  window.localStorage.setItem(DB_KEY, JSON.stringify(seedData));
  window.localStorage.setItem(PARENT_KEY, "parent-lin");
  window.localStorage.setItem(PROVIDER_KEY, "center-happy");
}

export function loginParent(email: string, password: string) {
  const parent = loadDb().parents.find((item) => item.email === email && item.password === password);
  if (parent) window.localStorage.setItem(PARENT_KEY, parent.id);
  return parent;
}

export function currentParent(): ParentUser | undefined {
  const id = window.localStorage.getItem(PARENT_KEY) ?? "parent-lin";
  return loadDb().parents.find((item) => item.id === id);
}

export function loginProvider(email: string, password: string) {
  if (email === "provider@example.com" && password === "password123") {
    window.localStorage.setItem(PROVIDER_KEY, "center-happy");
    return true;
  }
  return false;
}

export function currentProviderCenterId() {
  return window.localStorage.getItem(PROVIDER_KEY) ?? "center-happy";
}

export function money(amount: number) {
  return `NT$ ${Math.round(amount).toLocaleString("zh-TW")}`;
}

export function timeOnly(iso: string) {
  return new Date(iso).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function dateTime(iso: string) {
  return new Date(iso).toLocaleString("zh-TW", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
}

export function statusText(status: BookingStatus) {
  const map: Record<BookingStatus, string> = {
    pending: "待確認",
    confirmed: "已確認",
    checked_in: "已抵達",
    in_care: "照顧中",
    ready_pickup: "可接回",
    completed: "已完成",
    cancelled: "已取消",
    no_show: "未報到"
  };
  return map[status];
}

export function reviewAverage(centerId: string, db = loadDb()) {
  const reviews = db.reviews.filter((item) => item.centerId === centerId);
  if (!reviews.length) return 0;
  return reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
}

export function centerRemaining(centerId: string, db = loadDb()) {
  return db.slots.filter((slot) => slot.centerId === centerId && slot.status === "open").reduce((sum, slot) => sum + slot.remainingCapacity, 0);
}

export function estimateAmount(startTime: string, endTime: string, pricePerHour: number, minimumMinutes: number) {
  const minutes = Math.max(minimumMinutes, (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000);
  return (minutes / 60) * pricePerHour;
}

export function createTeacherNotice(parent: ParentUser, child: ChildProfile, centerId: string, startTime: string, endTime: string, db = loadDb()) {
  const center = db.centers.find((item) => item.id === centerId);
  return `老師您好，我是 ${child.name} 的家長 ${parent.name}。
因今日臨時有工作安排，放學後將由我本人接送孩子至已預約之短託機構。

短託機構：${center?.name}
機構地址：${center?.address}
預約時段：${timeOnly(startTime)} 至 ${timeOnly(endTime)}
家長聯絡電話：${parent.phone}
孩子注意事項：${child.allergies || "無"} / ${child.medicalNotes || "無"} / ${child.comfortNotes || "無"}

以上資訊提供老師知悉，謝謝。`;
}

export function createBooking(input: { parentUserId: string; childProfileId: string; centerId: string; servicePlanId: string; startTime: string; endTime: string }) {
  const db = loadDb();
  const parent = db.parents.find((item) => item.id === input.parentUserId);
  const child = db.children.find((item) => item.id === input.childProfileId);
  const center = db.centers.find((item) => item.id === input.centerId);
  const plan = db.servicePlans.find((item) => item.id === input.servicePlanId);
  const slot = db.slots.find((item) => item.centerId === input.centerId && item.servicePlanId === input.servicePlanId && item.remainingCapacity > 0);
  if (!parent || !child || !center || !plan || !slot) throw new Error("預約資料不完整或沒有剩餘名額");
  if (center.reviewStatus !== "approved") throw new Error("機構尚未通過平台審核，暫不可預約");

  slot.remainingCapacity -= 1;
  const booking: Booking = {
    id: uid("booking"),
    parentUserId: parent.id,
    childProfileId: child.id,
    centerId: center.id,
    servicePlanId: plan.id,
    startTime: input.startTime,
    endTime: input.endTime,
    status: "confirmed",
    estimatedAmount: estimateAmount(input.startTime, input.endTime, plan.pricePerHour, plan.minimumMinutes),
    teacherNoticeText: createTeacherNotice(parent, child, center.id, input.startTime, input.endTime, db),
    checkinCode: Math.floor(1000 + Math.random() * 9000).toString()
  };
  db.bookings.unshift(booking);
  db.bookingStatusLogs.push({ id: uid("status"), bookingId: booking.id, fromStatus: "pending", toStatus: "confirmed", changedByRole: "parent", createdAt: new Date().toISOString() });
  saveDb(db);
  return booking;
}

export function updateBookingStatus(bookingId: string, nextStatus: BookingStatus) {
  const db = loadDb();
  const booking = db.bookings.find((item) => item.id === bookingId);
  if (!booking) throw new Error("找不到預約");
  const fromStatus = booking.status;
  booking.status = nextStatus;
  if (nextStatus === "checked_in") booking.actualCheckinTime = new Date().toISOString();
  if (nextStatus === "completed") {
    booking.actualCheckoutTime = new Date().toISOString();
    booking.finalAmount = booking.estimatedAmount;
  }
  db.bookingStatusLogs.push({ id: uid("status"), bookingId, fromStatus, toStatus: nextStatus, changedByRole: "provider", createdAt: new Date().toISOString() });
  saveDb(db);
}

export function addCareLog(bookingId: string, statusType: CareStatusType, note: string) {
  const db = loadDb();
  db.careLogs.unshift({ id: uid("care"), bookingId, statusType, note, createdBy: "張雅婷", createdAt: new Date().toISOString() });
  saveDb(db);
}

export function eligibleCameraForBooking(booking: Booking, db = loadDb()): CameraFeed | undefined {
  return db.cameras.find((feed) => feed.centerId === booking.centerId && feed.isActive && feed.isOpenArea && feed.reviewStatus === "approved");
}

export function cameraPermission(bookingId: string, parentUserId: string) {
  const db = loadDb();
  const booking = db.bookings.find((item) => item.id === bookingId);
  if (!booking) return { ok: false, reason: "找不到預約" };
  if (booking.parentUserId !== parentUserId) return { ok: false, reason: "此預約不屬於目前登入家長" };
  if (!["checked_in", "in_care"].includes(booking.status)) return { ok: false, reason: "孩子需已抵達或照顧中才可查看監控" };
  const feed = eligibleCameraForBooking(booking, db);
  if (!feed) return { ok: false, reason: "沒有通過審核的開放空間監控" };
  const now = new Date();
  if (now < new Date(booking.startTime) || now > new Date(booking.endTime)) return { ok: false, reason: "僅能在預約服務時段內查看" };
  return { ok: true, feed, booking };
}

export function logCameraAccess(bookingId: string, parentUserId: string, cameraFeedId: string) {
  const db = loadDb();
  db.cameraAccessLogs.push({ id: uid("camlog"), bookingId, parentUserId, cameraFeedId, accessedAt: new Date().toISOString(), userAgent: navigator.userAgent });
  saveDb(db);
}

export function mockPay(bookingId: string): Payment {
  const db = loadDb();
  const booking = db.bookings.find((item) => item.id === bookingId);
  if (!booking || booking.status !== "completed") throw new Error("預約完成後才能付款");
  const existing = db.payments.find((item) => item.bookingId === bookingId);
  if (existing) {
    existing.paymentStatus = "paid";
    existing.paidAt = new Date().toISOString();
    saveDb(db);
    return existing;
  }
  const payment: Payment = { id: uid("payment"), bookingId, amount: booking.finalAmount ?? booking.estimatedAmount, paymentMethod: "mock", paymentStatus: "paid", paidAt: new Date().toISOString() };
  db.payments.push(payment);
  saveDb(db);
  return payment;
}

export function createReview(bookingId: string, rating: number, comment: string, wouldUseAgain: boolean): Review {
  const db = loadDb();
  const booking = db.bookings.find((item) => item.id === bookingId);
  if (!booking) throw new Error("找不到預約");
  const paid = db.payments.some((item) => item.bookingId === bookingId && item.paymentStatus === "paid");
  if (!paid) throw new Error("付款完成後才能評價");
  if (db.reviews.some((item) => item.bookingId === bookingId)) throw new Error("每筆預約只能評價一次");
  const review: Review = { id: uid("review"), bookingId, parentUserId: booking.parentUserId, centerId: booking.centerId, rating, comment, wouldUseAgain };
  db.reviews.push(review);
  saveDb(db);
  return review;
}

export function defaultBookingTimes() {
  return { startTime: atToday("16:30"), endTime: atToday("18:00") };
}
