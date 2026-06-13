import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import GemstoneDetail from './pages/GemstoneDetail';
import RecommendationEngine from './pages/RecommendationEngine';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import useAuthStore from './store/authStore';

function App() {
  const loadUser = useAuthStore(state => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[var(--color-gem-bg)] text-slate-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/gemstone/:id" element={<GemstoneDetail />} />
            <Route path="/recommend" element={<RecommendationEngine />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
