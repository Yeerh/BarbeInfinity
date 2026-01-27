import { BarbeShopService } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

interface ServiceIntemProps {
  service: BarbeShopService
}

const ServiceIntem = ({ service }: ServiceIntemProps) => {
  return (
    <Card>
      <CardContent className="intems-center flex gap-3 p-3">
        <div className="flex items-center gap-3">
          {/* Imagem */}
          <div className="relative h-[110px] w-[110px] shrink-0 overflow-hidden rounded-lg">
            <Image
              src={service.imageUrl ?? "/placeholder.png"}
              alt={service.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          {/* Conteúdo */}
          <div className="flex w-full flex-col gap-2">
            <h3 className="font-semibold">{service.name}</h3>

            <p className="line-clamp-2 text-sm text-gray-400">
              {service.description ?? "Sem descrição"}
            </p>

            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Button variant="secondary" size="sm">
                Reservar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceIntem
