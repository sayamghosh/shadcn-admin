import { cn } from '@/lib/utils'

interface ShimmerProps {
  className?: string
  width?: string
  height?: string
}

export function Shimmer({ className, width = "w-full", height = "h-4" }: ShimmerProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-gray-200 dark:bg-gray-700",
        width,
        height,
        className
      )}
    />
  )
}

interface TableShimmerProps {
  rows?: number
  columns?: number
}

export function TableShimmer({ rows = 5, columns = 6 }: TableShimmerProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="p-4">
              <Shimmer 
                height={colIndex === 0 ? "h-8" : "h-4"} 
                width={
                  colIndex === 0 ? "w-8" : // Checkbox column
                  colIndex === 1 ? "w-32" : // Name column
                  colIndex === 2 ? "w-40" : // Email column
                  colIndex === 3 ? "w-20" : // Status column
                  colIndex === 4 ? "w-20" : // Role column
                  "w-10" // Actions column
                }
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
