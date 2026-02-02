"use server";

import { getServerSession } from "next-auth";
import { db } from "@/app/_lib/prisma";
import { authOptions } from "@/app/_lib/auth";

export interface CreateBookingParams {
  serviceId: string;
  barbeShopId: string;
  appointmentDate: Date;
}

export async function createBooking(
  params: CreateBookingParams,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | null)?.id;

    if (!userId) {
      return { ok: false, message: "Para agendar, você precisa estar logado." };
    }

    const { serviceId, barbeShopId, appointmentDate } = params;

    // ✅ trava por código (evita duplicar o mesmo horário)
    const exists = await db.booking.findFirst({
      where: {
        serviceId,
        appointmentDate,
      },
      select: { id: true },
    });

    if (exists) {
      return { ok: false, message: "Horário já reservado." };
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
  } catch (err) {
    console.error("createBooking failed", err);
    if (err instanceof Error && err.message) {
      return { ok: false, message: err.message };
    }
    return { ok: false, message: "Não foi possível criar a reserva." };
  }
}
