import { buttonVariants } from "@/components/ui/button"
import { Link } from "react-router"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination"
import { useState } from "react"
import { DataTable } from "@/components/ui/DataTable/data-table"
import { useQuery } from "@tanstack/react-query";
import { GetRevenues } from "@/Services/RevenuesService"
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import True from '../../assets/true.svg'
import False from '../../assets/false.svg'
import { Edit } from "react-feather";
import { Card } from "@/components/ui/card"
import { SearchWithDate } from "@/components/SearchWithDate"

interface UsersTableProps {
    Id: string;
    Active: boolean;
    Description: string;
    value: string;
    Date: Date;
    Category: string;
}

function index() {

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

    const usersQuery = useQuery({
        queryKey: ['revenues', search, page, dateRange],
        queryFn: () => GetRevenues(search, page, dateRange[0], dateRange[1]),
    });

    const currentPage = page;
    const totalPages = usersQuery.data?.totalPages || 1;
    const totalCount = usersQuery.data?.totalCount

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    const data = usersQuery.data?.items || [];

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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
                header: 'Valor',
                accessorKey: 'value',
                meta: {
                    className: "w-[100px] min-w-[100px] ",
                }
            },
            {
                header: 'Data inclusão',
                accessorKey: 'date',
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
    return (
        <div className="p-5 ">
            <div className="flex items-center justify-between gap-12 mb-3">
                <h6 className="font-semibold">Gerenciamento Receitas</h6>
                <Link to="/Receitas/Create" className={buttonVariants({ variant: "default", size: "sm" })}>
                    Cadastrar nova receita</Link>
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