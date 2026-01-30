"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { cancelBooking } from "@/app/_actions/cancel-booking";

import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { PhoneIcon, XCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";

import { toast } from "sonner";

type BookingStatus = "PENDENTE" | "CONFIRMADO" | "FINALIZADO";

type BookingWithRelations = {
  id: string;
  status: BookingStatus;
  appointmentDate: Date | string;

  service: {
    id: string;
    name: string;
    price: unknown;
  };

  barbeShop: {
    id: string;
    name: string;
    address: string;
    phone: string;
    imageUrl: string | null;
  };
};

interface BookingItemProps {
  booking: BookingWithRelations;
}

const statusLabelMap: Record<BookingStatus, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  FINALIZADO: "Finalizado",
};

const statusVariantMap: Record<
  BookingStatus,
  "default" | "secondary" | "outline"
> = {
  PENDENTE: "outline",
  CONFIRMADO: "default",
  FINALIZADO: "secondary",
};

function formatBRL(value: unknown) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

function parsePhones(raw?: string | null) {
  if (!raw) return [];
  return raw
    .split(/[\n,;|]+/g)
    .map((p) => p.trim())
    .filter(Boolean);
}

function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export default function BookingItem({ booking }: BookingItemProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const date = useMemo(() => new Date(booking.appointmentDate), [booking]);

  const month = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(date);
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date);

  const timeLabel = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  const statusLabel = statusLabelMap[booking.status];
  const statusVariant = statusVariantMap[booking.status];

  const serviceName = booking.service.name;
  const price = formatBRL(booking.service.price);

  const barberName = booking.barbeShop.name;
  const barberAddress = booking.barbeShop.address;
  const barberImage = booking.barbeShop.imageUrl ?? "";
  const phones = parsePhones(booking.barbeShop.phone);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Número copiado!");
    } catch {
      window.prompt("Copie o número:", text);
    }
  };

  const doCancel = async () => {
    if (booking.status === "FINALIZADO") {
      toast.message("Esse agendamento já foi finalizado.");
      return;
    }

    try {
      setIsCancelling(true);
      await cancelBooking(booking.id);

      toast.success("Reserva cancelada com sucesso!");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível cancelar a reserva.");
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
                <Badge variant={statusVariant}>{statusLabel}</Badge>

                <h3 className="font-semibold">{serviceName}</h3>

                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={barberImage} />
                    <AvatarFallback>{barberName?.[0] ?? "B"}</AvatarFallback>
                  </Avatar>

                  <p className="text-sm">{barberName}</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center border-l-2 border-gray-200/20 pl-4 text-right leading-tight">
                <p className="text-sm capitalize">{month}</p>
                <p className="text-2xl font-bold">{day}</p>
                <p className="text-sm">{timeLabel}</p>
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

        {/* MAP */}
        <div className="px-5">
          <div className="relative h-[170px] w-full overflow-hidden rounded-2xl">
            <Image
              src="/map.png"
              alt="Mapa"
              fill
              className="object-cover opacity-90"
              priority
            />

            <div className="absolute bottom-3 left-3 right-3">
              <Card className="border-white/10 bg-black/50 backdrop-blur-md">
                <CardContent className="flex items-center gap-3 p-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={barberImage} />
                    <AvatarFallback>{barberName?.[0] ?? "B"}</AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                      {barberName}
                    </p>
                    <p className="truncate text-xs text-gray-300">
                      {barberAddress}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* INFO CARD */}
        <div className="p-5">
          <Badge variant={statusVariant} className="mb-4">
            {statusLabel}
          </Badge>

          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold">{serviceName}</h3>
                <p className="text-base font-semibold">{price}</p>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Data</p>
                  <p className="font-medium">
                    {day} de {month}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Horário</p>
                  <p className="font-medium">{timeLabel}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Barbearia</p>
                  <p className="font-medium">{barberName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CANCELAR COM DIALOG */}
          {booking.status !== "FINALIZADO" && (
            <div className="mt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    disabled={isCancelling}
                  >
                    <XCircle className="mr-2" size={18} />
                    Cancelar reserva
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancelar reserva?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja cancelar? Isso vai liberar o horário
                      para outras pessoas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={doCancel}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isCancelling ? "Cancelando..." : "Sim, cancelar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          {/* PHONES */}
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
}
