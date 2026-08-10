import { Button, buttonVariants } from "@/components/ui/button"
import { Link } from "react-router"
import { useState } from "react"
import { DataTable } from "@/components/ui/DataTable/data-table"
import { TablePagination } from "@/components/ui/DataTable/table-pagination"
import { useQuery } from "@tanstack/react-query";
import { GetUsers } from "@/Services/UsersService"
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import True from '../../assets/true.svg'
import False from '../../assets/false.svg'
import { Edit } from "react-feather";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"
import { Card } from "@/components/ui/card"

interface UsersTableProps {
    Id: string;
    Name: string;
    Active: boolean;
    Office: string;
}

function index() {

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [inputUser, setInputUser] = useState("");

    const usersQuery = useQuery({
        queryKey: ['users', search, page, pageSize],
        queryFn: () => GetUsers(search, page, pageSize),
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
                header: 'Nome',
                accessorKey: 'name',
                meta: {
                    className: "w-[100px] min-w-[100px] ",
                }
            },
            {
                header: 'Cargo',
                accessorKey: 'roleName',
                cell: info => {
                    const Office = info.getValue() as string;

                    return (
                        <div>
                            <span className="green-box">{Office}</span>
                        </div>
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
                        <Link to={`/Users/Update/${info.getValue()}`}>
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
                <h6 className="font-semibold">Gerenciamento de Usuários</h6>
                <Link to="/Users/Create" className={buttonVariants({ variant: "default", size: "sm" })}>Cadastrar novo Usuário</Link>
            </div>
            <Card className="flex h-[620px] flex-col bg-white p-5">
                <div className='w-full flex justify-end gap-2'>
                    <div className='w-72 self-end '>
                        <Input
                            type='text'
                            placeholder='Buscar'
                            value={inputUser}
                            onChange={e => setInputUser(e.target.value)}
                            className='border rounded'
                        />
                    </div>
                    <div className='self-end'>
                        <Button className="h-9" size="sm" variant={"secondary"}
                            onClick={() => setSearch(inputUser)}><Search /></Button>
                    </div>
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
