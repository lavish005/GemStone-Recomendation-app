import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Brain, Star, Gem } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const zodiacEmoji = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

const Home = () => {
  const [featuredGems, setFeaturedGems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/gemstones').then(res => {
      setFeaturedGems(res.data.slice(0, 4));
    }).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 z-0"></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(5,150,105,0.15) 0%, transparent 50%)' }}></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-blue-500/10 blur-2xl animate-float"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-amber-500/10 blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 text-blue-200 text-sm font-medium mb-8 border border-white/10 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" /> Powered by Gemini AI
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-8 font-display leading-tight">
              Discover Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400">
                Cosmic Gemstone
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-300 mx-auto mb-12 leading-relaxed">
              AI-powered astrological analysis meets ancient Vedic wisdom. Find the perfect gemstone aligned with your birth chart, zodiac, and life purpose.
            </p>
            <div className="flex justify-center gap-4 flex-col sm:flex-row">
              <Link
                to="/recommend"
                className="inline-flex justify-center items-center px-8 py-4 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-[var(--color-gem-primary)] to-blue-600 hover:shadow-2xl hover:shadow-blue-500/25 transition-all transform hover:-translate-y-1"
              >
                <Brain className="mr-2 h-5 w-5" /> AI Recommendation
              </Link>
              <Link
                to="/catalog"
                className="inline-flex justify-center items-center px-8 py-4 text-lg font-semibold rounded-xl text-white bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur transition-all"
              >
                Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Zodiac Strip */}
      <section className="bg-white border-b border-gray-100 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center overflow-x-auto gap-4 no-scrollbar">
            {Object.entries(zodiacEmoji).map(([sign, emoji]) => (
              <Link key={sign} to={`/catalog?zodiac=${sign}`} className="flex flex-col items-center gap-1 min-w-[60px] group cursor-pointer">
                <span className="text-2xl group-hover:scale-125 transition-transform">{emoji}</span>
                <span className="text-xs text-gray-500 group-hover:text-[var(--color-gem-primary)] font-medium">{sign}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[var(--color-gem-secondary)] font-semibold text-sm uppercase tracking-wider">Why LuminaGems</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 font-display">The Smart Way to Choose Gemstones</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Brain, color: 'blue', title: 'AI-Powered Analysis', desc: 'Google Gemini AI analyzes your birth chart for hyper-personalized gemstone recommendations.' },
              { icon: ShieldCheck, color: 'emerald', title: '100% Authentic', desc: 'Every gemstone is certified authentic with complete origin and quality documentation.' },
              { icon: Heart, color: 'amber', title: 'Vedic Expertise', desc: 'Built on centuries of Vedic astrological wisdom combined with modern technology.' }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 card-hover group">
                <div className={`w-14 h-14 rounded-xl bg-${item.color}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`h-7 w-7 text-${item.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gemstones */}
      {featuredGems.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-[var(--color-gem-secondary)] font-semibold text-sm uppercase tracking-wider">Collection</span>
                <h2 className="text-4xl font-bold text-gray-900 mt-3 font-display">Featured Gemstones</h2>
              </div>
              <Link to="/catalog" className="text-[var(--color-gem-primary)] font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredGems.map((gem) => (
                <Link to={`/gemstone/${gem._id}`} key={gem._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover group">
                  <div className="h-52 overflow-hidden relative bg-gray-100">
                    <img src={gem.imageUrl} alt={gem.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-[var(--color-gem-primary)]">{gem.category}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{gem.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{gem.rulingPlanet} · {gem.color}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[var(--color-gem-secondary)]">{gem.priceRange}</span>
                      <span className="text-xs text-gray-400">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-[var(--color-gem-primary)] to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <Gem className="h-12 w-12 text-white/50 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">Ready to Find Your Stone?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Let our AI analyze your birth details and recommend the perfect gemstone aligned with your cosmic energy.</p>
          <Link to="/recommend" className="inline-flex items-center px-8 py-4 bg-white text-[var(--color-gem-primary)] font-bold rounded-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            Start Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
