// src/app/bookings/page.tsx
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";

import Header from "../_components/header";
import BookingItem from "../_components/booking-intem";
import { db } from "../_lib/prisma";
import { authOptions } from "../api/auth/[...nextauth]/route";

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: { service: true; barbeShop: true };
}>;

const BookingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return notFound();
  }

  // Tipando o id do user sem "any"
  const userId = (session.user as unknown as { id?: string }).id;

  if (!userId) {
    return notFound();
  }

  // ✅ bookings existe ANTES do return
  const bookings: BookingWithRelations[] = await db.booking.findMany({
    where: { userId },
    orderBy: { appointmentDate: "desc" },
    include: {
      service: true,
      barbeShop: true,
    },
  });

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
