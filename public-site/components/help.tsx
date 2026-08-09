"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageCircle, MapPin } from "lucide-react"

interface ContactOption {
  name: string
  number: string
  department?: string
}

const contactOptions: ContactOption[] = [
  {
    name: "Hargeisa",
    number: "+252636799993",
    department: "Hargeisa Branch",
  },
  {
    name: "Burao",
    number: "+252636799997",
    department: "Burao Branch",
  },
  {
    name: "Berbera",
    number: "+252636799997",
    department: "Berbera Branch",
  },
  {
    name: "Las'anod",
    number: "+252636799991",
    department: "Las'anod Branch",
  },
  {
    name: "Cerigabo",
    number: "+252634202171",
    department: "Cerigabo Branch",
  },
  {
    name: "Wajale",
    number: "+252634404140",
    department: "Wajale Branch",
  },
  {
    name: "Djabouti",
    number: "+253770108083",
    department: "Djabouti Branch",
  },
]

interface WhatsAppContactDialogProps {
  designTitle?: string
  variant?: "default" | "fixed"
}

export function HelpChat({ designTitle, variant = "default" }: WhatsAppContactDialogProps) {
  const [open, setOpen] = useState(false)

  const handleContactClick = (contact: ContactOption) => {
    const message = designTitle
      ? `Hi! I'm interested in the design: ${designTitle}`
      : "Hi! I'd like to inquire about your designs."

    const whatsappUrl = `https://wa.me/${contact.number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    setOpen(false)
  }

  const triggerButton =
    variant === "fixed" ? (
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-[#422f7e] hover:bg-[#422f7e]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 p-0"
      >
        <MessageCircle className="h-7 w-7 text-white" />
        <span className="sr-only">Contact Us on WhatsApp</span>
      </Button>
    ) : (
      <Button variant="outline" size="lg" className="w-full bg-[#422f7e] hover:bg-[#422f7e]/90 text-white text-lg py-6">
        <MessageCircle className="h-5 w-5 text-white" />
        Contact Us on WhatsApp
      </Button>
    )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#e20613]" />
            Contact Us on WhatsApp
          </DialogTitle>
          <DialogDescription>Select your nearest branch to start a conversation</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4 max-h-[60vh] overflow-y-auto">
          {contactOptions.map((contact) => (
            <button
              key={contact.number}
              onClick={() => handleContactClick(contact)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-[#e20613] hover:bg-[#e20613]/5 transition-all text-center group"
            >
              <div className="bg-[#422f7e]/10 p-3 rounded-full group-hover:bg-[#e20613] transition-colors">
                <MapPin className="h-5 w-5 text-[#422f7e] group-hover:text-white" />
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-sm text-foreground">{contact.name}</div>
                <div className="text-xs text-muted-foreground">{contact.number}</div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
