// src/app/page.tsx
import Header from "./_components/header";
import Search from "./_components/search";
import { Button } from "./_components/ui/button";
import { Card, CardContent } from "./_components/ui/card";

import { quickSearchOptions } from "./_constants/search";
import BarbeShopIntem from "./_components/barbershop-intem";
import BookingItem from "./_components/booking-intem";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Home as HomeIcon, MapPin, Scissors } from "lucide-react";
import { db } from "./_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./_lib/auth";

const Home = async () => {
  const session = await getServerSession(authOptions);

  const [barbeShops, popularBarbeShops] = await Promise.all([
    db.barbeShop.findMany(),
    db.barbeShop.findMany({ orderBy: { name: "desc" } }),
  ]);

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());
  const userName = session?.user?.name?.split(" ")[0];
  const desktopGreeting = userName
    ? `Olá, ${userName}!`
    : "Olá, faça seu login!";

  // ✅ userId seguro (porque session.user.id não vem por padrão no NextAuth)
  const userId = (session?.user as { id?: string } | undefined)?.id;

  // ✅ SOMENTE CONFIRMADOS NA HOME
  const bookings = userId
    ? await db.booking.findMany({
        where: {
          userId,
          status: "CONFIRMADO",
        },
        include: {
          service: true,
          barbeShop: true,
        },
        orderBy: { appointmentDate: "desc" },
        take: 5, // opcional: limita para não lotar a home
      })
    : [];

  return (
    <div>
      <Header />

      {/* Mobile layout (original) */}
      <div className="md:hidden">
        <div className="p-5">
          <h2 className="text-xl font-bold">Olá</h2>
          <p className="capitalize">{formattedDate}</p>

          {/* Busca */}
          <div className="mt-6">
            <Search />
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
            Agendamentos confirmados
          </h2>

          {bookings.length === 0 ? (
            <p className="text-sm text-gray-400">
              {userId
                ? "Você ainda não tem agendamentos confirmados."
                : "Faça login para ver seus agendamentos confirmados."}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {bookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          )}

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
          <Card className="relative mt-8 overflow-hidden border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.2),transparent_55%)]" />
            <CardContent className="relative space-y-6 p-6 pt-6">
              <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <Scissors
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-lg font-semibold tracking-tight">
                        InfinityBarber
                      </p>
                      <p className="text-sm text-gray-400">
                        Agendamentos inteligentes para barbearias modernas.
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-400">
                    Descubra barbearias, organize seus horários e mantenha seu
                    estilo em dia com rapidez.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-300">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Busca rápida
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Agenda clara
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Histórico organizado
                    </span>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Atalhos
                    </p>
                    <div className="mt-3 flex flex-col gap-2 text-sm">
                      <Link
                        className="flex items-center gap-2 text-gray-300 transition hover:text-white"
                        href="/"
                      >
                        <HomeIcon
                          className="h-4 w-4 text-primary/80"
                          aria-hidden="true"
                        />
                        Início
                      </Link>
                      <Link
                        className="flex items-center gap-2 text-gray-300 transition hover:text-white"
                        href="/barbeshops"
                      >
                        <MapPin
                          className="h-4 w-4 text-primary/80"
                          aria-hidden="true"
                        />
                        Barbearias
                      </Link>
                      <Link
                        className="flex items-center gap-2 text-gray-300 transition hover:text-white"
                        href="/bookings"
                      >
                        <Calendar
                          className="h-4 w-4 text-primary/80"
                          aria-hidden="true"
                        />
                        Agendamentos
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Central do cliente
                    </p>
                    <p className="mt-3 text-sm text-gray-300">
                      Acompanhe seus agendamentos e detalhes do serviço em um só
                      lugar.
                    </p>
                    <Button asChild className="mt-4 w-full" variant="secondary">
                      <Link href="/bookings">Ver meus agendamentos</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {new Date().getFullYear()} &copy; InfinityBarber. Todos os
                  direitos reservados.
                </span>
                <span>Feito para barbearias que valorizam tempo e estilo.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Desktop layout (new structure) */}
      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-screen-xl px-8 pb-12 pt-6 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
            <div>
              <h2 className="text-2xl font-bold">{desktopGreeting}</h2>
              <p className="capitalize text-gray-300">{formattedDate}</p>

              {/* Busca */}
              <Search />

              {/* Quick Search */}
              <div className="mt-4 flex flex-wrap gap-3">
                {quickSearchOptions.map((option) => (
                  <Button
                    key={option.label}
                    className="gap-2"
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

              {/* Banner (desktop) */}
              <div className="relative mt-6 hidden h-[220px] w-full overflow-hidden rounded-2xl lg:block">
                <Image
                  src="/banner.png"
                  alt="Banner InfinityBarber"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div>
              {/* Recomendados */}
              <h2 className="mb-4 text-xs font-bold uppercase text-gray-400">
                Recomendados
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {barbeShops.map((shop) => (
                  <BarbeShopIntem key={shop.id} barbeShop={shop} />
                ))}
              </div>
            </div>
          </div>

          {bookings.length > 0 && (
            <>
              <h2 className="mb-3 mt-10 text-xs font-bold uppercase text-gray-400">
                Agendamentos confirmados
              </h2>

              <div className="grid gap-4 lg:grid-cols-2">
                {bookings.map((booking) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            </>
          )}

          {/* Populares */}
          <h2 className="mb-3 mt-10 text-xs font-bold uppercase text-gray-400">
            Populares
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {popularBarbeShops.map((shop) => (
              <BarbeShopIntem key={shop.id} barbeShop={shop} />
            ))}
          </div>

          {/* Footer */}
          <Card className="relative mt-10 overflow-hidden border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.2),transparent_55%)]" />
            <CardContent className="relative space-y-6 p-6 pt-6">
              <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <Scissors
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-lg font-semibold tracking-tight">
                        InfinityBarber
                      </p>
                      <p className="text-sm text-gray-400">
                        Agendamentos inteligentes para barbearias modernas.
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-400">
                    Descubra barbearias, organize seus horários e mantenha seu
                    estilo em dia com rapidez.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-300">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Busca rápida
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Agenda clara
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Histórico organizado
                    </span>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Atalhos
                    </p>
                    <div className="mt-3 flex flex-col gap-2 text-sm">
                      <Link
                        className="flex items-center gap-2 text-gray-300 transition hover:text-white"
                        href="/"
                      >
                        <HomeIcon
                          className="h-4 w-4 text-primary/80"
                          aria-hidden="true"
                        />
                        Início
                      </Link>
                      <Link
                        className="flex items-center gap-2 text-gray-300 transition hover:text-white"
                        href="/barbeshops"
                      >
                        <MapPin
                          className="h-4 w-4 text-primary/80"
                          aria-hidden="true"
                        />
                        Barbearias
                      </Link>
                      <Link
                        className="flex items-center gap-2 text-gray-300 transition hover:text-white"
                        href="/bookings"
                      >
                        <Calendar
                          className="h-4 w-4 text-primary/80"
                          aria-hidden="true"
                        />
                        Agendamentos
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Central do cliente
                    </p>
                    <p className="mt-3 text-sm text-gray-300">
                      Acompanhe seus agendamentos e detalhes do serviço em um só
                      lugar.
                    </p>
                    <Button asChild className="mt-4 w-full" variant="secondary">
                      <Link href="/bookings">Ver meus agendamentos</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {new Date().getFullYear()} &copy; InfinityBarber. Todos os
                  direitos reservados.
                </span>
                <span>Feito para barbearias que valorizam tempo e estilo.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
