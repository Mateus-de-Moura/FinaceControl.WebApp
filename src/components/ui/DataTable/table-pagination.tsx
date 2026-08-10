import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function TablePagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-slate-600">
      <span>
        Página {page} de {safeTotalPages} ({totalCount} {totalCount === 1 ? "item" : "itens"})
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Página anterior"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex h-9 min-w-9 items-center justify-center rounded-md border bg-white px-3 text-slate-900">
        {page}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Próxima página"
        disabled={page >= safeTotalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Select
        value={String(pageSize)}
        onValueChange={(value) => onPageSizeChange(Number(value))}
      >
        <SelectTrigger className="w-[80px]" aria-label="Itens por página">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[10, 20, 50].map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
