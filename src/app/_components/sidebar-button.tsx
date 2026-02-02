"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-react";

import { quickSearchOptions } from "../_constants/search";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { signIn, signOut, useSession } from "next-auth/react";

const SidebarButton = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user as { role?: "ADMIN" | "CLIENT" } | undefined)?.role;

  const handleLoginWithGoogleClick = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const handleLogoutClick = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <MenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        {!user && (
          <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
            <h2 className="text-lg font-bold">Olá, faça seu login!</h2>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" variant="outline">
                  <LogInIcon />
                </Button>
              </DialogTrigger>

              <DialogContent className="w-[90vw] sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Faça seu login</DialogTitle>
                  <DialogDescription>Entre com sua conta.</DialogDescription>
                </DialogHeader>

                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 font-bold"
                  onClick={handleLoginWithGoogleClick}
                >
                  <Image src="/google.png" alt="Google" width={18} height={18} />
                  Google
                </Button>

                <div className="mt-4 text-xs text-gray-400">
                  Acesso do administrador?{" "}
                  <Link href="/admin/login" className="underline">
                    Entrar
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {user && (
          <div className="mt-4 flex items-center border-b border-solid pb-5">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback>
                {(user.name?.[0] ?? "U").toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="ml-3 flex flex-col">
              <p className="text-sm font-bold leading-tight">
                {user.name ?? "Usuário"}
              </p>
              <p className="text-xs leading-tight text-gray-500">
                {user.email ?? ""}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Button asChild variant="ghost" className="justify-start gap-2">
            <Link href="/">
              <HomeIcon size={18} />
              Início
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start gap-2">
            <Link href="/bookings">
              <CalendarIcon size={18} />
              Agendamentos
            </Link>
          </Button>

          {role === "ADMIN" ? (
            <Button asChild variant="ghost" className="justify-start gap-2">
              <Link href="/admin/bookings">
                <CalendarIcon size={18} />
                Admin
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" className="justify-start gap-2">
              <Link href="/admin/login">
                <CalendarIcon size={18} />
                Área Admin
              </Link>
            </Button>
          )}

          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase text-gray-400">
              Categorias
            </p>

            <div className="flex flex-col gap-1">
              {quickSearchOptions.map((option) => (
                <Button
                  key={option.label}
                  asChild
                  variant="ghost"
                  className="justify-start gap-2"
                >
                  <Link href={`/barbeshops?category=${option.slug}`}>
                    <Image
                      src={option.imageUrl}
                      alt={option.label}
                      width={18}
                      height={18}
                    />
                    {option.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {user && (
          <div className="mt-auto border-t border-solid pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleLogoutClick}
              className="w-full justify-start gap-2 text-primary hover:text-primary/80"
            >
              <LogOutIcon size={18} />
              Sair da conta
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SidebarButton;
