import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { GetNotify } from '@/Services/NotifyService';
import { Notifications } from '@/common/Interfaces/Notify.d';


function Notify() {
    const notifyQuery = useQuery({
        queryKey: ['notify'],
        queryFn: GetNotify,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });
    const notify: Notifications[] = notifyQuery.data?.data;

    console.log(notify)

    return (
        <div className="p-5">
            <div className="">
                <h6 className="text-xl font-semibold ">Central de Notificações</h6>
            </div>

            <div className="flex w-full mt-5 gap-3">

                <div className="w-[50%] gap-2">
                    {notify &&
                        notify.map((notification: Notifications) => {
                            return (
                                <div
                                    key={notification.id}
                                    className={`rounded-md border p-4 mb-3 shadow-sm transition-all duration-300 hover:shadow-md ${notification.wasRead ? "bg-gray-50 text-gray-600" : "bg-white text-gray-900"
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1">
                                            <p className="font-medium text-sm text-muted-foreground">
                                                Prioridade:{" "}
                                                <span
                                                    className={`font-semibold ${notification.priority === "high"
                                                            ? "text-red-600"
                                                            : notification.priority === "medium"
                                                                ? "text-yellow-600"
                                                                : "text-green-600"
                                                        }`}
                                                >
                                                    {notification.priority}
                                                </span>
                                            </p>

                                            <p className="text-base font-semibold">{notification.message}</p>

                                            {notification.expenses?.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    <strong>Fatura:</strong> {notification.expenses.description}
                                                </p>
                                            )}

                                            {notification.expenses?.dueDate && (
                                                <p className="text-sm text-muted-foreground">
                                                    <strong>Vencimento:</strong>{" "}
                                                    {new Date(notification.expenses.dueDate).toLocaleDateString("pt-BR")}
                                                </p>
                                            )}

                                            {notification.readDate && (
                                                <p className="text-xs text-muted-foreground">
                                                    Lida em: {new Date(notification.readDate).toLocaleString("pt-BR")}
                                                </p>
                                            )}
                                        </div>

                                        {!notification.wasRead && (
                                            <div
                                                className="bg-red-500 w-2 h-2 rounded-full mt-1"
                                                title="Nova"
                                            />
                                        )}
                                    </div>
                                </div>
                            );


                        })

                    }
                </div>

                <div className="w-[50%]  rounded-md border p-4 mb-3 shadow-sm transition-all duration-300 hover:shadow-md p-5">
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