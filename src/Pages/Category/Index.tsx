import { buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable/data-table";
import { GetCategories } from "@/Services/CategoryService";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import True from "../../assets/true.svg";
import False from "../../assets/false.svg";
import { Edit } from "react-feather";
import { TablePagination } from "@/components/ui/DataTable/table-pagination";
import { Card } from "@/components/ui/card";
import { SearchWithDate } from "@/components/SearchWithDate";

interface CategoryTableProps {
  Id: string;
  Name: string;
  Type: string;
}

function Index() {

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["categories", search, page, pageSize],
    queryFn: () => GetCategories(search, page, pageSize),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const currentPage = page;
  const totalPages = categoriesQuery.data?.totalPages || 1;
  const totalCount = categoriesQuery.data?.totalCount

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const data = categoriesQuery?.data?.items || [];
  const categoryColumns = useMemo<ColumnDef<CategoryTableProps>[]>(
    () => [
      {
        header: "Ativo",
        accessorKey: "active",
        cell: (info) => {
          const IsActive = info.getValue();
          const iconStyle = {
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
            height: "100%",
          };

          return (
            <div style={iconStyle}>
              {IsActive ? (
                <img src={True} alt="Ativo" />
              ) : (
                <img src={False} alt="Inativo" />
              )}
            </div>
          );
        },
        meta: {
          className: "w-[100px] min-w-[100px] ",
        },
      },
      {
        header: "Nome",
        accessorKey: "name",
        meta: {
          className: "w-[100px] min-w-[100px] ",
        },
      },
      {
        header: "Tipo",
        accessorKey: "type",
        cell: (info) => {
          const type = info.row.original.Type || info.getValue() as number;
          let value = "";
          console.log(type);
          if (type === 0) {
            value = "Despesa";
          } else {
            value = "Receita";
          }

          return value;
        },
        meta: {
          className: "w-[100px] min-w-[100px] ",
        },
      },
      {
        header: "",
        accessorKey: "id",
        cell: (info) => {
          return (
            <Link to={`/Categorias/Update/${info.getValue()}`}>
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
        <h6 className="font-semibold">Gerenciamento de categorias</h6>

        <Link
          to="/Categorias/Create"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          Cadastrar nova categoria
        </Link>
      </div>
      <Card className="flex h-[620px] flex-col bg-white p-5">
        <div className='w-full flex justify-end gap-2'>
          <SearchWithDate
            showRangeDate={false}
            onSearch={(searchText) => {
              setSearch(searchText);              
            }}
          />
        </div>

        <div className="my-3 min-h-0 flex-1">
          <div className={`h-full transition-all duration-500 ease-in-out ${categoriesQuery.isLoading ? 'opacity-40 blur-[1px]' : 'opacity-100 blur-0'}`}>
            <DataTable columns={categoryColumns} data={data} />
          </div>
        </div>
        <TablePagination page={currentPage} totalPages={totalPages} totalCount={totalCount ?? 0}
          pageSize={pageSize} onPageChange={handlePageChange}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
      </Card>
    </div>
  );
}

export default Index;
