"use server";

import { db } from "@/app/_lib/prisma";

export interface CreateBookingParams {
  userId: string;
  serviceId: string;
  barbeShopId: string;
  appointmentDate: Date;
}

export async function createBooking(params: CreateBookingParams) {
  const { userId, serviceId, barbeShopId, appointmentDate } = params;

  // ✅ trava por código (evita duplicar o mesmo horário)
  const exists = await db.booking.findFirst({
    where: {
      serviceId,
      appointmentDate,
    },
    select: { id: true },
  });

  if (exists) {
    throw new Error("Horário já reservado.");
  }

  await db.booking.create({
    data: {
      userId,
      serviceId,
      barbeShopId,
      appointmentDate,
      // status: "PENDENTE", // se tiver status no schema
    },
  });

  return { ok: true };
}
