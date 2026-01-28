import { db } from "@/app/_lib/prisma";
import Header from "../_components/header";
import Search from "../_components/search";
import BarbeShopIntem from "../_components/barbershop-intem";

interface BarbeshopsPageProps {
  searchParams: {
    search?: string;
  };
}

const BarbeshopsPage = async ({ searchParams }: BarbeshopsPageProps) => {
  const search = searchParams?.search?.trim();

  const barbeshops = await db.barbeShop.findMany({
    where: search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : undefined,
  });

  return (
    <>
      <Header />

      <div className="p-5">
        <Search />

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          {search ? `Resultados para "${search}"` : "Todas as barbearias"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {barbeshops.map((barbeshop) => (
            <BarbeShopIntem key={barbeshop.id} barbeShop={barbeshop} />
          ))}
        </div>
      </div>
    </>
  );
};

export default BarbeshopsPage;
