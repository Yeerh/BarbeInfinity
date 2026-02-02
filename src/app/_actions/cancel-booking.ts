// src/app/_actions/cancel-booking.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { BookingStatus } from "@prisma/client";
import { db } from "@/app/_lib/prisma";

export async function cancelBooking(bookingId: string) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | null)?.id;

  if (!userId) throw new Error("Unauthorized");

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, userId: true, status: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.userId !== userId) throw new Error("Forbidden");

  if (booking.status === BookingStatus.FINALIZADO) {
    throw new Error("Não é possível cancelar uma reserva finalizada.");
  }

  await db.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.PENDENTE }, // ou você pode criar CANCELADO se quiser
  });

  // Se você quer realmente "liberar horário" removendo do banco:
  // await db.booking.delete({ where: { id: bookingId } });
}
