import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

interface BookingItemProps {
  serviceName: string
  barberShopName: string
  barberShopImage: string
  status: "Confirmado" | "Pendente" | "Cancelado"
  month: string
  day: string
  time: string
}

const BookingItem = ({
  serviceName,
  barberShopName,
  barberShopImage,
  status,
  month,
  day,
  time,
}: BookingItemProps) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        {/* ESQUERDA */}
        <div className="flex flex-col gap-2">
          <Badge className="w-fit">{status}</Badge>

          <h3 className="font-semibold">{serviceName}</h3>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={barberShopImage} />
            </Avatar>
            <p className="text-sm">{barberShopName}</p>
          </div>
        </div>

        {/* DIREITA */}
        <div className="flex flex-col items-center justify-center border-l-2 border-gray-200 pl-4 text-right leading-tight">
          <p className="text-sm">{month}</p>
          <p className="text-2xl font-bold">{day}</p>
          <p className="text-sm">{time}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookingItem
