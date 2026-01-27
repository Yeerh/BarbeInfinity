import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { MenuIcon } from "lucide-react"
const Header = () => {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between">
        <Image alt="InfinityBarber" src="/logo.png" height={60} width={160} />

        <Button size="icon" variant="outline">
          <MenuIcon></MenuIcon>
        </Button>
      </CardContent>
    </Card>
  )
}

export default Header
