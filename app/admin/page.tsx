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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight sm:text-2xl">Patients</h1>
        <Link href="/admin/patients/new" className="btn-primary w-full sm:w-auto text-center">
          New patient
        </Link>
      </div>
      <div className="mt-6 sm:mt-8 card overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[640px] px-4 sm:px-0">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-3 py-3 sm:px-5 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Name
                  </th>
                  <th className="px-3 py-3 sm:px-5 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>
                  <th className="px-3 py-3 sm:px-5 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Next upcoming appointment
                  </th>
                  <th className="px-3 py-3 sm:px-5 sm:py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((user) => {
                  const occurrences = expandAppointments(
                    user.appointments.map((appt) => ({
                      id: appt.id,
                      provider: appt.provider,
                      datetime: appt.datetime,
                      repeat: appt.repeat,
                      endDate: appt.endDate,
                    })),
                    NOW,
                    IN_3_MONTHS
                  );
                  const nextApp = occurrences[0] ?? null;
                  return (
                    <tr key={user.id} className="transition-colors hover:bg-primary-50/30">
                      <td className="whitespace-nowrap px-3 py-3 sm:px-5 sm:py-4 text-sm font-medium text-slate-900">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 sm:px-5 sm:py-4 text-sm text-slate-600">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 sm:px-5 sm:py-4 text-sm text-slate-600">
                        {nextApp ? formatDateTime(nextApp.datetime) : "—"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 sm:px-5 sm:py-4 text-right text-sm">
                        <Link
                          href={`/admin/patients/${user.id}`}
                          className="link-primary inline-block py-2"
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
      </div>
    </div>
  );
}
