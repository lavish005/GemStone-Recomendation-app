import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Gem, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const login = useAuthStore(state => state.login);
  const loading = useAuthStore(state => state.loading);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50 z-0"></div>
      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-gem-primary)] to-[var(--color-gem-secondary)] flex items-center justify-center mx-auto mb-4">
              <Gem className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-display">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-[var(--color-gem-primary)] hover:underline">Sign up</Link>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gem-primary)] focus:border-transparent focus:bg-white transition-all text-sm"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gem-primary)] focus:border-transparent focus:bg-white transition-all text-sm pr-11"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[var(--color-gem-primary)] to-blue-600 hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
