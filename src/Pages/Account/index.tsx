import { useState } from 'react';
import Overview from './Components/Overview';
import SecurityInfos from './Components/securityInfos';


const Account = () => {

    const [activeView, setActiveView] = useState<string>('overview');

    const handleSecutiryInfos = () => {

    }

    return (
        <div className='flex p-5 h-full mb-5'>
            <div className='w-[30%] h-full'>
                <ul className='p-3 mb-8'>
                    <li className='mb-3 font-semibold cursor-pointer hover:border px-5
                     hover:border-gray-100 hover:rounded hover:bg-gray-100' onClick={() => setActiveView("overview")}>
                        Visão Geral
                    </li>
                    <li className='mb-3 font-semibold cursor-pointer hover:border px-5
                     hover:border-gray-100 hover:rounded hover:bg-gray-100' onClick={() => setActiveView("security")} >
                        Informações de segurança
                    </li>
                    <li className='mb-3 font-semibold cursor-pointer px-5 hover:border
                     hover:border-gray-100 hover:rounded hover:bg-gray-100' onClick={() => setActiveView("password")}>
                        Senha
                    </li>
                    <li className='mb-3 font-semibold cursor-pointer px-5 hover:border
                     hover:border-gray-100 hover:rounded hover:bg-gray-100' onClick={() => setActiveView("privacy")}>
                        Configuração de privacidade
                    </li>
                </ul>
            </div>

            <section className='w-[70%] h-full px-5 mb-5'>
                {activeView === 'overview' && <Overview onViewChange={setActiveView} />}
                {activeView === 'security' && <SecurityInfos />}
                {activeView === 'password' && <div>Senha</div>}
                {activeView === 'privacy' && <div>Privacidade</div>}
            </section>
        </div>

    );
};

export default Account;
