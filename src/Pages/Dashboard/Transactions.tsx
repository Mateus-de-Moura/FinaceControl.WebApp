
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Calendar, CreditCard, DollarSign } from 'lucide-react';
import { Link } from 'react-router';

const TransactionCard = () => {
    const transactions = [
        {
            descricao: "Compra no Supermercado",
            valor: -150.50,
            data: "2024-01-15",
            pagamento: "Cartão de Crédito",
            tipo: "saida"
        },
        {
            descricao: "Salário",
            valor: 3500.00,
            data: "2024-01-01",
            pagamento: "Transferência",
            tipo: "entrada"
        },
        {
            descricao: "Conta de Luz",
            valor: -89.30,
            data: "2024-01-10",
            pagamento: "Débito Automático",
            tipo: "saida"
        },
        {
            descricao: "Freelance",
            valor: 800.00,
            data: "2024-01-12",
            pagamento: "PIX",
            tipo: "entrada"
        },
        {
            descricao: "Compra no Supermercado",
            valor: -150.50,
            data: "2024-01-15",
            pagamento: "Cartão de Crédito",
            tipo: "saida"
        }      
        
    ];

    const formatCurrency = (value: any) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(Math.abs(value));
    };

    const formatDate = (dateString: any) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
        });
    };

    const getTransactionIcon = (tipo: any) => {
        return tipo === 'entrada' ? (
            <ArrowUpRight className="w-4 h-4 text-green-600" />
        ) : (
            <ArrowDownLeft className="w-4 h-4 text-red-600" />
        );
    };

    const getPaymentIcon = (pagamento: any) => {
        if (pagamento.toLowerCase().includes('cartão')) {
            return <CreditCard className="w-3 h-3 text-gray-500" />;
        }
        return <DollarSign className="w-3 h-3 text-gray-500" />;
    };

    return (
        <div className="pl-6 pr-4 mt-5 w-[100%] md:w-[35%] md:pr-0 md:pl-0 md:mt-0">
            <Card className="p-0  border bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                <div className="p-6 pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Últimas Movimentações
                    </CardTitle>
                </div>

                <CardContent className="px-6 pb-6">
                    {/* Header da tabela */}
                    <div className="grid grid-cols-12 gap-2 pb-3 mb-4 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <div className="col-span-5">Descrição</div>
                        <div className="col-span-3 text-right">Valor</div>
                        <div className="col-span-2 text-center">Data</div>
                        <div className="col-span-2 text-center">Método</div>
                    </div>

                    {/* Lista de transações */}
                    <div className="space-y-2">
                        {transactions.map((transaction, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-12 gap-2 p-3 rounded-lg hover:bg-gray-50/80 transition-all duration-200 group border border-transparent hover:border-gray-200 hover:shadow-sm"
                            >
                                {/* Descrição com ícone */}
                                <div className="col-span-5 flex items-center gap-2">
                                    <div className="flex-shrink-0">
                                        {getTransactionIcon(transaction.tipo)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900 transition-colors">
                                        {transaction.descricao}
                                    </span>
                                </div>

                                {/* Valor */}
                                <div className="col-span-3 text-right">
                                    <span className={`text-sm font-semibold ${transaction.tipo === 'entrada'
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                        }`}>
                                        {transaction.tipo === 'entrada' ? '+' : '-'}{formatCurrency(transaction.valor)}
                                    </span>
                                </div>

                                {/* Data */}
                                <div className="col-span-2 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <Calendar className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-600">
                                            {formatDate(transaction.data)}
                                        </span>
                                    </div>
                                </div>

                                {/* Método de pagamento */}
                                <div className="col-span-2 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        {getPaymentIcon(transaction.pagamento)}
                                        <span className="text-xs text-gray-600 truncate">
                                            {transaction.pagamento}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Estado vazio */}
                    {transactions.length === 0 && (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <DollarSign className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-sm">Nenhuma transação encontrada</p>
                        </div>
                    )}

                    {/* Footer com resumo */}
                    <div className=" pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Total de {transactions.length} transações</span>
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Entradas
                                <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
                                Saídas
                            </span>
                        </div>
                    </div>

                    <div className='mt-3 text-blue-700 flex justify-center'>
                        <Link to='/transacoes'>Visualizar todas as transações</Link>
                    </div>
                </CardContent>

            </Card>


        </div>
    );
};

export default TransactionCard;

