// src/app/_constants/quick-search.ts

export interface QuickSearchOption {
  imageUrl: string
  label: string
  title: string
}

export const quickSearchOptions: QuickSearchOption[] = [
  {
    imageUrl: "/cabelo.png",
    label: "Cabelo",
    title: "Cortes de cabelo",
  },
  {
    imageUrl: "/acabamento.png",
    label: "Acabamento",
    title: "Acabamentos",
  },

  {
    imageUrl: "/sobrancelha.png",
    label: "Sobrancelha",
    title: "Design de sobrancelha",
  },
  {
    imageUrl: "/barba.png",
    label: "Barba",
    title: "Barba",
  },
]
