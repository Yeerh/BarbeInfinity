// src/app/bookings/page.tsx
import { getServerSession } from "next-auth";

import Header from "../_components/header";
import BookingItem from "../_components/booking-intem";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";

const BookingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <>
        <Header />
        <div className="p-5">
          <h1 className="text-xl font-bold">Agendamentos</h1>
          <p className="mt-3 text-sm text-gray-400">
            Para ver seus agendamentos, você precisa estar logado em uma conta.
          </p>
        </div>
      </>
    );
  }

  const userId = session.user.id;

  const bookings = await db.booking.findMany({
    where: { userId },
    orderBy: { appointmentDate: "desc" },
    include: {
      service: true,
      barbeShop: true,
    },
  });
  type BookingWithRelations = Awaited<typeof bookings>[number];

  return (
    <>
      <Header />

      <div className="p-5">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        <div className="mt-4 flex flex-col gap-3">
          {bookings.map((booking: BookingWithRelations) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </>
  );
};

export default BookingsPage;


