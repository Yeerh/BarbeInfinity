import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import Header from "@/app/_components/header";
import { Button } from "@/app/_components/ui/button";
import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import { confirmBooking } from "@/app/_actions/confirm-booking";

const statusLabel: Record<string, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};

const AdminBookingsPage = async () => {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | null)?.role;

  if (!session?.user?.id) {
    redirect("/admin/login");
  }
  if (role !== "ADMIN") {
    return (
      <>
        <Header />
        <div className="p-5">
          <h1 className="text-xl font-bold">Administração</h1>
          <p className="mt-3 text-sm text-gray-400">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </>
    );
  }

  const bookings = await db.booking.findMany({
    orderBy: { appointmentDate: "desc" },
    include: {
      user: true,
      service: true,
      barbeShop: true,
    },
  });

  return (
    <>
      <Header />
      <div className="p-5">
        <h1 className="text-xl font-bold">Agendamentos (Admin)</h1>

        <div className="mt-4 flex flex-col gap-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-400">Cliente</p>
                  <p className="font-semibold">
                    {booking.user?.name ?? "Cliente"}
                  </p>
                  <p className="text-xs text-gray-500">{booking.user?.email}</p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-gray-400">Serviço</p>
                  <p className="font-semibold">{booking.service?.name}</p>
                  <p className="text-xs text-gray-500">
                    {booking.barbeShop?.name}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-gray-400">Data</p>
                  <p className="font-semibold">
                    {new Date(booking.appointmentDate).toLocaleDateString(
                      "pt-BR",
                    )}{" "}
                    ·{" "}
                    {new Date(booking.appointmentDate).toLocaleTimeString(
                      "pt-BR",
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    Status: {statusLabel[booking.status] ?? booking.status}
                  </p>
                </div>
              </div>

              {booking.status === "PENDENTE" && (
                <form action={confirmBooking} className="mt-4">
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <Button type="submit" variant="secondary">
                    Confirmar presença
                  </Button>
                </form>
              )}
            </div>
          ))}

          {bookings.length === 0 && (
            <p className="text-sm text-gray-400">Nenhum agendamento ainda.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminBookingsPage;
