import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";

interface SearchWithDateProps {
  onSearch: (searchText: string, startDate: Date | null, endDate: Date | null) => void;
  initialSearchText?: string;
  initialDateRange?: [Date | null, Date | null];
  showRangeDate?: boolean | null;
}

export const SearchWithDate = ({
  onSearch,
  initialSearchText = "",
  initialDateRange = [null, null],
  showRangeDate = true,
}: SearchWithDateProps) => {
  const [searchText, setSearchText] = useState(initialSearchText);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(initialDateRange);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (startDate && endDate) {
      onSearch(searchText, startDate, endDate);
    }
    if (startDate === null && endDate === null) {
      onSearch(searchText, null, null); // dispara busca ao limpar datas (clicar no X)
    }
  }, [startDate, endDate]);

  const handleSearch = () => {
    onSearch(searchText, startDate, endDate);
  };

  return (
    <div className="flex gap-2 items-end">
      <div>
        {showRangeDate &&
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
            placeholderText="Selecionar intervalo de datas"
            className="border border-input bg-background rounded px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-9 w-[210px]"
            dateFormat="dd/MM/yyyy"
            isClearable
          />
        }
      </div>
      <div className="w-72">
        <Input
          type="text"
          placeholder="Buscar"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div>
        <Button className="h-9" size="sm" variant="secondary" onClick={handleSearch}>
          <Search />
        </Button>
      </div>
    </div>
  );
};
