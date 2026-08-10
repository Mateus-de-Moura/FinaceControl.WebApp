import { ColumnDef } from "@tanstack/react-table";
import { buttonVariants } from "@/components/ui/button"
import { Edit } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import True from '../../assets/true.svg'
import False from '../../assets/false.svg'
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable/data-table";
import { TablePagination } from "@/components/ui/DataTable/table-pagination";
import { SearchWithDate } from "@/components/SearchWithDate";
import { useQuery } from "@tanstack/react-query";
import { GetTransactions } from "@/Services/TransactionService";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface UsersTableProps {
    Id: string;
    Active: boolean;
    Description: string;
    value: string;
    Date: Date;
    Category: string;
    transactionType: string;
    type: string;
    Status: string;
}

function index() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

    const transactionsQuery = useQuery({
        queryKey: ['transactions', search, page, pageSize, dateRange],
        queryFn: () => GetTransactions(search, page, pageSize, dateRange[0], dateRange[1]),
    });



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
                header: 'Descrição',
                accessorKey: 'description',
                meta: {
                    className: "w-[100px] min-w-[100px] ",
                }
            },
            {
                header: 'Data',
                accessorKey: 'transactionDate',
                meta: {
                    className: "w-[100px] min-w-[100px] ",
                }
            },
            {
                header: 'Categoria',
                accessorKey: 'category',
                meta: {
                    className: "w-[100px] min-w-[100px] ",
                }
            },
            {
                header: 'Valor',
                accessorKey: 'value',
                cell: info => {
                    const row = info.row.original;
                    const isDespesa = row.type === 'Despesas';

                    return (
                        <div className="flex items-center gap-2">
                            {isDespesa ? (
                                <ArrowDownCircle className="text-red-500 w-4 h-4" />
                            ) : (
                                <ArrowUpCircle className="text-green-500 w-4 h-4" />
                            )}
                            <span className={isDespesa ? 'text-red-600' : 'text-green-600'}>
                                {row.value}
                            </span>
                        </div>
                    );
                },
                meta: {
                    className: "w-[130px] min-w-[130px]",
                }
            },
            {
                header: 'Pagamento',
                accessorKey: 'paymentMethod',
                meta: {
                    className: "w-[100px] min-w-[100px] ",
                }
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: info => {
                    const status = info.row.original.Status || info.getValue() as string;
                    const statusColor =
                        status === 'Confirmado' ? 'text-green-600'
                            : status === 'Pendente' ? 'text-yellow-600'
                                : status === 'Cancelado' ? 'text-red-600'
                                    : 'text-gray-600';
                    return (
                        <span className={statusColor}>
                            {status}
                        </span>
                    );
                },
                meta: {
                    className: "w-[100px] min-w-[100px] ",
                }
            },
            {
                header: '',
                accessorKey: 'id',
                cell: info => {
                    return (
                        <Link to={`/transacoes/Update/${info.getValue()}`}>
                            <Edit size={16} />
                        </Link>
                    );
                },
                meta: {
                    className: "w-[100px] min-w-[100px] ",
                }
            },
        ],
        []
    );

    const currentPage = page;
    const totalPages = transactionsQuery.data?.totalPages || 1;
    const totalCount = transactionsQuery.data?.totalCount

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    const data = transactionsQuery.data?.items || [];

    return (
        <div className="p-5 ">
            <div className="flex items-center justify-between gap-12 mb-3">
                <h6 className="font-semibold">Gerenciamento de Transações</h6>
                <Link to="/transacoes/Create" className={buttonVariants({ variant: "default", size: "sm" })}>
                    Cadastrar nova transação</Link>
            </div>
            <Card className="flex h-[620px] flex-col bg-white p-5">
                <div className='w-full flex justify-end gap-2'>
                    <SearchWithDate
                        onSearch={(searchText, startDate, endDate) => {
                            setSearch(searchText);
                            setDateRange([startDate, endDate]);
                        }}
                    />
                </div>

                <div className="my-3 min-h-0 flex-1">
                    <div className={`h-full transition-opacity duration-300 ease-in-out ${transactionsQuery.isLoading ? 'opacity-50' : 'opacity-100'}`}>
                        <DataTable columns={usersColumns} data={data} />
                    </div>
                </div>

                <TablePagination page={currentPage} totalPages={totalPages} totalCount={totalCount ?? 0}
                    pageSize={pageSize} onPageChange={handlePageChange}
                    onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />

            </Card>
        </div>
    )
}

export default index
