import { Notifications } from "@/common/Interfaces/Notify.d";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function Modal({ isOpen, onClose, notification }: { isOpen: boolean, onClose: () => void, notification: Notifications | null }) {
    if (!notification) return null;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>                
                <DialogTrigger asChild>                    
                    <Button className="hidden">Open</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Fatura em Aberto</DialogTitle>
                        <DialogDescription>
                            <p><strong>Descrição:</strong> {notification.expenses?.description}</p>
                            <p><strong>Vencimento:</strong> {notification.expenses?.dueDate ? new Date(notification.expenses.dueDate).toLocaleDateString("pt-BR") : 'Data não disponível' }</p>
                            <p><strong>Prioridade:</strong> {notification.priority}</p>
                            <p><strong>Mensagem:</strong> {notification.message}</p>
                            <p className="font-semibold mt-5 text-red-600">Regularize o quanto antes para evitar juros.</p>
                        </DialogDescription>
                        <DialogFooter>
                          
                        </DialogFooter>
                    </DialogHeader>

                    <div className="flex justify-end mt-4">
                        <Button variant="secondary" onClick={onClose}>Fechar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
