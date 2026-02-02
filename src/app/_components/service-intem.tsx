"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ptBR } from "date-fns/locale";
import { addMinutes, format, isBefore, startOfDay } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { createBooking } from "@/app/_actions/create-booking";
import { getBookings } from "@/app/_actions/get-bookings";
import type { DayBooking } from "@/app/_actions/get-bookings";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Calendar } from "./ui/calendar";

interface ServiceIntemProps {
  service: {
    id: string;
    barbeShopId: string;
    name: string;
    description?: string | null;
    price: number | string | { toString(): string };
    durationInMinutes: number;
    imageUrl?: string | null;
  };
}

const OPEN_TIME = "08:00";
const CLOSE_TIME = "20:00";

function generateTimeSlots(
  date: Date,
  openTime: string,
  closeTime: string,
  intervalMinutes: number,
) {
  const [oh, om] = openTime.split(":").map(Number);
  const [ch, cm] = closeTime.split(":").map(Number);

  const start = new Date(date);
  start.setHours(oh, om, 0, 0);

  const end = new Date(date);
  end.setHours(ch, cm, 0, 0);

  const slots: string[] = [];
  let cur = start;

  while (isBefore(cur, end) || cur.getTime() === end.getTime()) {
    slots.push(format(cur, "HH:mm"));
    cur = addMinutes(cur, intervalMinutes);
  }

  return slots;
}

function buildAppointmentDate(date: Date, time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

function dayKey(date: Date) {
  return format(startOfDay(date), "yyyy-MM-dd");
}

const ServiceIntem = ({ service }: ServiceIntemProps) => {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | null>(null);
  const [dayBookings, setDayBookings] = useState<DayBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [hiddenTimesByDay, setHiddenTimesByDay] = useState<
    Record<string, Record<string, true>>
  >({});

  const canConfirm = Boolean(date && time && userId);

  const priceFormatted = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(service.price));

  const interval = useMemo(() => {
    const d = Number(service.durationInMinutes);
    return Number.isFinite(d) && d > 0 ? d : 30;
  }, [service.durationInMinutes]);

  const timeSlots = useMemo(() => {
    if (!date) return [];
    return generateTimeSlots(date, OPEN_TIME, CLOSE_TIME, interval);
  }, [date, interval]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!date) {
        setDayBookings([]);
        return;
      }

      try {
        setIsLoadingBookings(true);
        const bookings = await getBookings({ serviceId: service.id, date });
        setDayBookings(bookings);
      } catch (e) {
        console.error(e);
        setDayBookings([]);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [date, service.id]);

  const bookedTimes = useMemo(() => {
    const set = new Set<string>();
    for (const b of dayBookings) {
      const ap = new Date(b.appointmentDate);
      set.add(format(ap, "HH:mm"));
    }
    return set;
  }, [dayBookings]);

  const hiddenTimes = useMemo(() => {
    if (!date) return new Set<string>();
    const key = dayKey(date);
    const map = hiddenTimesByDay[key] ?? {};
    return new Set(Object.keys(map));
  }, [date, hiddenTimesByDay]);

  useEffect(() => {
    setTime(null);
  }, [date]);

  const handleCreateBooking = async () => {
    if (!date || !time) return;

    if (!userId) {
      toast.error("Você precisa estar logado para reservar.");
      return;
    }

    if (bookedTimes.has(time) || hiddenTimes.has(time)) {
      toast.error("Esse horário já foi reservado. Escolha outro.");
      return;
    }

    const selectedTime = time;
    const appointmentDate = buildAppointmentDate(date, selectedTime);

    const key = dayKey(date);

    // ✅ some imediatamente
    setHiddenTimesByDay((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? {}), [selectedTime]: true },
    }));
    setTime(null);

    try {
      setIsLoading(true);

      await createBooking({
        userId,
        serviceId: service.id,
        barbeShopId: service.barbeShopId,
        appointmentDate,
      });

      const refreshed = await getBookings({ serviceId: service.id, date });
      setDayBookings(refreshed);

      toast.success("Reserva criada com sucesso!");
    } catch (err) {
      console.error(err);

      // ❌ desfaz o “sumir”
      setHiddenTimesByDay((prev) => {
        const copy = { ...prev };
        const dayMap = { ...(copy[key] ?? {}) };
        delete dayMap[selectedTime];
        copy[key] = dayMap;
        return copy;
      });

      toast.error("Não foi possível criar a reserva.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div className="relative h-[110px] w-[110px] shrink-0 overflow-hidden rounded-lg">
          <Image
            src={service.imageUrl ?? "/placeholder.png"}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <h3 className="font-semibold">{service.name}</h3>

          <p className="line-clamp-2 text-sm text-gray-400">
            {service.description ?? "Sem descrição"}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-primary">{priceFormatted}</p>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" size="sm">
                  Reservar
                </Button>
              </SheetTrigger>

              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Fazer Reserva</SheetTitle>
                </SheetHeader>

                {!userId && (
                  <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                    Para agendar, você precisa estar logado em uma conta.
                  </p>
                )}

                <div className="border-b border-solid py-5">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => setDate(d)}
                    locale={ptBR}
                  />

                  {date && (
                    <p className="mt-4 text-sm text-gray-400">
                      Data selecionada:{" "}
                      <span className="font-semibold text-white">
                        {date.toLocaleDateString("pt-BR")}
                      </span>
                    </p>
                  )}
                </div>

                <div className="py-5">
                  <p className="mb-3 text-xs font-bold uppercase text-gray-400">
                    Horários ({interval} min)
                  </p>

                  {isLoadingBookings && (
                    <p className="mb-3 text-sm text-gray-400">Carregando horários...</p>
                  )}

                  {!date && (
                    <p className="text-sm text-gray-400">
                      Selecione uma data para ver os horários.
                    </p>
                  )}

                  {!!date && (
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots
                        .filter((t) => !bookedTimes.has(t) && !hiddenTimes.has(t))
                        .map((t) => (
                          <Button
                            key={t}
                            type="button"
                            variant={time === t ? "default" : "outline"}
                            onClick={() => setTime(t)}
                          >
                            {t}
                          </Button>
                        ))}
                    </div>
                  )}

                  {date &&
                    timeSlots.filter((t) => !bookedTimes.has(t) && !hiddenTimes.has(t))
                      .length === 0 && (
                      <p className="mt-3 text-sm text-gray-400">
                        Nenhum horário disponível para esse dia.
                      </p>
                    )}

                  {time && (
                    <p className="mt-4 text-sm text-gray-400">
                      Horário selecionado:{" "}
                      <span className="font-semibold text-white">{time}</span>
                    </p>
                  )}
                </div>

                {canConfirm && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col">
                          <h2 className="text-sm font-semibold">{service.name}</h2>
                          <p className="text-xs text-gray-400">
                            {date!.toLocaleDateString("pt-BR")} • {time}
                          </p>
                        </div>

                        <p className="text-sm font-bold text-primary">{priceFormatted}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  className="w-full"
                  disabled={!canConfirm || isLoading}
                  onClick={handleCreateBooking}
                >
                  {isLoading ? "Salvando..." : "Confirmar reserva"}
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceIntem;
