import { useState } from 'react';
import Overview from './Components/Overview';
import SecurityInfos from './Components/SecurityInfos';
import LoginLocationData from './Components/LoginLocationData';

const Account = () => {

    const [activeView, setActiveView] = useState<string>('overview');

    const handleSecutiryInfos = () => {

    }

    return (
        <div className='flex  h-full w-full '>
            <div className='w-[25%] h-full bg-gray-50'>
                <ul className='p-3 mb-8 mt-5'>
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
                     hover:border-gray-100 hover:rounded hover:bg-gray-100' onClick={() => setActiveView("LoginLocationData")}>
                        atividades recentes
                    </li>
                </ul>
            </div>

            <section className='w-full h-full px-5 mb-5 mt-5'>
                {activeView === 'overview' && <Overview onViewChange={setActiveView} />}
                {activeView === 'security' && <SecurityInfos />}
                {activeView === 'password' && <div>Senha</div>}
                {activeView === 'LoginLocationData' && <LoginLocationData/>}
            </section>
        </div>

    );
};

export default Account;
