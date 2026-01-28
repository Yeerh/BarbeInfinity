"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Search = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    const q = search.trim();
    if (!q) return;

    router.push(`/barbeshops?search=${encodeURIComponent(q)}`);
  };

  return (
    <div className="mt-6 flex items-center gap-2">
      <Input
        placeholder="Faça sua busca.."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
      />

      <Button type="button" onClick={handleSubmit}>
        <SearchIcon />
      </Button>
    </div>
  );
};

export default Search;
