import Image from "next/image";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import SidebarButton from "../_components/sidebar-button";
import DesktopProfileButton from "./desktop-profile-button";
import { Card, CardContent } from "./ui/card";

const Header = () => {
  return (
    <Card className="rounded-none border-x-0 border-t-0">
      <CardContent className="flex items-center justify-between p-4 md:px-8 md:py-5 lg:px-12">
        <Link href="/">
          <Image
            alt="InfinityBarber"
            src="/logo.png"
            height={40}
            width={140}
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-4 text-sm text-gray-300 md:flex">
            <Link
              href="/bookings"
              className="flex items-center gap-2 transition hover:text-white"
            >
              <CalendarIcon className="h-4 w-4 text-primary/80" />
              Agendamentos
            </Link>
          </nav>

          <DesktopProfileButton className="hidden md:inline-flex" />

          <div className="md:hidden">
            <SidebarButton />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
