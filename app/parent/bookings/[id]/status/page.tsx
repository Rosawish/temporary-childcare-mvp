import { seedData } from "@/lib/mockData";
import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return seedData.bookings.map((booking) => ({ id: booking.id }));
}

export default function BookingStatusPage() {
  return <ClientPage />;
}
