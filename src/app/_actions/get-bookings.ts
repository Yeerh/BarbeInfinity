"use server";

import { startOfDay, endOfDay } from "date-fns";
import type { Prisma } from "@prisma/client";
import { db } from "@/app/_lib/prisma";

export interface GetBookingsParams {
  serviceId: string;
  date: Date;
}

export type DayBooking = {
  appointmentDate: string; // ISO
};

export async function getBookings(params: GetBookingsParams): Promise<DayBooking[]> {
  const { serviceId, date } = params;

  const bookings = (await db.booking.findMany({
    where: {
      serviceId,
      appointmentDate: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
      // ✅ se você usa status, pode filtrar aqui
      // status: { in: ["PENDENTE", "CONFIRMADO"] },
    },
    select: {
      appointmentDate: true,
    },
  })) as Prisma.BookingGetPayload<{
    select: { appointmentDate: true };
  }>[];

  return bookings.map((b) => ({
    appointmentDate: b.appointmentDate.toISOString(),
  }));
}
