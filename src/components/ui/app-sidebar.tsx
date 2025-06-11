"use client"
import * as React from "react"
import { Link } from "react-router"

import {
  ArrowUpCircleIcon,
  ChartNoAxesCombined,
  LayoutDashboardIcon, 
  UsersIcon,
  BanknoteArrowDown,
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

const navItems = [
  { title: "Home", url: "/home", icon: LayoutDashboardIcon },
  { title: "Usuários", url: "/Users", icon: UsersIcon },
  { title: "Receitas", url: "/Receitas", icon: ChartNoAxesCombined },
  { title: "Despesas", url: "/Despesas", icon: BanknoteArrowDown },
  { title: "Team", url: "/team", icon: UsersIcon },
]

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas"  {...props}>
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
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
