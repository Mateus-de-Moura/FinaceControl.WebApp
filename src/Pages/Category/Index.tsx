import { buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable/data-table";
import { GetCategories } from "@/Services/CategoryService";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Link } from "react-router";
import True from "../../assets/true.svg";
import False from "../../assets/false.svg";

interface CategoryTableProps {
  Id: string;
  Name: string;
  Type: string;
}

function Index() {
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => GetCategories(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const data = categoriesQuery.data || [];

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
        <div className="mt-3 mb-3 h-full">
          <DataTable columns={categoryColumns} data={data} />
        </div>
    </div>
  );
}

export default Index;
