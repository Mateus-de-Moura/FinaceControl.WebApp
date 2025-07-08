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
import RevenuesCreate from '../Pages/Revenues/Create'
import RevenuesUpdate from '../Pages/Revenues/Update'
import Expenses from '@/Pages/Expenses/Index'
import ExpensesCreate from "@/Pages/Expenses/Create"
import ExpensesUpdate from "@/Pages/Expenses/Update"
import Category from "@/Pages/Category/Index"
import CategoryCreate from "@/Pages/Category/Create"
import Notify from "@/Pages/Notify/Notify";
import Transaction from '@/Pages/Transactions/index'
import TransactionsCreate from '@/Pages/Transactions/Create'
import TransactionsUpdate from '@/Pages/Transactions/Update'

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

      <Route path="/Receitas/Create" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <RevenuesCreate />
          </LayoutWithSidebar>
        </PrivateRoute>} />

      <Route path="/Receitas/Update/:id" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <RevenuesUpdate />
          </LayoutWithSidebar>
        </PrivateRoute>} />

      <Route path="/Despesas" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <Expenses />
          </LayoutWithSidebar>
        </PrivateRoute>} />

      <Route path="/Despesas/Create" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <ExpensesCreate />
          </LayoutWithSidebar>
        </PrivateRoute>} />

      <Route path="/Despesas/Update/:id" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <ExpensesUpdate />
          </LayoutWithSidebar>
        </PrivateRoute>} />

      <Route path="/Categorias" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <Category />
          </LayoutWithSidebar>
        </PrivateRoute>} />

      <Route path="/Categorias/Create" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <CategoryCreate />
          </LayoutWithSidebar>
        </PrivateRoute>} />

      <Route path="/Account" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <Account />
          </LayoutWithSidebar>
        </PrivateRoute>} />

      <Route path="/Notificações" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <Notify />
          </LayoutWithSidebar>
        </PrivateRoute>} />

      <Route path="/transacoes" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <Transaction />
          </LayoutWithSidebar>
        </PrivateRoute>} />

         <Route path="/transacoes/Create" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <TransactionsCreate />
          </LayoutWithSidebar>
        </PrivateRoute>} />

        <Route path="/transacoes/Update/:id" element={
        <PrivateRoute>
          <LayoutWithSidebar>
            <TransactionsUpdate />
          </LayoutWithSidebar>
        </PrivateRoute>} />

    </Routes>
  )
}

export default index