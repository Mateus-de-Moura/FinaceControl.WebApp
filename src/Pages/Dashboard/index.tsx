import { SectionCards } from "@/components/ui/section-cards"
import { DataTable } from "@/components/ui/DataTable/data-table"
import { columns } from "@/components/ui/DataTable/colunas"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"


import data from './data.json'
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export default function Page() {

    return (
        <div className="flex flex-1 flex-col ">
            <div className="@container/main flex flex-1 flex-col ">
                <div className="pl-5 pt-5">
                    <h6 className="text-blue-700 font-semibold">DashBoard</h6>
                </div>
                <div className="flex flex-col gap-5 py-4 md:gap-6 md:py-4">
                    <SectionCards />
                </div>
                <div className="flex w-[98%]">
                    <div className="w-[100%]">
                        <div className="pl-6 pr-4">
                            <DataTable columns={columns} data={data} />
                        </div>

                        <div className="pl-6 pr-6 mt-3">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext href="#" />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>

                        </div>

                    </div>
                    <div className="w-[31%]">
                        <Card className="p-4 ">
                            <CardTitle>
                                Ultimas Movimentações
                            </CardTitle>
                            <CardContent className="mt-5 ">
                                <ul>
                                    <li>
                                        teste lista de movimentação
                                    </li>
                                    <li>
                                        teste lista de movimentação
                                    </li>
                                    <li>
                                        teste lista de movimentação
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                </div>




            </div>
        </div>
    )
}
