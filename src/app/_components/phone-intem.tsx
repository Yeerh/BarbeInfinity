"use client"

import { SmartphoneIcon } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { toast } from "sonner"

interface PhoneItemProps {
  phone: string
}

const PhoneItem = ({ phone }: PhoneItemProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phone)
      toast.success("Telefone copiado")
    } catch {
      window.prompt("Copie o número:", phone)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SmartphoneIcon size={18} className="text-primary" />
        <p className="text-sm">{phone}</p>
      </div>

      <Button variant="outline" size="sm" onClick={handleCopy}>
        Copiar
      </Button>
    </div>
  )
}

export default PhoneItem
