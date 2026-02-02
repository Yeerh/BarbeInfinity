"use server";

import { getServerSession } from "next-auth";
import { db } from "@/app/_lib/prisma";
import { authOptions } from "@/app/_lib/auth";

export interface CreateBookingParams {
  serviceId: string;
  barbeShopId?: string;
  appointmentDate: string;
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

    const { serviceId, appointmentDate } = params;
    if (!serviceId) {
      return { ok: false, message: "Serviço inválido." };
    }
    const appointmentDateObj = new Date(appointmentDate);
    if (Number.isNaN(appointmentDateObj.getTime())) {
      return { ok: false, message: "Data inválida para o agendamento." };
    }

    // ✅ trava por código (evita duplicar o mesmo horário)
    const exists = await db.booking.findFirst({
      where: {
        serviceId,
        appointmentDate: appointmentDateObj,
      },
      select: { id: true },
    });

    if (exists) {
      return { ok: false, message: "Horário já reservado." };
    }

    const service = await db.barbeShopService.findUnique({
      where: { id: serviceId },
      select: { barbeShopId: true },
    });

    if (!service?.barbeShopId) {
      return { ok: false, message: "Serviço ou barbearia inválidos." };
    }

    await db.booking.create({
      data: {
        userId,
        serviceId,
        barbeShopId: service.barbeShopId,
        appointmentDate: appointmentDateObj,
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
