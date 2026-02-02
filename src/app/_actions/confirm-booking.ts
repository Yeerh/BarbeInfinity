"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";

export async function confirmBooking(formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | null)?.role;

  if (!session?.user?.id || role !== "ADMIN") {
    return;
  }

  const bookingId = String(formData.get("bookingId") || "");
  if (!bookingId) {
    return;
  }

  await db.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMADO" },
  });

  revalidatePath("/admin/bookings");
  revalidatePath("/bookings");

  return;
}
