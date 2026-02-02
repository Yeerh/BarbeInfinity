// src/app/bookings/page.tsx
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import Header from "../_components/header";
import BookingItem from "../_components/booking-intem";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";

const BookingsPage = async () => {
  const session = await getServerSession(authOptions);

  // bloqueia se não logado
  if (!session?.user?.id) return notFound();

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
