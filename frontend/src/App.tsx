import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastProvider } from './lib/toast';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import TrendDetail from './pages/TrendDetail';
import Create from './pages/Create';
import Library from './pages/Library';
import Schedule from './pages/Schedule';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="discover" element={<Discover />} />
            <Route path="trends/:id" element={<TrendDetail />} />
            <Route path="create" element={<Create />} />
            <Route path="library" element={<Library />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
