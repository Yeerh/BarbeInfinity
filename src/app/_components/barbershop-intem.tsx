import Image from "next/image";
import Link from "next/link";
import type { BarbeShop } from "../../../prisma/generated/client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { StarIcon } from "lucide-react";

interface BarbeShopIntemProps {
  barbeShop: BarbeShop;
}

const BarbeShopIntem = ({ barbeShop }: BarbeShopIntemProps) => {
  return (
    <Card className="min-w-[159px] overflow-hidden rounded-2xl shadow-sm">
      <CardContent className="p-1">
        {/* Imagem */}
        <div className="relative h-[159px] w-[159px]">
          <Image
            src={barbeShop.imageUrl ?? "/placeholder.png"}
            alt={barbeShop.name}
            fill
            className="rounded-xl object-cover"
          />

          {/* Nota */}
          <Badge
            variant="secondary"
            className="absolute left-2 top-2 flex items-center gap-1"
          >
            <StarIcon size={12} className="fill-primary text-primary" />
            <span className="text-xs font-semibold">4.5</span>
          </Badge>
        </div>

        {/* Conteúdo */}
        <div className="w-[159px] px-1 py-3">
          <h3 className="line-clamp-1 font-semibold leading-tight">
            {barbeShop.name}
          </h3>

          <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-tight text-gray-400">
            {barbeShop.address}
          </p>

          <Button
            asChild
            variant="secondary"
            className="mx-auto mt-3 h-9 w-[140px] text-sm font-medium"
          >
            <Link href={`/barbeshops/${barbeShop.id}`}>Agendar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarbeShopIntem;
