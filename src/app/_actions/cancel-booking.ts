"use server";

import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function cancelBooking(bookingId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Não autorizado.");
  }

  const userId = (session.user as unknown as { id?: string }).id;
  if (!userId) {
    throw new Error("Não autorizado.");
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, userId: true, status: true },
  });

  if (!booking) {
    throw new Error("Reserva não encontrada.");
  }

  if (booking.userId !== userId) {
    throw new Error("Você não pode cancelar essa reserva.");
  }

  // opcional: não deixa cancelar finalizado
  if (booking.status === "FINALIZADO") {
    throw new Error("Não é possível cancelar uma reserva finalizada.");
  }

  await db.booking.delete({
    where: { id: bookingId },
  });

  return { ok: true };
}
