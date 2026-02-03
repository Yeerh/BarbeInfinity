// src/app/_actions/confirm-user-booking.ts
"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";

export async function confirmUserBooking(bookingId: string) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | null)?.id;

  if (!userId) throw new Error("Unauthorized");

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, userId: true, status: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.userId !== userId) throw new Error("Forbidden");

  if (booking.status === "CANCELADO") {
    throw new Error("Nao e possivel confirmar uma reserva cancelada.");
  }

  if (booking.status === "FINALIZADO") {
    throw new Error("Nao e possivel confirmar uma reserva finalizada.");
  }

  if (booking.status === "CONFIRMADO") {
    return;
  }

  await db.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMADO" },
  });

  revalidatePath("/");
  revalidatePath("/bookings");
}
