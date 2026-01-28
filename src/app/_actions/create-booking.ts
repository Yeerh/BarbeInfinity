"use server";

import { db } from "@/app/_lib/prisma";

export interface CreateBookingParams {
  userId: string;
  serviceId: string;
  barbeShopId: string;
  appointmentDate: Date; // data + hora final
}

export async function createBooking(params: CreateBookingParams) {
  const { userId, serviceId, barbeShopId, appointmentDate } = params;

  if (!userId || !serviceId || !barbeShopId || !appointmentDate) {
    throw new Error("Parâmetros inválidos para criar o agendamento.");
  }

  const booking = await db.booking.create({
    data: {
      userId,
      serviceId,
      barbeShopId,
      appointmentDate,
      date: new Date(), // campo "date" do seu schema (se for "createdAt", dá pra remover)
    },
  });

  return booking;
}
