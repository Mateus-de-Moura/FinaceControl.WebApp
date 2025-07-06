import { ColumnDef } from "@tanstack/react-table";
import { buttonVariants } from "@/components/ui/button"
import { Edit } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import True from '../../assets/true.svg'
import False from '../../assets/false.svg'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable/data-table";
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
}

function index() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

    const transactionsQuery = useQuery({
        queryKey: ['transactions', search, page, dateRange],
        queryFn: () => GetTransactions(search, page, dateRange[0], dateRange[1]),
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
                    const isDespesa = row.transactionType === 'Despesa';                  

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
                meta: {
                    className: "w-[100px] min-w-[100px] ",
                }
            },
            {
                header: '',
                accessorKey: 'id',
                cell: info => {
                    return (
                        <Link to={`/Receitas/Update/${info.getValue()}`}>
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

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="p-5 ">
            <div className="flex items-center justify-between gap-12 mb-3">
                <h6 className="font-semibold">Gerenciamento de Transações</h6>
                <Link to="/Receitas/Create" className={buttonVariants({ variant: "default", size: "sm" })}>
                    Cadastrar nova transação</Link>
            </div>
            <Card className="p-5 bg-white h-[620px]">
                <div className='w-full flex justify-end gap-2'>
                    <SearchWithDate
                        onSearch={(searchText, startDate, endDate) => {
                            setSearch(searchText);
                            setDateRange([startDate, endDate]);
                        }}
                    />
                </div>

                <div className="mt-3 mb-3 h-full">
                    <DataTable columns={usersColumns} data={data} />
                </div>

                <div className="pl-6 pr-6 mt-5">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious

                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {pages.map(p => (
                                <PaginationItem key={p}>
                                    <PaginationLink

                                        isActive={p === currentPage}
                                        onClick={() => handlePageChange(p)}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext

                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            <PaginationItem>
                                <div className="ml-8">Mostrando {data.length} de {totalCount} Registros</div>
                            </PaginationItem>


                        </PaginationContent>
                    </Pagination>
                </div>

            </Card>
        </div>
    )
}

export default index