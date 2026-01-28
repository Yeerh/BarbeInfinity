"use server";

import { db } from "@/app/_lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

interface GetBookingsProps {
  serviceId: string;
  date: Date;
}

export async function getBookings({ serviceId, date }: GetBookingsProps) {
  if (!serviceId || !date) {
    throw new Error("serviceId e date são obrigatórios.");
  }

  const bookings = await db.booking.findMany({
    where: {
      serviceId,
      appointmentDate: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    },
    orderBy: {
      appointmentDate: "asc",
    },
  });

  return bookings;
}
