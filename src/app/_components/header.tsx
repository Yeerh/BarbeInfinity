import Image from "next/image";
import SidebarButton from "../_components/sidebar-button";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";



const Header = () => {
  return (
    <Card className="rounded-none border-x-0 border-t-0">
      <CardContent className="flex items-center justify-between p-4">
        <Link href="/">
        <Image
          alt="InfinityBarber"
          src="/logo.png"
          height={40}
          width={140}
          priority

/>
</Link>
<SidebarButton/>
      </CardContent>
    </Card>
  );
};

export default Header;
