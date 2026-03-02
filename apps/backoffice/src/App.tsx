import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Leads } from '@/pages/Leads';
import { BotConfig } from '@/pages/BotConfig';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="config" element={<BotConfig />} />
          <Route path="settings" element={<div className="text-center py-12 text-gray-500">Ajustes - Próximamente</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
