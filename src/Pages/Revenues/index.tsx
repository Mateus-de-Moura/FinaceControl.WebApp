import { buttonVariants } from "@/components/ui/button"
import { Link } from "react-router"
import { useState } from "react"
import { DataTable } from "@/components/ui/DataTable/data-table"
import { TablePagination } from "@/components/ui/DataTable/table-pagination"
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
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

    const usersQuery = useQuery({
        queryKey: ['revenues', search, page, pageSize, dateRange],
        queryFn: () => GetRevenues(search, page, pageSize, dateRange[0], dateRange[1]),
    });

    const currentPage = page;
    const totalPages = usersQuery.data?.totalPages || 1;
    const totalCount = usersQuery.data?.totalCount

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
                    <div className={`h-full transition-opacity duration-300 ease-in-out ${usersQuery.isLoading ? 'opacity-50' : 'opacity-100'}`}>
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
