import Link from "next/link";
import { prisma } from "@/lib/db";
import { expandAppointments } from "@/lib/appointments";

export const dynamic = "force-dynamic";

const NOW = new Date();
const IN_3_MONTHS = new Date(NOW.getTime() + 90 * 24 * 60 * 60 * 1000);

function formatDateTime(d: Date) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminPatientsPage() {
  const users = await prisma.user.findMany({
    include: {
      appointments: { orderBy: { datetime: "asc" } },
      prescriptions: { orderBy: { refillOn: "asc" } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patients</h1>
        <Link href="/admin/patients/new" className="btn-primary">
          New patient
        </Link>
      </div>
      <div className="mt-8 card overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/80">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Name
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Next upcoming appointment
              </th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {users.map((u) => {
              const occurrences = expandAppointments(
                u.appointments.map((a) => ({
                  id: a.id,
                  provider: a.provider,
                  datetime: a.datetime,
                  repeat: a.repeat,
                  endDate: a.endDate,
                })),
                NOW,
                IN_3_MONTHS
              );
              const nextApp = occurrences[0] ?? null;
              return (
                <tr key={u.id} className="transition-colors hover:bg-primary-50/30">
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-900">
                    {u.name}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                    {u.email}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                    {nextApp ? formatDateTime(nextApp.datetime) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right text-sm">
                    <Link
                      href={`/admin/patients/${u.id}`}
                      className="link-primary"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
