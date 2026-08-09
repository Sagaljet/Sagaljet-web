"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { DollarSign, Calendar, Printer } from "lucide-react"
import { WhatsAppContactDialog } from "@/components/whatsapp-contact-dialog"
import { format } from "date-fns"
import { Printing } from "@/lib/types/services"

interface PrintingCardProps {
  printing: Printing
}

export function PrintingCard({ printing }: PrintingCardProps) {
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return "N/A"
    try {
      return format(new Date(date), "MMM yyyy")
    } catch (error) {
      console.error("Date formatting error:", error)
      return "N/A"
    }
  }

  const formatPrice = (price: number | undefined): string => {
    if (typeof price !== "number") return "0.00"
    return price.toFixed(2)
  }

  return (
    <Card className="h-full flex flex-col group hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 hover:border-[#422f7e]/30 bg-card">
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#422f7e]/10 to-[#e20613]/10 flex items-center justify-center">
        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
          <Printer className="w-24 h-24 text-[#422f7e]" />
        </motion.div>
        <div className="absolute bottom-4 left-4 z-10">
          <Badge className="bg-[#422f7e] hover:bg-[#422f7e]/90 text-white shadow-lg">Printing</Badge>
        </div>
      </div>

      <CardHeader className="bg-card">
        <CardTitle className="text-2xl group-hover:text-[#422f7e] transition-colors duration-300 text-foreground">
          {printing.name || "Untitled Printing Service"}
        </CardTitle>
        {printing.size && <p className="text-sm text-muted-foreground">Size: {printing.size}</p>}
        {printing.description && (
          <CardDescription className="leading-relaxed line-clamp-2 text-muted-foreground">
            <div
              dangerouslySetInnerHTML={{ __html: printing.description }}
              className="prose prose-sm dark:prose-invert max-w-none"
            />
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 bg-card">
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-5 w-5 text-[#422f7e]" />
              <p className="text-2xl font-bold text-[#422f7e]">{formatPrice(printing.price)}</p>
            </div>
            <p className="text-xs text-muted-foreground">Starting Price</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium">{formatDate(printing.createdAt)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Added</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 bg-card">
        <WhatsAppContactDialog
          itemTitle={printing.name || "Printing Service"}
          itemType="printing"
          itemPrice={printing.price}
        />
      </CardFooter>
    </Card>
  )
}
