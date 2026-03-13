"use client";

import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  LayoutDashboard,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Api from "@/Api";
import { GetDashboard } from "@/Services/dashboardServices";
import { GetRecentTransactions } from "@/Services/TransactionService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardResponse = {
  revenues?: string | number;
  expenses?: string | number;
  wallet?: string | number;
  expensesOpen?: string | number;
  monthlySummary?: Array<{ month: string; revenues: string | number; expenses: string | number }>;
};

type RevenueItem = { description?: string; category?: string; value?: string | number; date?: string };
type ExpenseItem = { description?: string; categoryName?: string; value?: string | number; dueDate?: string; statusName?: string };
type TransactionItem = { description?: string; category?: string; value?: string | number; transactionDate?: string; type?: string | number; status?: string };
type RecentTransactionItem = { description?: string; value?: string | number; transactionDate?: string; type?: string | number };
type PagedResponse<T> = { items?: T[]; totalPages?: number; Items?: T[]; TotalPages?: number };

const categoryColors = ["#30B668", "#2EA8DF", "#F7B928", "#F97316", "#9A6FCE", "#F43F5E"];
const monthFallback = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number.isFinite(value) ? value : 0);

const parseCurrency = (raw?: string | number | null): number => {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0;
  if (!raw) return 0;
  let normalized = String(raw).trim().replace(/[^\d,.-]/g, "");
  if (normalized.includes(",") && normalized.includes(".")) normalized = normalized.replace(/\./g, "").replace(",", ".");
  else if (normalized.includes(",")) normalized = normalized.replace(",", ".");
  const result = Number(normalized);
  return Number.isFinite(result) ? result : 0;
};

const parseDate = (raw?: string): Date | null => {
  if (!raw) return null;
  if (raw.includes("/")) {
    const [day, month, year] = raw.split("/").map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getDay = (raw?: string) => parseDate(raw)?.getDate() ?? null;
const isIncome = (type?: string | number) =>
  typeof type === "number" ? type === 0 : String(type || "").toLowerCase().includes("receita") || String(type || "").toLowerCase().includes("entrada");
const isConfirmed = (status?: string) => !status || status.toLowerCase().includes("confirmado");
const isPaid = (statusName?: string) => !statusName || statusName.toLowerCase().includes("pago");

const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toIso = (date: Date) => date.toISOString().split("T")[0];
  return {
    startIso: toIso(start),
    endIso: toIso(end),
    daysInMonth: end.getDate(),
    monthLabel: start.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
  };
};

async function fetchAllPages<T>(url: string, baseParams: Record<string, string | number | undefined>) {
  const all: T[] = [];
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const response = await Api.get<PagedResponse<T>>(url, {
      params: { ...baseParams, PageNumber: page, PageSize: 200 },
    });
    const data = response.data;
    all.push(...(data.items ?? data.Items ?? []));
    totalPages = Number(data.totalPages ?? data.TotalPages ?? 1) || 1;
    page += 1;
  }
  return all;
}

