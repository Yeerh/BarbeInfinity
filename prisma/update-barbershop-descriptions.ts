import "dotenv/config";
import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const descriptionsByKey: Record<string, string> = {
  "barbearia vintage":
    "Ambiente retro com cortes classicos, toalha quente e cuidado nos detalhes. Atendimento calmo e preciso para quem valoriza tradicao.",
  "corte & estilo":
    "Equipe atualizada nas tendencias, consultoria de visagismo e acabamento impecavel. Ideal para quem quer estilo sem complicacao.",
  "barba & navalha":
    "Especialistas em barba: alinhamento, hidratacao e ritual completo com navalha. Resultado limpo e confortavel em cada visita.",
  "the dapper den":
    "Barbearia premium com foco em elegancia. Servicos personalizados, produtos selecionados e experiencia exclusiva.",
  "cabelo & cia.":
    "Clima leve e acolhedor com profissionais versateis. Cortes para todas as idades e rotinas, sempre com bom acabamento.",
  "machado & tesoura":
    "Pegada urbana, atendimento agil e cortes bem definidos. Perfeito para quem busca praticidade e estilo moderno.",
  "barbearia elegance":
    "Espaco sofisticado e atendimento de alto nivel. Cortes precisos, barba alinhada e cuidado premium.",
  "aparencia impecavel":
    "Detalhistas por natureza: finalizacao caprichada e atendimento atento. Saia com visual alinhado e confiante.",
  "estilo urbano":
    "Energia jovem, cortes atuais e tecnica apurada. Visual marcante com rapidez e qualidade.",
  "estilo classico":
    "Tradicao e tecnica em cortes atemporais. Barbas bem desenhadas e atendimento proximo.",
};

const defaultDescription = (name: string) =>
  `${name} oferece cortes personalizados, barba alinhada e atendimento cuidadoso em um ambiente confortavel.`;

const normalizeKey = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

async function main() {
  const shops = await prisma.barbeShop.findMany();
  let updated = 0;

  for (const shop of shops) {
    const key = normalizeKey(shop.name);
    const description = descriptionsByKey[key] ?? defaultDescription(shop.name);

    await prisma.barbeShop.update({
      where: { id: shop.id },
      data: { description },
    });

    updated += 1;
  }

  console.log(`Descricoes atualizadas: ${updated}/${shops.length}`);
}

main()
  .catch((e) => {
    console.error("Erro ao atualizar descricoes:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
