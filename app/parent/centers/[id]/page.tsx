import { seedData } from "@/lib/mockData";
import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return seedData.centers.map((center) => ({ id: center.id }));
}

export default function CenterDetailPage() {
  return <ClientPage />;
}
