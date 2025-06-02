import { Filter } from 'lucide-react';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Button } from '@/components/ui/button';


function Notify() {
    return (
        <div className="p-5">
            <div className="">
                <h6 className="text-xl font-semibold ">Central de Notificações</h6>
            </div>

            <div className="flex w-full mt-5 gap-1">

                <div className="w-[70%] gap-2">
                    <div className=" border rounded p-5 mb-2">
                        notificacao 1
                    </div>

                    <div className=" border rounded p-5 mb-2">
                        notificacao 1
                    </div>
                </div>

                <div className="w-[30%]  border rounded p-5">
                    <div className="flex items-center gap-2 mb-8">
                        <Filter />
                        <p className='font-semibold'>Filtros</p>
                    </div>

                    <div className='flex flex-col mt-4 gap-2'>
                        <div className="flex items-center gap-3">
                            <label htmlFor="status" className="font-semibold">Status</label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info size={16} className="cursor-pointer text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>Filtre pelas notificações com status específico.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <Select defaultValue="0"  >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key="0" value="0" disabled>Selecione </SelectItem >
                            </SelectContent>
                        </Select>

                        <div className='flex items-end justify-end w-full'>
                            <Button className='mt-5' variant='secondary' size='sm'>Filtrar</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notify