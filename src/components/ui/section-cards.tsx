import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import '../../Pages/Dashboard/style.css'
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
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-2 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="card-circles h-26 text-sm">
        <CardHeader className="relative">
          <CardDescription className="line-clamp-1 flex  font-medium">Receitas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl  text-blue-500 font-semibold tabular-nums">
            {dashboard?.revenues ??""}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm mt-2">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Receita total do mês <TrendingUpIcon className="size-4" />
          </div>
        </CardFooter>
      </Card>

      <Card className="card-circles h-26 text-sm">
        <CardHeader className="relative text-black">
          <CardDescription className="line-clamp-1 flex  font-medium">Despesas em aberto</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl mt--3 text-2xl text-red-600 font-semibold tabular-nums">
            {dashboard?.expensesOpen  ??""}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium mt-2">
            Despesas em aberto para o mês <TrendingDownIcon className="size-4" />
          </div>
        </CardFooter>
      </Card>

      <Card className="card-circles h-26 text-sm">
        <CardHeader className="relative">
          <CardDescription>Despesas do mes</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold text-red-600 tabular-nums">
            {dashboard?.expenses  ??""}        
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            total de despesas para o mes <TrendingDownIcon className="size-4" />
          </div>
        </CardFooter>
      </Card>

      <Card className="card-circles h-26 text-sm" >
        <CardHeader className="relative">
          <CardDescription>Saldo em Carteira</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold text-blue-500 tabular-nums">
            {dashboard?.wallet ??""}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Saldo atual em carteira <TrendingUpIcon className="size-4" />
          </div>

        </CardFooter>
      </Card>
    </div>
  )
}
