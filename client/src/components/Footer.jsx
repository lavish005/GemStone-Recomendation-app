import { Link } from 'react-router-dom';
import { Gem } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-gem-dark)] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-gem-primary)] to-[var(--color-gem-secondary)] flex items-center justify-center">
                <Gem className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">LuminaGems</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">Discover your perfect astrological gemstone with AI-powered precision. Guided by Vedic astrology and modern technology.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link></li>
              <li><Link to="/recommend" className="hover:text-white transition-colors">AI Recommendation</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} LuminaGems. All rights reserved. Powered by Gemini AI.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
