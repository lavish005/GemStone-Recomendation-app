import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Heart, Eye, Grid3X3, LayoutList, X } from 'lucide-react';
import useAuthStore from '../store/authStore';

const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const categories = ['Precious', 'Semi-Precious', 'Rare'];
const benefits = ['Wealth', 'Health', 'Love', 'Career', 'Protection', 'Peace', 'Wisdom', 'Courage', 'Fame', 'Leadership', 'Beauty', 'Marriage'];

const Catalog = () => {
  const [gemstones, setGemstones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [filterZodiac, setFilterZodiac] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBenefit, setFilterBenefit] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();

  const { isAuthenticated, user, toggleWatchlist } = useAuthStore();

  useEffect(() => {
    const zodiacFromUrl = searchParams.get('zodiac');
    if (zodiacFromUrl) setFilterZodiac(zodiacFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const fetchGemstones = async () => {
      try {
        const params = {};
        if (filterColor) params.color = filterColor;
        if (filterZodiac) params.zodiac = filterZodiac;
        if (filterCategory) params.category = filterCategory;
        if (filterBenefit) params.benefit = filterBenefit;
        if (searchTerm) params.search = searchTerm;

        const res = await axios.get('http://localhost:5000/api/gemstones', { params });
        setGemstones(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchGemstones();
  }, [filterColor, filterZodiac, filterCategory, filterBenefit, searchTerm]);

  const colors = [...new Set(gemstones.map(g => g.color))];
  const activeFilters = [filterColor, filterZodiac, filterCategory, filterBenefit].filter(Boolean).length;

  const isInWatchlist = (id) => user?.watchlist?.some(g => (g._id || g) === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 font-display">Gemstone Collection</h1>
        <p className="mt-2 text-gray-500">Explore {gemstones.length} authentic astrological gemstones</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gem-primary)] focus:border-transparent text-sm transition-shadow"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'bg-[var(--color-gem-primary)] text-white border-transparent' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            <Filter className="h-4 w-4" /> Filters {activeFilters > 0 && <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">{activeFilters}</span>}
          </button>
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}><Grid3X3 className="h-4 w-4 text-gray-500" /></button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}><LayoutList className="h-4 w-4 text-gray-500" /></button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Zodiac Sign</label>
              <select value={filterZodiac} onChange={(e) => setFilterZodiac(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <option value="">All Signs</option>
                {zodiacSigns.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Color</label>
              <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <option value="">All Colors</option>
                {colors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Benefit</label>
              <select value={filterBenefit} onChange={(e) => setFilterBenefit(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <option value="">All Benefits</option>
                {benefits.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          {activeFilters > 0 && (
            <button onClick={() => { setFilterColor(''); setFilterZodiac(''); setFilterCategory(''); setFilterBenefit(''); }} className="mt-4 text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
              <X className="h-3 w-3" /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gem-primary)]"></div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gemstones.map((gem) => (
            <div key={gem._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover group relative">
              {isAuthenticated && (
                <button
                  onClick={(e) => { e.preventDefault(); toggleWatchlist(gem._id); }}
                  className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all ${isInWatchlist(gem._id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:text-red-500'}`}
                >
                  <Heart className="h-4 w-4" fill={isInWatchlist(gem._id) ? 'currentColor' : 'none'} />
                </button>
              )}
              <Link to={`/gemstone/${gem._id}`}>
                <div className="h-52 overflow-hidden bg-gray-100 relative">
                  <img src={gem.imageUrl} alt={gem.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent h-20"></div>
                  <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-black/30 backdrop-blur px-2 py-1 rounded">{gem.category}</span>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{gem.name}</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{gem.rulingPlanet} · {gem.chakra} Chakra · {gem.color}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {gem.benefits.slice(0, 3).map((b, i) => (
                      <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">{b}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-sm font-semibold text-[var(--color-gem-primary)]">{gem.priceRange}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Eye className="h-3 w-3" /> Details</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {gemstones.map((gem) => (
            <Link to={`/gemstone/${gem._id}`} key={gem._id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-5 card-hover group">
              <img src={gem.imageUrl} alt={gem.name} className="w-24 h-24 rounded-lg object-cover group-hover:scale-105 transition-transform" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{gem.name}</h3>
                    <p className="text-xs text-gray-400">{gem.rulingPlanet} · {gem.color} · {gem.category}</p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-gem-primary)]">{gem.priceRange}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2 line-clamp-1">{gem.description}</p>
                <div className="flex gap-1 mt-2">
                  {gem.benefits.slice(0, 4).map((b, i) => (
                    <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && gemstones.length === 0 && (
        <div className="text-center py-20">
          <Gem className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No gemstones found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default Catalog;
