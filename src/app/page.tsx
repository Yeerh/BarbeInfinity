import Header from "./_components/header"

import { Button } from "./_components/ui/button"
import { Input } from "./_components/ui/input"
import { Card, CardContent } from "./_components/ui/card"
import { Badge } from "./_components/ui/badge"
import { Avatar, AvatarImage } from "./_components/ui/avatar"
import BarbeShopIntem from "./_components/barbershop-intem"

import Image from "next/image"
import { SearchIcon } from "lucide-react"
import { db } from "./_lib/prisma"

const Home = async () => {
  const barbeShops = await db.barbeShop.findMany()

  return (
    <div>
      <Header />

      <div className="p-5">
        <h2 className="text-xl font-bold">Olá</h2>
        <p>Terça-Feira, 26 de Janeiro</p>

        <div className="mt-4 flex items-center gap-2">
          <Input placeholder="Faça sua busca.." />
          <Button type="button">
            <SearchIcon />
          </Button>
        </div>

        <div className="relative mt-4 h-[150px] w-full">
          <Image
            src="/banner.png"
            alt="Banner InfinityBarber"
            fill
            className="rounded-md object-cover"
            priority
          />
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Agendamentos
        </h2>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex flex-col gap-2">
              <Badge className="w-fit">Confirmado</Badge>

              <h3 className="font-semibold">Corte de Cabelo</h3>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png" />
                </Avatar>
                <p className="text-sm">Barbearia Infinity</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-l-2 border-gray-200 pl-4 text-right leading-tight">
              <p className="text-sm">Agosto</p>
              <p className="text-2xl font-bold">27</p>
              <p className="text-sm">20:00</p>
            </div>
          </CardContent>
        </Card>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Recomendados
        </h2>

        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbeShops.map((barbeShop) => (
            <BarbeShopIntem key={barbeShop.id} barbeShop={barbeShop} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
