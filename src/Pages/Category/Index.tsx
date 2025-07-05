import { Button, buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable/data-table";
import { GetPagedCategory } from "@/Services/CategoryService";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import True from "../../assets/true.svg";
import False from "../../assets/false.svg";
import { Edit, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryTableProps {
  Id: string;
  Name: string;
  Type: string;
}

function Index() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [type, setType] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["categories", search, page, type],
    queryFn: () => GetPagedCategory(search, type, page),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const currentPage = page;
  const totalPages = categoriesQuery.data?.totalPages || 1;
  const totalCount = categoriesQuery.data?.totalCount;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const data = categoriesQuery.data?.items || [];
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
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

          <div style={iconStyle}>
            {IsActive ? (
              <img src={True} alt="Ativo" />
            ) : (
              <img src={False} alt="Inativo" />
            )}
          </div>;

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
          const value = info.getValue();
          const typeMap: {[key: number]: string} = {
            1: "Despesa",
            2: "Receita"
          };
          return typeMap[value as number] || "Desconhecido";
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
    <div className="p-5">
      <div className="flex items-center justify-between gap-12 mb-3">
        <h6 className="font-semibold">Gerenciamento de categorias</h6>
        <Link
          to="/Categorias/Create"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          Cadastrar nova categoria
        </Link>
      </div>

      <Card className="p-5 bg-white h-[620px]">
        <div className='w-full flex justify-end gap-2'>
          <div className="p-2 flex justify-end gap-4 w-full">
             <Select onValueChange={(value) => setType(value === "all" ? "" : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione um Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">
                  Todos
                </SelectItem>
                <SelectItem key="1" value="1">
                  Despesa
                </SelectItem>
                <SelectItem key="2" value="2">
                  Receita
                </SelectItem>
              </SelectContent>
            </Select>

          <div className='w-72 self-end '>
            <Input
              type="text"
              placeholder="Buscar"
              value={inputCategory}
              onChange={(e) => setInputCategory(e.target.value)}
              className="border rounded"
            />
          </div>

          <div className="self-end">
            <Button
              className="h-9"
              size="sm"
              variant={"secondary"}
              onClick={() => setSearch(inputCategory)}
            >
              <Search />
            </Button>
          </div>
          </div>
        </div>

        <div className="mt-3 mb-3 h-full">
          <DataTable columns={categoryColumns} data={data} />
        </div>

        <div className="pl-6 pr-6 mt-5">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {pages.map((p) => (
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
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              <PaginationItem>
                <div className="ml-8">
                  Mostrando {data.length} de {totalCount} Registros
                </div>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
}

export default Index;
