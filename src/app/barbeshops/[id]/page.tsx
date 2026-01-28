import { Button } from "@/app/_components/ui/button"
import  {db}  from "../../_lib/prisma"
import { ChevronLeft, MapIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import ServiceIntem from "@/app/_components/service-intem"
import PhoneItem from "../../_components/phone-intem"
import SidebarButton from "@/app/_components/sidebar-button"

interface BarbeshopPageProps {
  params: { id: string }
}

const BarbeshopPage = async ({ params }: BarbeshopPageProps) => {
  const barbershop = await db.barbeShop.findUnique({
    where: { id: params.id },
    include: {
      services: true,
    },
  })

  if (!barbershop) notFound()

  return (
    <div>
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
        <p className="mt-2 text-justify text-sm">
          {barbershop.description ?? "Sem descrição cadastrada."}
        </p>
      </div>

      {/* Serviços */}
      <div className="space-y-3 p-5">
        <h2 className="text-xs font-bold uppercase text-gray-400">Serviços</h2>

        <div className="mt-3 flex flex-col gap-3">
          {barbershop.services.map((service) => (
            <ServiceIntem key={service.id} service={service} />
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
  )
}

export default BarbeshopPage
