"use server";

import { startOfDay, endOfDay } from "date-fns";
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
  })) as Array<{ appointmentDate: Date }>;

  return bookings.map((b: { appointmentDate: Date }) => ({
    appointmentDate: b.appointmentDate.toISOString(),
  }));
}
