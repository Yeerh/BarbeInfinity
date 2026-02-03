"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

import { Button } from "./ui/button";
import { cn } from "@/app/_lib/utils";

interface DesktopProfileButtonProps {
  className?: string;
}

const DesktopProfileButton = ({ className }: DesktopProfileButtonProps) => {
  const { data: session, status } = useSession();
  const isAuthed = Boolean(session?.user);

  if (status === "loading") {
    return (
      <Button
        variant="secondary"
        className={cn("h-9 px-4", className)}
        disabled
      >
        Perfil
      </Button>
    );
  }

  if (isAuthed) {
    return (
      <Button
        asChild
        variant="secondary"
        className={cn("h-9 px-4", className)}
      >
        <Link href="/bookings">Perfil</Link>
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      className={cn("h-9 px-4", className)}
      onClick={() =>
        signIn("google", { callbackUrl: window.location.href })
      }
    >
      Perfil
    </Button>
  );
};

export default DesktopProfileButton;
