export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "in_care"
  | "ready_pickup"
  | "completed"
  | "cancelled"
  | "no_show";

export type ReviewStatus = "pending" | "approved" | "rejected" | "needs_revision" | "expired" | "suspended";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "credit_card" | "transfer" | "line_pay" | "cash" | "mock";
export type ServiceType = "temporary" | "reservation" | "emergency";
export type CareStatusType = "arrived" | "activity" | "snack" | "emotional" | "incident" | "ready_pickup";
export type IncidentStatus = "open" | "investigating" | "resolved";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export type ParentUser = {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
};

export type ChildProfile = {
  id: string;
  parentUserId: string;
  name: string;
  age: number;
  schoolName: string;
  className: string;
  schoolLeaveTime: string;
  allergies: string;
  medicalNotes: string;
  comfortNotes: string;
  emergencyContact: { name: string; phone: string; relation: string };
  authorizedPickupPeople: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type StaffProfile = {
  id: string;
  centerId: string;
  name: string;
  title: string;
  qualification: string;
  experienceYears: number;
  bio: string;
  reviewStatus: ReviewStatus;
  isActive: boolean;
};

export type CenterDocument = {
  id: string;
  centerId: string;
  documentType: string;
  documentName: string;
  documentNumber: string;
  issuedBy: string;
  validUntil: string;
  reviewStatus: ReviewStatus;
  fileUrl: string;
};

export type EnvironmentPhoto = {
  id: string;
  centerId: string;
  spaceName: string;
  photoUrl: string;
  description: string;
};

export type ServicePlan = {
  id: string;
  centerId: string;
  name: string;
  serviceType: ServiceType;
  pricePerHour: number;
  minimumMinutes: number;
  maxMinutes: number;
  cancellationPolicy: string;
  overtimePolicy: string;
  isActive: boolean;
};

export type AvailabilitySlot = {
  id: string;
  centerId: string;
  servicePlanId: string;
  startTime: string;
  endTime: string;
  capacity: number;
  remainingCapacity: number;
  status: "open" | "closed";
};

export type CameraFeed = {
  id: string;
  centerId: string;
  spaceName: string;
  feedUrl: string;
  isOpenArea: boolean;
  isActive: boolean;
  reviewStatus: ReviewStatus;
};

export type Center = {
  id: string;
  name: string;
  businessNumber: string;
  registrationNumber: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  description: string;
  reviewStatus: ReviewStatus;
  isBookable?: boolean;
  distanceKm: number;
  openHours: string;
  tags: string[];
  safetyMeasures: string[];
  cameraPolicy: string;
};

export type Booking = {
  id: string;
  parentUserId: string;
  childProfileId: string;
  centerId: string;
  servicePlanId: string;
  startTime: string;
  endTime: string;
  actualCheckinTime?: string;
  actualCheckoutTime?: string;
  status: BookingStatus;
  estimatedAmount: number;
  finalAmount?: number;
  platformFeeAmount?: number;
  providerRevenueAmount?: number;
  commissionRate?: number;
  createdAt?: string;
  updatedAt?: string;
  cancelledAt?: string;
  teacherNoticeText: string;
  checkinCode: string;
};

export type BookingStatusLog = {
  id: string;
  bookingId: string;
  fromStatus: BookingStatus;
  toStatus: BookingStatus;
  changedByRole: "parent" | "provider";
  createdAt: string;
};

export type CareStatusLog = {
  id: string;
  bookingId: string;
  statusType: CareStatusType;
  note: string;
  createdBy: string;
  createdAt: string;
};

export type CameraAccessLog = {
  id: string;
  bookingId: string;
  parentUserId: string;
  cameraFeedId: string;
  accessedAt: string;
  userAgent: string;
};

export type Payment = {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  refundedAmount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Review = {
  id: string;
  bookingId: string;
  parentUserId: string;
  centerId: string;
  rating: number;
  comment: string;
  wouldUseAgain: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin";
  createdAt?: string;
  updatedAt?: string;
};

export type IncidentReport = {
  id: string;
  bookingId?: string;
  centerId: string;
  parentUserId?: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  createdAt: string;
  updatedAt: string;
};

export type MockDb = {
  admins: AdminUser[];
  parents: ParentUser[];
  children: ChildProfile[];
  centers: Center[];
  documents: CenterDocument[];
  staff: StaffProfile[];
  photos: EnvironmentPhoto[];
  servicePlans: ServicePlan[];
  slots: AvailabilitySlot[];
  bookings: Booking[];
  bookingStatusLogs: BookingStatusLog[];
  careLogs: CareStatusLog[];
  cameras: CameraFeed[];
  cameraAccessLogs: CameraAccessLog[];
  payments: Payment[];
  reviews: Review[];
  incidents: IncidentReport[];
};
