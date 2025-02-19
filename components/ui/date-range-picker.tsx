"use client"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import type { Dispatch, SetStateAction } from "react"
import { useTheme } from "next-themes"

interface DatePickerWithRangeProps {
  className?: string
  date?: DateRange | undefined
  setDate: Dispatch<SetStateAction<DateRange | undefined>>
}

export function DatePickerWithRange({ className, date, setDate }: DatePickerWithRangeProps) {
  const { theme } = useTheme()

  return (
    <div className={cn("grid gap-2", className)}>
      <DatePicker
        selectsRange={true}
        startDate={date?.from}
        endDate={date?.to}
        onChange={(update: [Date | null, Date | null]) => {
          setDate({
            from: update[0]
              ? new Date(update[0].setMinutes(update[0].getMinutes() - update[0].getTimezoneOffset()))
              : undefined,
            to: update[1]
              ? new Date(update[1].setMinutes(update[1].getMinutes() - update[1].getTimezoneOffset()))
              : undefined,
          })
        }}
        monthsShown={2}
        isClearable
        showPopperArrow={false}
        customInput={
          <Button
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        }
        wrapperClassName="w-full"
        calendarClassName={cn(
          "!bg-background !border !rounded-md !shadow-md !font-sans !top-8 md:!top-0",
          theme === "dark" ? "!bg-gray-800 !text-white" : "!bg-white !text-gray-800",
        )}
        dayClassName={(date) =>
          cn(
            "!rounded !transition-colors hover:!bg-primary hover:!text-primary-foreground",
            theme === "dark" ? "!text-white" : "!text-gray-800",
          )
        }
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        aria-label="Date Range Calendar"
      />
    </div>
  )
}

