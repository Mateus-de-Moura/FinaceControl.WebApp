import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/DataTable/data-table";
import { TablePagination } from "@/components/ui/DataTable/table-pagination";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreVertical } from "react-feather";
import { ReceiptText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetExpense, PayExpense } from "@/Services/ExpenseService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router";
import { SearchWithDate } from "@/components/SearchWithDate"
import {  buttonVariants } from "@/components/ui/button"
import True from '../../assets/true.svg'
import False from '../../assets/false.svg'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";

interface UsersTableProps {
  id: string;
  description: string;
  value: string;
  statusName: string;
}

const currencyToNumber = (value: string) =>
  Number(value.replace(/[^\d,-]/g, "").replace(/\./g, "").replace(",", "."));

function Index() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState("");
  const [selectStatus, setStatus] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [expenseToPay, setExpenseToPay] = useState<UsersTableProps | null>(null);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentValue, setPaymentValue] = useState("");
  const queryClient = useQueryClient();

  const paymentMutation = useMutation({
    mutationFn: () => PayExpense(expenseToPay!.id, {
      paymentDate,
      value: Number(paymentValue),
    }),
    onSuccess: async () => {
      toast.success("Despesa faturada com sucesso.");
      setExpenseToPay(null);
      await queryClient.invalidateQueries({ queryKey: ["expense"] });
    },
    onError: () => toast.error("Não foi possível faturar a despesa. Tente novamente."),
  });

  const openPaymentModal = (expense: UsersTableProps) => {
    setExpenseToPay(expense);
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setPaymentValue(String(currencyToNumber(expense.value)));
  };

  const usersQuery = useQuery({
    queryKey: ["expense", search, page, pageSize, selectStatus, dateRange],
    queryFn: () =>
      GetExpense(search, page, pageSize, selectStatus, dateRange[0], dateRange[1]),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const currentPage = page;
  const totalPages = usersQuery.data?.totalPages || 1;
  const totalCount = usersQuery.data?.totalCount;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const data = usersQuery.data?.items || [];
  const usersColumns = useMemo<ColumnDef<UsersTableProps>[]>(
    () => [
      {
                header: 'Ativo',
                accessorKey: 'active',
                cell: info => {
                    const IsActive = info.getValue();
                    const iconStyle = {
                        display: 'flex',
                        alignItems: 'start',
                        justifyContent: 'start',
                        height: '100%',
                    };

                    return (
                        <div style={iconStyle}>
                            {IsActive ? <img src={True} alt="Ativo" /> : <img src={False} alt="Inativo" />}
                        </div>)
                },
                meta: {
                    className: "w-[100px] min-w-[100px] ",
                }
            },
      {
        header: "Descrição",
        accessorKey: "description",
        meta: {
          className: "w-[100px] min-w-[100px] ",
        },
      },
      {
        header: "Valor",
        accessorKey: "value",
        meta: {
          className: "w-[100px] min-w-[100px] ",
        },
      },
      {
        header: "Data de vencimento",
        accessorKey: "dueDate",
        meta: {
          className: "w-[100px] min-w-[100px] ",
        },
      },
      {
        header: "Categoria",
        accessorKey: "categoryName",
        meta: {
          className: "w-[100px] min-w-[100px] ",
        },
      },
      {
        header: "Status",
        accessorKey: "statusName",
        meta: {
          className: "w-[100px] min-w-[100px] ",
        },
      },
      {
        header: "",
        id: "actions",
        cell: ({ row }) => {
          const expense = row.original;
          return (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={`Ações da despesa ${expense.description}`}>
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/Despesas/Update/${expense.id}`}><Edit size={16} /> Editar</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={expense.statusName === "Pago"}
                  onSelect={() => {
                    // Aguarda o menu liberar o foco antes de abrir o modal.
                    window.setTimeout(() => openPaymentModal(expense), 0);
                  }}
                >
                  <ReceiptText /> Faturar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        meta: {
          className: "w-[100px] min-w-[100px] ",
        },
      },
    ],
    []
  ); 

  return (
    <div className="p-5 ">
      <div className="flex items-center justify-between gap-12 mb-3">
        <h6 className="font-semibold">Gerenciamento de despesas</h6>
        <Link
          to="/Despesas/Create"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          Cadastrar nova despesa
        </Link>
      </div>
      <Card className="flex h-[620px] flex-col bg-white p-5">
        <div className="w-full flex justify-end gap-2">
          <div className="w-48 self-end">
            <Select onValueChange={(value) => setStatus(value === "all" ? "" : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">
                  Todos
                </SelectItem>
                <SelectItem key="0" value="0">
                  Pendente
                </SelectItem>
                <SelectItem key="1" value="1">
                  Pago
                </SelectItem>
                <SelectItem key="2" value="2">
                  Vencido
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <SearchWithDate
              onSearch={(searchText, startDate, endDate) => {
                setSearch(searchText);
                setDateRange([startDate, endDate]);
              }}
            />
          </div>

        </div>

        <div className="my-3 min-h-0 flex-1">
          <div className={`h-full transition-opacity duration-300 ease-in-out ${usersQuery.isLoading ? 'opacity-50' : 'opacity-100'}`}>
            <DataTable columns={usersColumns} data={data} />
          </div>
        </div>

        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          totalCount={totalCount ?? 0}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        />
      </Card>

      <Dialog open={Boolean(expenseToPay)} onOpenChange={(open) => !open && setExpenseToPay(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Faturar despesa</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja faturar o débito “{expenseToPay?.description}”? Ao confirmar, ele será marcado como pago.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="payment-date">Data do pagamento</Label>
              <Input id="payment-date" type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payment-value">Valor</Label>
              <Input id="payment-value" type="number" min="0.01" step="0.01" value={paymentValue} onChange={(event) => setPaymentValue(event.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExpenseToPay(null)} disabled={paymentMutation.isPending}>Cancelar</Button>
            <Button
              onClick={() => paymentMutation.mutate()}
              disabled={paymentMutation.isPending || !paymentDate || Number(paymentValue) <= 0}
            >
              {paymentMutation.isPending ? "Faturando..." : "Faturar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Index;
