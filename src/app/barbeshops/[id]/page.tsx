import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { db } from "../../_lib/prisma";
import {
  CalendarIcon,
  ChevronLeft,
  MapIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceIntem from "@/app/_components/service-intem";
import PhoneItem from "../../_components/phone-intem";
import SidebarButton from "@/app/_components/sidebar-button";
import DesktopProfileButton from "@/app/_components/desktop-profile-button";

interface BarbeshopPageProps {
  params: { id: string };
}

const BarbeshopPage = async ({ params }: BarbeshopPageProps) => {
  const barbershop = await db.barbeShop.findUnique({
    where: { id: params.id },
    include: {
      services: true,
    },
  });

  if (!barbershop) notFound();

  const description =
    barbershop.description ?? "Sem descrição cadastrada.";

  return (
    <div>
      {/* Mobile layout (original) */}
      <div className="md:hidden">
        {/* Banner */}
        <div className="relative h-[250px] w-full">
          <Image
            src={barbershop.imageUrl ?? "/placeholder.png"}
            alt={barbershop.name}
            fill
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-black/20" />

          {/* Voltar */}
          <Button
            asChild
            size="icon"
            variant="secondary"
            className="absolute left-4 top-4 z-10"
          >
            <Link href="/">
              <ChevronLeft />
            </Link>
          </Button>

          {/* Sidebar (Menu) */}
          <div className="absolute right-4 top-4 z-10">
            <SidebarButton />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="border-b p-5">
          <h1 className="text-xl font-bold">{barbershop.name}</h1>

          <div className="mt-2 flex items-center gap-1">
            <MapIcon className="text-primary" size={18} />
            <p className="text-sm">{barbershop.address}</p>
          </div>

          <div className="mt-2 flex items-center gap-1">
            <StarIcon className="text-primary" size={18} />
            <p className="text-sm">4.5 (500 Avaliações)</p>
          </div>
        </div>

        {/* Descrição */}
        <div className="border-b p-5">
          <h2 className="text-xs font-bold uppercase text-gray-400">Sobre nós</h2>
          <p className="mt-2 text-justify text-sm">{description}</p>
        </div>

        {/* Serviços */}
        <div className="space-y-3 p-5">
          <h2 className="text-xs font-bold uppercase text-gray-400">Serviços</h2>

          <div className="mt-3 flex flex-col gap-3">
            {barbershop.services.map((service) => (
              <ServiceIntem
                key={service.id}
                service={{ ...service, barbeShopId: barbershop.id }}
              />
            ))}
          </div>
        </div>

        {/* Contato */}
        <div className="border-t p-5">
          <h2 className="text-xs font-bold uppercase text-gray-400">Contato</h2>

          <div className="mt-3">
            <PhoneItem phone={barbershop.phone} />
          </div>
        </div>
      </div>

      {/* Desktop layout (new structure) */}
      <div className="hidden md:block">
        <div className="border-b border-white/10 bg-black/40">
          <div className="mx-auto flex max-w-screen-xl items-center gap-6 px-8 py-4 lg:px-12">
            <Link href="/" className="shrink-0">
              <Image
                alt="InfinityBarber"
                src="/logo.png"
                height={40}
                width={140}
                priority
              />
            </Link>

            <form
              action="/barbeshops"
              className="flex w-full max-w-xl items-center gap-2"
            >
              <Input
                name="search"
                placeholder="Buscar barbearias"
                className="h-10 border-white/10 bg-white/5"
              />
              <Button
                type="submit"
                size="icon"
                variant="secondary"
                className="h-10 w-10"
              >
                <SearchIcon />
              </Button>
            </form>

            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/bookings"
                className="flex items-center gap-2 text-sm text-gray-300 transition hover:text-white"
              >
                <CalendarIcon className="h-4 w-4 text-primary/80" />
                Agendamentos
              </Link>
              <DesktopProfileButton className="h-9 px-4" />
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-screen-xl px-8 pb-12 pt-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
            <div>
              <div className="relative h-[360px] w-full overflow-hidden rounded-2xl">
                <Image
                  src={barbershop.imageUrl ?? "/placeholder.png"}
                  alt={barbershop.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-white">
                  <StarIcon className="h-4 w-4 text-primary" />
                  4.5
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{barbershop.name}</h1>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-300">
                    <MapIcon className="h-4 w-4 text-primary" />
                    <span>{barbershop.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
                  <StarIcon className="h-4 w-4 text-primary" />
                  4.5 (500 avaliações)
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xs font-bold uppercase text-gray-400">
                  Serviços
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {barbershop.services.map((service) => (
                    <ServiceIntem
                      key={service.id}
                      service={{ ...service, barbeShopId: barbershop.id }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <Card className="border-white/10 bg-white/5">
                <CardContent className="space-y-4 p-4">
                  <div className="relative h-40 w-full overflow-hidden rounded-xl">
                    <Image
                      src={barbershop.imageUrl ?? "/placeholder.png"}
                      alt={barbershop.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </div>

                  <div>
                    <p className="text-base font-semibold">{barbershop.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <MapIcon className="h-4 w-4 text-primary" />
                      <span>{barbershop.address}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">
                      Sobre nós
                    </p>
                    <p className="mt-2 text-sm text-gray-300">
                      {description}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">
                      Contato
                    </p>
                    <div className="mt-3 space-y-3">
                      <PhoneItem phone={barbershop.phone} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarbeshopPage;
