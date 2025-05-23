import { Routes, Route } from "react-router";
import Signin from "../Pages/Auth/Signin"
import Dasboard from '../Pages/Dashboard/index'
import { PrivateRoute } from "./PrivateRoute";
import Users from '../Pages/Users'
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/ui/site-header"
import CreateUser from "@/Pages/Users/Create";
import { ReactNode } from 'react';
import Account from '../Pages/Account/index'
import Update from "@/Pages/Users/Update";
import Revenues from '@/Pages/Revenues/index'

interface LayoutWithSidebarProps {
  children: ReactNode;
}

function LayoutWithSidebar({ children }: LayoutWithSidebarProps) {
  return (
    <SidebarProvider>
      <AppSidebar variant="sidebar" collapsible="icon" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}


function index() {
  return (

    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/home" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <Dasboard />
          </LayoutWithSidebar>
        </PrivateRoute>} />

      <Route path="/Users" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <Users />
          </LayoutWithSidebar>
        </PrivateRoute>} />

      <Route path="/Users/create" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <CreateUser />
          </LayoutWithSidebar>
        </PrivateRoute>} />

      <Route path="/Users/update/:id" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <Update />
          </LayoutWithSidebar>
        </PrivateRoute>} />

        <Route path="/Receitas" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <Revenues />
          </LayoutWithSidebar>
        </PrivateRoute>} />

      <Route path="/Account" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <Account />
          </LayoutWithSidebar>
        </PrivateRoute>} />
    </Routes>

  )
}

export default index