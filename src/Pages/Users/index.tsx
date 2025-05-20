import { Button, buttonVariants } from "@/components/ui/button"
import { Link } from "react-router"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination"
import { useState } from "react"
import { DataTable } from "@/components/ui/DataTable/data-table"
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
    const [search, setSearch] = useState("");
    const [inputUser, setInputUser] = useState("");

    const usersQuery = useQuery({
        queryKey: ['users', search, page],
        queryFn: () => GetUsers(search, page),
    });

    const currentPage = page;
    const totalPages = usersQuery.data?.totalPages || 1;

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

            },
            {
                header: 'Nome',
                accessorKey: 'name',
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
            <Card className="p-5 bg-white">


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

                <div className="mt-3 mb-3">
                    <DataTable columns={usersColumns} data={data} />
                </div>

                <div className="pl-6 pr-6 mt-5">
                    <Pagination>
                        <PaginationContent>

                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {pages.map(p => (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        href="#"
                                        isActive={p === currentPage}
                                        onClick={() => handlePageChange(p)}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                        </PaginationContent>
                    </Pagination>
                </div>

            </Card>
        </div>
    )
}

export default index