import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Button } from '@/components/ui/button';
import { GetNotify, UpdateNotificatioForRead } from '@/Services/NotifyService';
import { Notifications } from '@/common/Interfaces/Notify.d';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Modal } from '@/components/ModalNotification';

function Notify() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notifications | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [triggerRefetch, setTriggerRefetch] = useState(true);

    const notifyQuery = useQuery({
        queryKey: ['notify', triggerRefetch],
        queryFn: () => GetNotify(statusFilter),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });
    const notify: Notifications[] = notifyQuery.data?.data;

    const updateNotificationMutation = useMutation({
        mutationFn: UpdateNotificatioForRead,
        onSuccess: () => {
            window.location.reload();
        }
    });

    function handleUpdate(Id: string, wasRead: boolean) {
        if (!wasRead) {
            updateNotificationMutation.mutate(Id);
        }
    }

    function openModal(notification: Notifications) {
        setSelectedNotification(notification);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        if (selectedNotification && !selectedNotification.wasRead) {
            handleUpdate(selectedNotification.id, selectedNotification.wasRead);
        }
    }
    function handleTrigger() {
        setTriggerRefetch(!triggerRefetch);
    }

    function handleClearFilters() {
        setStatusFilter("")
        setTriggerRefetch(!triggerRefetch);
    }

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
                                    onClick={() => openModal(notification)} // Abre o modal ao clicar
                                    key={notification.id}
                                    className={`rounded-md border p-4 mb-3 shadow-sm transition-all duration-300 hover:shadow-md ${notification.wasRead ? "bg-gray-100 text-gray-500" : "bg-white text-gray-900"
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1">
                                            <p className="font-medium text-sm text-muted-foreground">
                                                Prioridade:{" "}
                                                <span
                                                    className={`font-semibold ${notification.priority === "Alta"
                                                        ? "text-red-600"
                                                        : notification.priority === "Média"
                                                            ? "text-yellow-400"
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

                                            {notification.wasRead && notification.readDate && (
                                                <p className="text-xs text-muted-foreground">
                                                    Lida em: {new Date(notification.readDate).toLocaleString("pt-BR")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

                <div className="w-[50%] h-full  rounded-md border  mb-3 shadow-sm transition-all duration-300 hover:shadow-md p-5">
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

                        <Select defaultValue="0" value={statusFilter} onValueChange={(value) => setStatusFilter(value)} >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key="0" value="0" disabled>Selecione um status </SelectItem >
                                <SelectItem key="1" value="read" >Lidas </SelectItem >
                                <SelectItem key="2" value="notRead" >Não Lidas </SelectItem >
                            </SelectContent>
                        </Select>

                        <div className='flex items-end justify-end w-full'>
                            <Button onClick={() => handleTrigger()} className='mt-5 mr-5' variant='secondary' size='sm'>Filtrar</Button>
                            <Button onClick={() => handleClearFilters()} className='mt-5' variant='outline' size='sm'>Limpar Filtros</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} notification={selectedNotification} />
        </div>
    )
}

export default Notify;