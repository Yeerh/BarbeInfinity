"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { cancelBooking } from "@/app/_actions/cancel-booking";

import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { PhoneIcon } from "lucide-react";
import { toast } from "sonner";

type BookingWithRelations = {
  id: string;
  appointmentDate: Date | string;
  status: BookingStatus;
  service: {
    name: string;
    price: number | string | { toString(): string };
  };
  barbeShop: {
    name: string;
    address: string;
    phone: string;
    imageUrl?: string | null;
  };
};

interface BookingItemProps {
  booking: BookingWithRelations;
}

const BOOKING_STATUS = {
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  FINALIZADO: "FINALIZADO",
  CANCELADO: "CANCELADO",
} as const;

type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

const statusLabelMap: Record<BookingStatus, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};

const statusVariantMap: Record<
  BookingStatus,
  "default" | "secondary" | "outline"
> = {
  PENDENTE: "outline",
  CONFIRMADO: "default",
  FINALIZADO: "secondary",
  CANCELADO: "secondary",
};

function parsePhones(raw?: string | null) {
  if (!raw) return [];
  return raw
    .split(/[\n,;|]+/g)
    .map((p) => p.trim())
    .filter(Boolean);
}

function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return phone;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const date = new Date(booking.appointmentDate);

  const month = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(date);
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date);
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  const phones = parsePhones(booking.barbeShop.phone);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("Copie o número:", text);
    }
  };

  const handleCancel = async () => {
    if (
      booking.status === BOOKING_STATUS.FINALIZADO ||
      booking.status === BOOKING_STATUS.CANCELADO
    ) {
      return;
    }

    const ok = window.confirm("Tem certeza que deseja cancelar essa reserva?");
    if (!ok) return;

    try {
      setIsCancelling(true);
      await cancelBooking(booking.id);
      toast.success("Reserva cancelada com sucesso.");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível cancelar a reserva.";
      toast.error(message);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button type="button" className="w-full text-left">
          <Card className="cursor-pointer hover:opacity-95">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex flex-col gap-2">
                <Badge variant={statusVariantMap[booking.status]}>
                  {statusLabelMap[booking.status]}
                </Badge>

                <h3 className="font-semibold">{booking.service.name}</h3>

                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={booking.barbeShop.imageUrl ?? ""} />
                    <AvatarFallback>
                      {booking.barbeShop.name?.[0] ?? "B"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm">{booking.barbeShop.name}</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center border-l-2 border-gray-200/20 pl-4 text-right leading-tight">
                <p className="text-sm capitalize">{month}</p>
                <p className="text-2xl font-bold">{day}</p>
                <p className="text-sm">{time}</p>
              </div>
            </CardContent>
          </Card>
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="p-0">
        <div className="p-5">
          <SheetHeader>
            <SheetTitle className="text-left">Detalhes do agendamento</SheetTitle>
          </SheetHeader>
        </div>

        <div className="px-5">
          <div className="relative h-[170px] w-full overflow-hidden rounded-2xl">
            <Image
              src="/map.png"
              alt="Mapa"
              fill
              className="object-cover opacity-90"
              priority
            />
            <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={booking.barbeShop.imageUrl ?? ""} />
                  <AvatarFallback>
                    {booking.barbeShop.name?.[0] ?? "B"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-base font-semibold">
                    {booking.barbeShop.name}
                  </p>
                  <p className="truncate text-xs text-gray-300">
                    {booking.barbeShop.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <Badge variant={statusVariantMap[booking.status]} className="mb-4">
            {statusLabelMap[booking.status]}
          </Badge>

          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold">{booking.service.name}</h3>
                <p className="text-base font-semibold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(booking.service.price))}
                </p>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Data</p>
                  <p className="font-medium">
                    {date.toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Horário</p>
                  <p className="font-medium">{time}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Barbearia</p>
                  <p className="font-medium">{booking.barbeShop.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {booking.status !== BOOKING_STATUS.FINALIZADO &&
            booking.status !== BOOKING_STATUS.CANCELADO && (
              <Button
                type="button"
                variant="destructive"
                className="mt-4 w-full"
                disabled={isCancelling}
                onClick={handleCancel}
              >
                {isCancelling ? "Cancelando..." : "Cancelar reserva"}
              </Button>
            )}

          {phones.length > 0 && (
            <div className="mt-4 space-y-3">
              {phones.map((p) => (
                <div
                  key={p}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                      <PhoneIcon size={18} />
                    </div>
                    <p className="text-sm">{formatPhoneDisplay(p)}</p>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-xl"
                    onClick={() => handleCopy(p)}
                  >
                    Copiar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem;
