import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminPatientDetail } from "@/app/admin/patients/[id]/AdminPatientDetail";

export const dynamic = "force-dynamic";

export default async function AdminPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      appointments: { orderBy: { datetime: "asc" } },
      prescriptions: { orderBy: { refillOn: "asc" } },
    },
  });
  if (!user) notFound();

  return (
    <div>
      <Link href="/admin" className="link-primary text-sm">
        ← Back to patients
      </Link>
      <AdminPatientDetail
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          appointments: user.appointments.map((a: { id: string; provider: string; datetime: Date; repeat: string; endDate: Date | null }) => ({
            id: a.id,
            provider: a.provider,
            datetime: a.datetime.toISOString(),
            repeat: a.repeat,
            endDate: a.endDate?.toISOString() ?? null,
          })),
          prescriptions: user.prescriptions.map((p: { id: string; medication: string; dosage: string; quantity: number; refillOn: Date; refillSchedule: string; endDate: Date | null }) => ({
            id: p.id,
            medication: p.medication,
            dosage: p.dosage,
            quantity: p.quantity,
            refillOn: p.refillOn.toISOString().slice(0, 10),
            refillSchedule: p.refillSchedule,
            endDate: p.endDate ? p.endDate.toISOString().slice(0, 10) : null,
          })),
        }}
      />
    </div>
  );
}