function SummaryCard(props: {
  title: string;
  value: string;
  subtitle: string;
  gradient: string;
  trend: Array<{ index: number; value: number }>;
  icon: React.ReactNode;
  badge?: string;
}) {
  return (
    <Card className={`h-[126px] border-0 shadow-sm ${props.gradient}`}>
      <CardContent className="px-4 py-2 text-white">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-white/90">{props.title}</p>
            <h3 className="mt-0.5 truncate text-[2.15rem] leading-none font-semibold">{props.value}</h3>
            <p className="mt-0.5 text-xs text-white/90">{props.subtitle}</p>
          </div>
          {props.badge ? (
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-700">{props.badge}</span>
          ) : (
            <span className="rounded-full bg-white/15 p-1.5">{props.icon}</span>
          )}
        </div>
        <div className="mt-1 h-5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={props.trend}>
              <Line type="monotone" dataKey="value" stroke="#fff" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const monthRange = React.useMemo(() => getMonthRange(), []);

  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: GetDashboard,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const detailsQuery = useQuery({
    queryKey: ["home-details", monthRange.startIso, monthRange.endIso],
    queryFn: async () => {
      const [revenues, expenses, transactions, recentTransactions] = await Promise.all([
        fetchAllPages<RevenueItem>("/api/Revenues", { StartDate: monthRange.startIso, EndDate: monthRange.endIso }),
        fetchAllPages<ExpenseItem>("/api/Expense/paged", { StartDate: monthRange.startIso, EndDate: monthRange.endIso }),
        fetchAllPages<TransactionItem>("/api/Transactions", { StartDate: monthRange.startIso, EndDate: monthRange.endIso }),
        GetRecentTransactions(),
      ]);
      return { revenues, expenses, transactions, recentTransactions: Array.isArray(recentTransactions) ? recentTransactions : [] };
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const dashboard = dashboardQuery.data?.data as DashboardResponse | undefined;
  const details = detailsQuery.data;

  const monthly = React.useMemo(() => {
    const source = dashboard?.monthlySummary ?? [];
    if (!source.length) return monthFallback.map((month) => ({ month, revenues: 0, expenses: 0 }));
    return source.map((item) => ({
      month: item.month?.slice(0, 3) || "",
      revenues: parseCurrency(item.revenues),
      expenses: parseCurrency(item.expenses),
    }));
  }, [dashboard?.monthlySummary]);

  const trends = React.useMemo(() => {
    const revenues = monthly.map((item, i) => ({ index: i + 1, value: item.revenues }));
    const expenses = monthly.map((item, i) => ({ index: i + 1, value: item.expenses }));
    let running = 0;
    const wallet = monthly.map((item, i) => {
      running += item.revenues - item.expenses;
      return { index: i + 1, value: running };
    });
    const economy = monthly.map((item, i) => ({ index: i + 1, value: Math.max(item.revenues - item.expenses, 0) }));
    return { revenues, expenses, wallet, economy };
  }, [monthly]);

  const revenuesTotal = parseCurrency(dashboard?.revenues);
  const expensesTotal = parseCurrency(dashboard?.expenses);
  const walletTotal = parseCurrency(dashboard?.wallet);
  const expensesOpen = parseCurrency(dashboard?.expensesOpen);
  const economyTotal = Math.max(revenuesTotal - expensesTotal, 0);
  const savingsGoal = revenuesTotal * 0.2;
  const savingsProgress = savingsGoal > 0 ? (economyTotal / savingsGoal) * 100 : 0;
  const elapsedDays = Math.min(new Date().getDate(), monthRange.daysInMonth);
  const projectedExpenses = elapsedDays > 0 ? (expensesTotal / elapsedDays) * monthRange.daysInMonth : expensesTotal;
  const budgetLimit = revenuesTotal * 0.8;
  const budgetUsage = budgetLimit > 0 ? (projectedExpenses / budgetLimit) * 100 : 0;
  const avgExpenseDay = monthRange.daysInMonth ? expensesTotal / monthRange.daysInMonth : 0;

  const expenseRows = React.useMemo(() => {
    const rows: Array<{ name: string; category: string; value: number }> = [];
    for (const expense of details?.expenses ?? []) {
      rows.push({ name: expense.description || "Sem descricao", category: expense.categoryName || "Sem categoria", value: parseCurrency(expense.value) });
    }
    for (const tx of details?.transactions ?? []) {
      if (isIncome(tx.type)) continue;
      rows.push({ name: tx.description || "Sem descricao", category: tx.category || "Sem categoria", value: parseCurrency(tx.value) });
    }
    return rows.filter((row) => row.value > 0);
  }, [details?.expenses, details?.transactions]);

  const categoryData = React.useMemo(() => {
    const grouped = new Map<string, number>();
    for (const item of expenseRows) grouped.set(item.category, (grouped.get(item.category) ?? 0) + item.value);
    const sorted = Array.from(grouped.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
    const total = sorted.reduce((sum, item) => sum + item.value, 0);
    return sorted.map((item, i) => ({ ...item, percent: total > 0 ? (item.value / total) * 100 : 0, fill: categoryColors[i % categoryColors.length] }));
  }, [expenseRows]);

  const top5 = React.useMemo(() => [...expenseRows].sort((a, b) => b.value - a.value).slice(0, 5), [expenseRows]);

  const dailyFlow = React.useMemo(() => {
    const byDay = Array.from({ length: monthRange.daysInMonth }, (_, i) => ({ day: i + 1, entradas: 0, saidas: 0 }));
    const add = (day: number | null, key: "entradas" | "saidas", value: number) => {
      if (!day || day < 1 || day > monthRange.daysInMonth) return;
      byDay[day - 1][key] += value;
    };
    for (const row of details?.revenues ?? []) add(getDay(row.date), "entradas", parseCurrency(row.value));
    for (const row of details?.expenses ?? []) if (isPaid(row.statusName)) add(getDay(row.dueDate), "saidas", parseCurrency(row.value));
    for (const row of details?.transactions ?? []) {
      const day = getDay(row.transactionDate);
      const value = parseCurrency(row.value);
      if (isIncome(row.type) && isConfirmed(row.status)) add(day, "entradas", value);
      if (!isIncome(row.type) && isConfirmed(row.status)) add(day, "saidas", value);
    }
    return byDay;
  }, [details?.revenues, details?.expenses, details?.transactions, monthRange.daysInMonth]);

  const cumulativeFlow = React.useMemo(() => {
    let balance = 0;
    return dailyFlow.map((point) => {
      balance += point.entradas - point.saidas;
      return { day: point.day, saldo: balance };
    });
  }, [dailyFlow]);

  const recent = React.useMemo(() => {
    const source = (details?.recentTransactions ?? []) as RecentTransactionItem[];
    return source.map((row) => ({
      description: row.description || "Movimento sem descricao",
      amount: parseCurrency(row.value),
      isIncome: isIncome(row.type),
      date: parseDate(row.transactionDate),
    }));
  }, [details?.recentTransactions]);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#f4f6fb]">
      <div className="flex flex-1 flex-col px-4 pb-5 pt-5 lg:px-6">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="flex flex-col gap-2 px-4 py-2.5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <span className="rounded-lg border border-blue-100 bg-blue-50 p-1.5 text-blue-700"><LayoutDashboard className="h-4 w-4" /></span>
              <div>
                <h1 className="text-lg font-semibold text-blue-700">DashBoard</h1>
                <p className="text-xs text-slate-500">Monitoramento de financas em tempo real</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="capitalize">{monthRange.monthLabel}</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-4">
          <SummaryCard title="Receitas" value={formatCurrency(revenuesTotal)} subtitle="Receitas totais do mes" gradient="bg-gradient-to-r from-emerald-500 to-emerald-400" icon={<TrendingUp className="h-5 w-5 text-white" />} trend={trends.revenues} />
          <SummaryCard title="Despesas" value={formatCurrency(expensesTotal)} subtitle="Total de despesas no mes" gradient="bg-gradient-to-r from-rose-500 to-red-400" icon={<TrendingDown className="h-5 w-5 text-white" />} trend={trends.expenses} />
          <SummaryCard title="Saldo em Carteira" value={formatCurrency(walletTotal)} subtitle="Saldo atual em carteira" gradient="bg-gradient-to-r from-blue-500 to-blue-400" icon={<Wallet className="h-5 w-5 text-white" />} trend={trends.wallet} />
          <SummaryCard title="Economia do Mes" value={formatCurrency(economyTotal)} subtitle={`Meta: ${formatCurrency(savingsGoal)}`} badge={`${Math.round(Math.max(savingsProgress, 0))}%`} gradient="bg-gradient-to-r from-amber-400 to-yellow-300" icon={<PiggyBank className="h-5 w-5 text-white" />} trend={trends.economy} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 2xl:grid-cols-2">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-2xl text-slate-800">Receitas x Despesas</CardTitle></CardHeader>
            <CardContent className="h-[330px] pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip formatter={(value: number) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenues" name="Receitas" fill="#3EC850" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" name="Despesas" fill="#FB2C36" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-2xl text-slate-800">Fluxo de Caixa Diario</CardTitle></CardHeader>
            <CardContent className="h-[330px] pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyFlow}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} interval={Math.max(Math.floor(monthRange.daysInMonth / 10), 1)} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip formatter={(value: number) => formatCurrency(Number(value))} />
                  <Line type="monotone" dataKey="entradas" stroke="#22C55E" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="saidas" stroke="#FB2C36" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 2xl:grid-cols-12">
          <div className="grid gap-4 2xl:col-span-4">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-2xl text-slate-800">Despesas por Categoria</CardTitle></CardHeader>
              <CardContent className="grid gap-4 pb-4 lg:grid-cols-[1.1fr_1fr]">
                <div className="h-[230px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                        {categoryData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 self-center">
                  {categoryData.length === 0 && <p className="text-sm text-slate-500">Sem despesas para o periodo.</p>}
                  {categoryData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-700">{item.percent.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-2xl text-slate-800">Media de Gastos por Dia</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-between gap-4 pb-4">
                <div>
                  <p className="text-[2.3rem] font-semibold leading-none text-slate-800">{formatCurrency(avgExpenseDay)}</p>
                  <p className="mt-2 text-sm text-slate-500">Limite diario sugerido: {formatCurrency(budgetLimit / Math.max(monthRange.daysInMonth, 1))}</p>
                </div>
                <div className="h-[130px] w-[170px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart data={[{ value: Math.min(Math.max((avgExpenseDay / Math.max(budgetLimit / Math.max(monthRange.daysInMonth, 1), 1)) * 100, 0), 100) }]} innerRadius="65%" outerRadius="100%" startAngle={180} endAngle={0}>
                      <RadialBar dataKey="value" cornerRadius={10} fill="#22C55E" background={{ fill: "#E2E8F0" }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 2xl:col-span-4">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-2xl text-slate-800">Fluxo de Caixa Diario</CardTitle></CardHeader>
              <CardContent className="h-[260px] pb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cumulativeFlow}>
                    <defs>
                      <linearGradient id="cashFlowFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} interval={Math.max(Math.floor(monthRange.daysInMonth / 10), 1)} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                    <Tooltip formatter={(value: number) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="saldo" stroke="#22C55E" fill="url(#cashFlowFill)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-2xl text-slate-800">Top 5 Gastos</CardTitle></CardHeader>
              <CardContent className="space-y-3 pb-4">
                {top5.length === 0 && <p className="text-sm text-slate-500">Nenhum gasto encontrado para o periodo.</p>}
                {top5.map((item) => (
                  <div key={`${item.name}-${item.value}`} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                    <span className="truncate text-sm text-slate-700">{item.name}</span>
                    <span className="text-sm font-semibold text-slate-800">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 2xl:col-span-2">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-2xl text-slate-800">Saldo Acumulado</CardTitle></CardHeader>
              <CardContent className="pb-4">
                <p className="text-[2.3rem] font-semibold leading-none text-emerald-600">{formatCurrency(walletTotal)}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" style={{ width: `${Math.min(Math.max((walletTotal / Math.max(revenuesTotal, 1)) * 100, 0), 100)}%` }} />
                </div>
                <p className="mt-2 text-sm text-slate-500">Despesas em aberto: {formatCurrency(expensesOpen)}</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-2xl text-slate-800">Ultimas Movimentacoes</CardTitle></CardHeader>
              <CardContent className="space-y-3 pb-4">
                {recent.length === 0 && <p className="text-sm text-slate-500">Nenhuma movimentacao recente.</p>}
                {recent.map((item, index) => (
                  <div key={`${item.description}-${index}`} className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      {item.isIncome ? <ArrowUpRight className="h-4 w-4 shrink-0 text-emerald-500" /> : <ArrowDownRight className="h-4 w-4 shrink-0 text-rose-500" />}
                      <span className="truncate text-sm text-slate-700">{item.description}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${item.isIncome ? "text-emerald-600" : "text-rose-600"}`}>{item.isIncome ? "+" : "-"} {formatCurrency(item.amount)}</p>
                      <p className="text-xs text-slate-500">{item.date ? item.date.toLocaleDateString("pt-BR") : "--/--/----"}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-2 text-center"><Link to="/transacoes" className="text-sm font-medium text-blue-700 hover:underline">Visualizar todas as transacoes</Link></div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 2xl:col-span-2">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-2xl text-slate-800">Previsao de Gastos do Mes</CardTitle></CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-slate-500">Projecao</p>
                <p className="text-[2rem] font-semibold leading-none text-slate-800">{formatCurrency(projectedExpenses)}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(Math.max((projectedExpenses / Math.max(budgetLimit, 1)) * 100, 0), 100)}%` }} />
                </div>
                <p className="mt-3 text-sm text-slate-500">Orcamento: {formatCurrency(budgetLimit)}</p>
                <p className={`mt-2 text-right text-3xl font-semibold ${budgetUsage > 100 ? "text-rose-500" : "text-emerald-500"}`}>{Math.round(Math.max(budgetUsage, 0))}%</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between gap-2 text-2xl text-slate-800">
                  <span>Meta de Economia</span>
                  <span className="rounded-full bg-amber-300 px-2 py-0.5 text-sm font-semibold text-slate-700">{Math.round(Math.max(savingsProgress, 0))}%</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-[2.3rem] font-semibold leading-none text-emerald-600">{formatCurrency(economyTotal)}</p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" style={{ width: `${Math.min(Math.max(savingsProgress, 0), 100)}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                  <span>Meta mensal</span>
                  <span className="font-medium text-slate-700">{formatCurrency(savingsGoal)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
