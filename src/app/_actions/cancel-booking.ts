"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";

export async function cancelBooking(bookingId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Não autenticado.");
  }

  const userId = (session.user as unknown as { id?: string }).id;

  if (!userId) {
    throw new Error("Usuário inválido.");
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, userId: true }, // ✅ sem status
  });

  if (!booking) {
    throw new Error("Reserva não encontrada.");
  }

  if (booking.userId !== userId) {
    throw new Error("Sem permissão para cancelar essa reserva.");
  }

  // ✅ como você não tem status no schema, o cancelamento é deletar
  await db.booking.delete({
    where: { id: bookingId },
  });

  return { ok: true };
}
