import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/DataTable/data-table";
import { TablePagination } from "@/components/ui/DataTable/table-pagination";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "react-feather";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { GetExpense } from "@/Services/ExpenseService";
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

interface UsersTableProps {
  Id: string;
  Description: string;
  value: string;
  DueDate: Date;
  CategoryName: string;
  StatusName: string;
}

function Index() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectStatus, setStatus] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

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
        accessorKey: "id",
        cell: (info) => {
          return (
            <Link to={`/Despesas/Update/${info.getValue()}`}>
              <Edit size={16} />
            </Link>
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
    </div>
  );
}

export default Index;
