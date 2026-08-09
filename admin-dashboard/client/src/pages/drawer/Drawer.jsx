import { useState } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Toast, ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
import { Copy, Mail } from 'lucide-react'

export default function DrawerJob() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const jobTitle = 'React Native Developer'
  const jobDescription =
    'We are seeking an experienced React Native developer to join our team. The ideal candidate will have 3+ years of experience with React Native.'
  const jobLink = 'skillup738@gmail.com'

  const copyLink = () => {
    navigator.clipboard.writeText(jobLink)
    toast({
      title: 'Link copied!',
      description: 'The job link has been copied to your clipboard.',
    })
  }

  const shareViaGmail = () => {
    const subject = encodeURIComponent(`Job Opportunity: ${jobTitle}`)
    const body = encodeURIComponent(
      `Check out this job opportunity:\n\n${jobTitle}\n\n${jobDescription}\n\n${jobLink}`
    )
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`,
      '_blank'
    )
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <span> View Job Announcement</span>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>{jobTitle}</DrawerTitle>
              <DrawerDescription>{jobDescription}</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center space-x-2">
                <Input id="link" value={jobLink} readOnly className="flex-1" />
                <Button size="icon" onClick={copyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={shareViaGmail}>
                <Mail className="mr-2 h-4 w-4" />
                Share via Gmail
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
