import type { BookingStatus, MockDb, PaymentStatus, ReviewStatus } from "@/lib/types";

const COMMISSION_RATE = 0.15;
const activeStatuses: BookingStatus[] = ["checked_in", "in_care", "ready_pickup"];
const allBookingStatuses: BookingStatus[] = ["pending", "confirmed", "checked_in", "in_care", "ready_pickup", "completed", "cancelled", "no_show"];
const allPaymentStatuses: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];
const allReviewStatuses: ReviewStatus[] = ["pending", "approved", "needs_revision", "rejected", "expired"];

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfToday(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function inMonth(iso?: string, date = new Date()) {
  if (!iso) return false;
  const value = new Date(iso);
  const start = startOfMonth(date);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return value >= start && value < end;
}

function isToday(iso?: string, date = new Date()) {
  if (!iso) return false;
  const value = new Date(iso);
  const start = startOfToday(date);
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  return value >= start && value < end;
}

function pct(numerator: number, denominator: number) {
  return denominator ? Number(((numerator / denominator) * 100).toFixed(1)) : 0;
}

function avg(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function bookingAmount(bookingId: string, db: MockDb) {
  const payment = db.payments.find((item) => item.bookingId === bookingId);
  const booking = db.bookings.find((item) => item.id === bookingId);
  return payment?.amount ?? booking?.finalAmount ?? booking?.estimatedAmount ?? 0;
}

function paidBookingIds(db: MockDb) {
  return new Set(db.payments.filter((item) => item.paymentStatus === "paid").map((item) => item.bookingId));
}

export function getOverviewMetrics(db: MockDb) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
  const totalParents = db.parents.length;
  const totalChildren = db.children.length;
  const parentIdsWithBookings = new Set(db.bookings.map((booking) => booking.parentUserId));
  const activeParents = new Set(
    db.parents
      .filter((parent) => parent.lastLoginAt && new Date(parent.lastLoginAt) >= thirtyDaysAgo)
      .map((parent) => parent.id)
  );
  db.bookings.filter((booking) => booking.createdAt && new Date(booking.createdAt) >= thirtyDaysAgo).forEach((booking) => activeParents.add(booking.parentUserId));

  const approvedCenters = db.centers.filter((center) => center.reviewStatus === "approved");
  const bookableCenters = approvedCenters.filter((center) => {
    const hasApprovedStaff = db.staff.some((staff) => staff.centerId === center.id && staff.reviewStatus === "approved" && staff.isActive);
    const hasOpenSlot = db.slots.some((slot) => slot.centerId === center.id && slot.status === "open" && slot.remainingCapacity > 0);
    const hasValidDocs = db.documents.some((doc) => doc.centerId === center.id && doc.reviewStatus === "approved" && new Date(doc.validUntil) > now);
    return center.isBookable && hasApprovedStaff && hasOpenSlot && hasValidDocs;
  });

  const totalBookings = db.bookings.length;
  const completedBookings = db.bookings.filter((booking) => booking.status === "completed").length;
  const cancelledBookings = db.bookings.filter((booking) => booking.status === "cancelled").length;
  const activeBookings = db.bookings.filter((booking) => activeStatuses.includes(booking.status)).length;
  const noShowBookings = db.bookings.filter((booking) => booking.status === "no_show").length;
  const durations = db.bookings.map((booking) => (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / 60000);

  const paidPayments = db.payments.filter((payment) => payment.paymentStatus === "paid");
  const paidAmount = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = db.payments.filter((payment) => payment.paymentStatus === "pending").reduce((sum, payment) => sum + payment.amount, 0);
  const refundedAmount = db.payments.reduce((sum, payment) => sum + (payment.refundedAmount ?? 0), 0);
  const paidIds = paidBookingIds(db);
  const platformCommission = db.bookings
    .filter((booking) => paidIds.has(booking.id))
    .reduce((sum, booking) => sum + (booking.platformFeeAmount ?? bookingAmount(booking.id, db) * (booking.commissionRate ?? COMMISSION_RATE)), 0);

  const averageRating = avg(db.reviews.map((review) => review.rating));
  const expiringDocuments = db.documents.filter((doc) => {
    const valid = new Date(doc.validUntil);
    return valid >= now && valid <= new Date(now.getTime() + 30 * 86400000);
  }).length;
  const expiredDocuments = db.documents.filter((doc) => doc.reviewStatus === "expired" || new Date(doc.validUntil) < now).length;
  const totalCameraViews = db.cameraAccessLogs.length;
  const activeOrCompletedBookings = db.bookings.filter((booking) => [...activeStatuses, "completed"].includes(booking.status)).length;

  return {
    users: {
      totalParents,
      newParentsThisMonth: db.parents.filter((parent) => inMonth(parent.createdAt)).length,
      totalChildren,
      avgChildrenPerParent: Number((totalChildren / Math.max(totalParents, 1)).toFixed(2)),
      parentsWithBookings: parentIdsWithBookings.size,
      parentActiveRate: pct(activeParents.size, totalParents)
    },
    centers: {
      totalCenters: db.centers.length,
      approvedCenters: approvedCenters.length,
      pendingCenters: db.centers.filter((center) => center.reviewStatus === "pending").length,
      needsRevisionCenters: db.centers.filter((center) => center.reviewStatus === "needs_revision").length,
      suspendedCenters: db.centers.filter((center) => center.reviewStatus === "suspended").length,
      bookableCenters: bookableCenters.length,
      avgBookingsPerCenter: Number((totalBookings / Math.max(db.centers.length, 1)).toFixed(2))
    },
    bookings: {
      totalBookings,
      bookingsThisMonth: db.bookings.filter((booking) => inMonth(booking.createdAt)).length,
      bookingsToday: db.bookings.filter((booking) => isToday(booking.createdAt)).length,
      completedBookings,
      activeBookings,
      cancelledBookings,
      noShowBookings,
      completionRate: pct(completedBookings, totalBookings),
      cancellationRate: pct(cancelledBookings, totalBookings),
      avgBookingDurationMinutes: Math.round(avg(durations))
    },
    revenue: {
      totalRevenue: paidAmount,
      revenueThisMonth: paidPayments.filter((payment) => inMonth(payment.paidAt)).reduce((sum, payment) => sum + payment.amount, 0),
      revenueToday: paidPayments.filter((payment) => isToday(payment.paidAt)).reduce((sum, payment) => sum + payment.amount, 0),
      paidAmount,
      pendingAmount,
      refundedAmount,
      averageOrderValue: Math.round(paidAmount / Math.max(paidPayments.length, 1)),
      avgRevenuePerBooking: Math.round(paidAmount / Math.max(totalBookings, 1)),
      platformCommission: Math.round(platformCommission)
    },
    payments: {
      paidCount: paidPayments.length,
      pendingCount: db.payments.filter((payment) => payment.paymentStatus === "pending").length,
      failedCount: db.payments.filter((payment) => payment.paymentStatus === "failed").length,
      refundedCount: db.payments.filter((payment) => payment.paymentStatus === "refunded").length,
      paymentSuccessRate: pct(paidPayments.length, db.payments.length)
    },
    reviews: {
      averageRating: Number(averageRating.toFixed(2)),
      totalReviews: db.reviews.length,
      wouldUseAgainRate: pct(db.reviews.filter((review) => review.wouldUseAgain).length, db.reviews.length),
      lowRatingCount: db.reviews.filter((review) => review.rating <= 2).length,
      reviewsThisMonth: db.reviews.filter((review) => inMonth(review.createdAt)).length
    },
    compliance: {
      pendingDocuments: db.documents.filter((doc) => doc.reviewStatus === "pending").length,
      approvedDocuments: db.documents.filter((doc) => doc.reviewStatus === "approved").length,
      expiringDocuments,
      expiredDocuments,
      pendingStaff: db.staff.filter((staff) => staff.reviewStatus === "pending").length,
      approvedStaff: db.staff.filter((staff) => staff.reviewStatus === "approved").length,
      pendingCameras: db.cameras.filter((camera) => camera.reviewStatus === "pending").length,
      approvedOpenAreaCameras: db.cameras.filter((camera) => camera.isOpenArea && camera.reviewStatus === "approved").length
    },
    camera: {
      totalCameraViews,
      cameraViewsToday: db.cameraAccessLogs.filter((log) => isToday(log.accessedAt)).length,
      cameraViewsThisMonth: db.cameraAccessLogs.filter((log) => inMonth(log.accessedAt)).length,
      avgCameraViewsPerActiveBooking: Number((totalCameraViews / Math.max(activeOrCompletedBookings, 1)).toFixed(2))
    },
    incidents: {
      totalIncidents: db.incidents.length,
      openIncidents: db.incidents.filter((incident) => incident.status === "open").length,
      investigatingIncidents: db.incidents.filter((incident) => incident.status === "investigating").length,
      resolvedIncidents: db.incidents.filter((incident) => incident.status === "resolved").length,
      highRiskIncidents: db.incidents.filter((incident) => ["high", "critical"].includes(incident.severity)).length,
      incidentsThisMonth: db.incidents.filter((incident) => inMonth(incident.createdAt)).length
    }
  };
}

export function getRevenueTrend(db: MockDb, months = 12) {
  return monthBuckets(months).map(({ key, start, end }) => {
    const payments = db.payments.filter((payment) => payment.paidAt && new Date(payment.paidAt) >= start && new Date(payment.paidAt) < end);
    const paid = payments.filter((payment) => payment.paymentStatus === "paid");
    const paidBookingSet = new Set(paid.map((payment) => payment.bookingId));
    const platformCommission = db.bookings
      .filter((booking) => paidBookingSet.has(booking.id))
      .reduce((sum, booking) => sum + (booking.platformFeeAmount ?? bookingAmount(booking.id, db) * (booking.commissionRate ?? COMMISSION_RATE)), 0);
    return {
      month: key,
      totalRevenue: paid.reduce((sum, payment) => sum + payment.amount, 0),
      paidAmount: paid.reduce((sum, payment) => sum + payment.amount, 0),
      refundedAmount: payments.reduce((sum, payment) => sum + (payment.refundedAmount ?? 0), 0),
      platformCommission: Math.round(platformCommission)
    };
  });
}

export function getBookingTrend(db: MockDb, months = 12) {
  return monthBuckets(months).map(({ key, start, end }) => {
    const bookings = db.bookings.filter((booking) => booking.createdAt && new Date(booking.createdAt) >= start && new Date(booking.createdAt) < end);
    return {
      month: key,
      totalBookings: bookings.length,
      completedBookings: bookings.filter((booking) => booking.status === "completed").length,
      cancelledBookings: bookings.filter((booking) => booking.status === "cancelled").length
    };
  });
}

export function getTopCenters(db: MockDb, limit = 10) {
  return db.centers
    .map((center) => {
      const bookings = db.bookings.filter((booking) => booking.centerId === center.id);
      const reviews = db.reviews.filter((review) => review.centerId === center.id);
      return {
        centerId: center.id,
        centerName: center.name,
        bookingCount: bookings.length,
        completedBookingCount: bookings.filter((booking) => booking.status === "completed").length,
        revenue: bookings.reduce((sum, booking) => sum + bookingAmount(booking.id, db), 0),
        averageRating: Number(avg(reviews.map((review) => review.rating)).toFixed(2)),
        documentStatus: centerDocumentStatus(center.id, db),
        isBookable: Boolean(center.isBookable && center.reviewStatus === "approved")
      };
    })
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, limit);
}

export function getStatusDistribution(db: MockDb) {
  return {
    bookingStatus: allBookingStatuses.map((status) => ({ status, count: db.bookings.filter((booking) => booking.status === status).length })),
    paymentStatus: allPaymentStatuses.map((status) => ({ status, count: db.payments.filter((payment) => payment.paymentStatus === status).length })),
    documentStatus: allReviewStatuses.map((status) => ({ status, count: db.documents.filter((doc) => doc.reviewStatus === status).length })),
    reviewRatings: [1, 2, 3, 4, 5].map((rating) => ({ rating, count: db.reviews.filter((review) => review.rating === rating).length }))
  };
}

export function getCameraUsage(db: MockDb) {
  return db.centers
    .map((center) => {
      const feedIds = new Set(db.cameras.filter((camera) => camera.centerId === center.id).map((camera) => camera.id));
      return {
        centerId: center.id,
        centerName: center.name,
        cameraViewCount: db.cameraAccessLogs.filter((log) => feedIds.has(log.cameraFeedId)).length
      };
    })
    .sort((a, b) => b.cameraViewCount - a.cameraViewCount);
}

export function getActionItems(db: MockDb) {
  const now = new Date();
  const next30 = new Date(now.getTime() + 30 * 86400000);
  return {
    pendingCenterReviews: db.centers.filter((center) => center.reviewStatus === "pending"),
    pendingDocumentReviews: db.documents.filter((doc) => doc.reviewStatus === "pending"),
    expiringDocuments: db.documents.filter((doc) => new Date(doc.validUntil) >= now && new Date(doc.validUntil) <= next30),
    expiredDocuments: db.documents.filter((doc) => doc.reviewStatus === "expired" || new Date(doc.validUntil) < now),
    pendingStaffReviews: db.staff.filter((staff) => staff.reviewStatus === "pending"),
    pendingCameraReviews: db.cameras.filter((camera) => camera.reviewStatus === "pending"),
    openIncidents: db.incidents.filter((incident) => incident.status === "open"),
    failedPayments: db.payments.filter((payment) => payment.paymentStatus === "failed"),
    refundPending: db.payments.filter((payment) => payment.paymentStatus === "refunded")
  };
}

export function getRecentBookings(db: MockDb, limit = 10) {
  return [...db.bookings]
    .sort((a, b) => (b.createdAt ?? b.startTime).localeCompare(a.createdAt ?? a.startTime))
    .slice(0, limit)
    .map((booking) => ({
      id: booking.id,
      createdAt: booking.createdAt ?? booking.startTime,
      parentName: db.parents.find((parent) => parent.id === booking.parentUserId)?.name ?? "未知家長",
      childName: db.children.find((child) => child.id === booking.childProfileId)?.name ?? "未知孩子",
      centerName: db.centers.find((center) => center.id === booking.centerId)?.name ?? "未知機構",
      status: booking.status,
      amount: booking.finalAmount ?? booking.estimatedAmount,
      paymentStatus: db.payments.find((payment) => payment.bookingId === booking.id)?.paymentStatus ?? "pending"
    }));
}

function monthBuckets(months: number) {
  const now = new Date();
  return Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return { key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`, start, end };
  });
}

function centerDocumentStatus(centerId: string, db: MockDb) {
  const docs = db.documents.filter((doc) => doc.centerId === centerId);
  if (docs.some((doc) => doc.reviewStatus === "expired" || new Date(doc.validUntil) < new Date())) return "expired";
  if (docs.some((doc) => doc.reviewStatus === "pending")) return "pending";
  if (docs.some((doc) => doc.reviewStatus === "needs_revision")) return "needs_revision";
  return docs.length ? "approved" : "missing";
}
