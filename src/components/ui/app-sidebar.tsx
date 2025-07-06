"use client"
import * as React from "react"
import { Link } from "react-router"
import { useSidebar } from "@/components/ui/sidebar"
import {
  ArrowUpCircleIcon,
  ChartNoAxesCombined,
  UsersIcon,
  BanknoteArrowDown,
  ChartBarStacked,
  CreditCard,
  House
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { NavMain } from "@/components/ui/nav-main"
import { NavUser } from "@/components/ui/nav-user"

const navItensCad = [
  { title: "Usuários", url: "/Users", icon: UsersIcon },
  { title: "Receitas", url: "/Receitas", icon: ChartNoAxesCombined },
  { title: "Despesas", url: "/Despesas", icon: BanknoteArrowDown },
  { title: "Categorias", url: "/Categorias", icon: ChartBarStacked },
  { title: "Transações", url: "/transacoes", icon: CreditCard },
]

const navItems = [
  { title: "Home", url: "/home", icon: House },
  // { title: "Team", url: "/team", icon: UsersIcon },
]

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  return (
    <Sidebar collapsible="icon"  {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/home">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Controle de Finanças</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />

        {state === "expanded" && (
          <>
            <div className="px-3 mt-1">
              <p>Cadastros</p>
            </div>           
          </>
        )}

        <NavMain items={navItensCad} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
