import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon, Monitor, Smartphone, Info } from "lucide-react"
import * as Tooltip from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"


function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border border-gray-300 rounded-md mb-2 px-5", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  status = "success",
  deviceType = "monitor",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { status?: string, deviceType?: string }) {
  return (
    <AccordionPrimitive.Header className="flex w-full items-center justify-between">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex items-center gap-4 w-full py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 cursor-pointer", // Tornando a área de clique mais ampla
          className
        )}
        {...props}
      >
        {deviceType === "monitor" ? <Monitor className="size-5 " /> : <Smartphone className="size-5" />}

        <span className={status === "success" ? "text-green-500" : "text-red-500"}>
          {status === "success" ? "Entrada bem-sucedida" : "Entrada mal-sucedida"}
        </span>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <span className="ml-2  cursor-pointer"><Info size='18px' /></span>
          </Tooltip.Trigger>
          <Tooltip.Content className=" bg-white text-black border border-gray-300 rounded p-2 text-xs z-50">
            As informações de localização são aproximadas do endereço IP e podem não corresponder à localização física exata deste logon
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Root>

        <div className="flex items-center justify-center ml-auto cursor-pointer">
          <ChevronDownIcon
            className={cn(
              "text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200",
              "[&[data-state=open]>svg]:rotate-180",
              "[&[data-state=open]>svg]:rotate-50"
            )}
          />
        </div>
      </AccordionPrimitive.Trigger>



    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
