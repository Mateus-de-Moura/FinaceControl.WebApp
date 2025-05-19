import './index.css';
import AppRoutes from './Routes/index'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './Pages/Auth/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
