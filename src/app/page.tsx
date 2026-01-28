// src/app/page.tsx
import Header from "./_components/header";
import Search from "./_components/search";
import { Button } from "./_components/ui/button";
import { Input } from "./_components/ui/input";
import { Card, CardContent } from "./_components/ui/card";

import { quickSearchOptions } from "./_constants/search";
import BarbeShopIntem from "./_components/barbershop-intem";
import BookingItem from "./_components/booking-intem";

import Image from "next/image";
import { SearchIcon } from "lucide-react";
import { db } from "./_lib/prisma";
const Home = async () => {
  const [barbeShops, popularBarbeShops] = await Promise.all([
    db.barbeShop.findMany(),
    db.barbeShop.findMany({ orderBy: { name: "desc" } }),
  ]);

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

  return (
    <div>
      <Header />

      <div className="p-5">
        <h2 className="text-xl font-bold">Olá</h2>
        <p className="capitalize">{formattedDate}</p>

        {/* Busca */}
      <div className="mt-6">
      <Search></Search>
      </div>

        {/* Quick Search */}
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button
              key={option.label}
              className="shrink-0 gap-2"
              variant="secondary"
              title={option.title ?? option.label}
            >
              <Image
                src={option.imageUrl}
                width={16}
                height={16}
                alt={option.label}
              />
              {option.label}
            </Button>
          ))}
        </div>

        {/* Banner */}
        <div className="relative mt-4 h-[150px] w-full overflow-hidden rounded-md">
          <Image
            src="/banner.png"
            alt="Banner InfinityBarber"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Agendamentos */}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Agendamentos
        </h2>

        <BookingItem
          serviceName="Corte de Cabelo"
          barberShopName="Barbearia Infinity"
          barberShopImage="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"
          status="Confirmado"
          month="Agosto"
          day="27"
          time="20:00"
        />

        {/* Recomendados */}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Recomendados
        </h2>

        <div className="-mr-5 flex gap-4 overflow-x-auto pb-2 pr-5 [&::-webkit-scrollbar]:hidden">
          {barbeShops.map((shop) => (
            <BarbeShopIntem key={shop.id} barbeShop={shop} />
          ))}
        </div>

        {/* Populares */}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Populares
        </h2>

        <div className="-mr-5 flex gap-4 overflow-x-auto pb-2 pr-5 [&::-webkit-scrollbar]:hidden">
          {popularBarbeShops.map((shop) => (
            <BarbeShopIntem key={shop.id} barbeShop={shop} />
          ))}
        </div>

        {/* Footer */}
        <Card className="mt-6">
          <CardContent className="px-5 py-6">
            2026 Copyright Infinity Web
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
