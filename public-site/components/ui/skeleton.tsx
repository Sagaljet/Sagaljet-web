import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('dark:bg-[#f6f6f6e2] bg-[#f0cccc9c] animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

export { Skeleton }
