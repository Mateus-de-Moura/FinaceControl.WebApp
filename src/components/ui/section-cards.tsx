import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GetDashboard } from "@/Services/dashboardServices";
import { useQuery } from '@tanstack/react-query';;

export function SectionCards() {

  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: GetDashboard,
    refetchOnWindowFocus: false,     
    refetchOnReconnect: false,      
    retry: false,                   
  });
  const dashboard = dashboardQuery.data?.data; 

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 lg:px-6 w-full">
      <Card className="card-circles h-26 text-sm bg-green-500 flex-1">
        <CardHeader className="relative">
          <CardDescription className="line-clamp-1 flex font-medium text-white">Receitas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl text-white font-semibold tabular-nums">
            {dashboard?.revenues ??""}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm mt-2">
          <div className="line-clamp-1 flex gap-2 font-medium text-white">
            Receita total do mês <TrendingUpIcon className="size-4" />
          </div>
        </CardFooter>
      </Card>

      <Card className="card-circles h-26 text-sm bg-red-500 flex-1">
        <CardHeader className="relative">
          <CardDescription className="text-white">Despesas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold text-white tabular-nums">
            {dashboard?.expenses ??""}        
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-white">
            Total de despesas para o mês <TrendingDownIcon className="size-4" />
          </div>
        </CardFooter>
      </Card>

      <Card className="card-circles h-26 text-sm bg-blue-500 flex-1">
        <CardHeader className="relative">
          <CardDescription className="text-white">Saldo em Carteira</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold text-white tabular-nums">
            {dashboard?.wallet ??""}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-white">
            Saldo atual em carteira <TrendingUpIcon className="size-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
