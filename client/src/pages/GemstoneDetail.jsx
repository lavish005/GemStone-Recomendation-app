import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, ShoppingBag, ArrowLeft, Star, Calendar, MapPin, Fingerprint, Gem } from 'lucide-react';
import useAuthStore from '../store/authStore';

const GemstoneDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gem, setGem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, toggleWatchlist, toggleSaved, addPurchase } = useAuthStore();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/gemstones/${id}`)
      .then(res => { setGem(res.data); setLoading(false); })
      .catch(() => { setLoading(false); navigate('/catalog'); });
  }, [id, navigate]);

  if (loading || !gem) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gem-primary)]"></div>
      </div>
    );
  }

  const isInWatchlist = user?.watchlist?.some(g => (g._id || g) === gem._id);
  const isSaved = user?.savedGemstones?.some(g => (g._id || g) === gem._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 text-sm font-medium">
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
            <img src={gem.imageUrl} alt={gem.name} className="w-full h-[450px] object-cover" />
          </div>
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-[var(--color-gem-primary)]">{gem.category}</span>
            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-gray-700">{gem.color}</span>
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 font-display mb-2">{gem.name}</h1>
          <p className="text-lg text-[var(--color-gem-primary)] font-semibold mb-6">{gem.priceRange}</p>
          <p className="text-gray-600 leading-relaxed mb-8">{gem.description}</p>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: 'Ruling Planet', value: gem.rulingPlanet, icon: Star },
              { label: 'Chakra', value: gem.chakra, icon: Gem },
              { label: 'Wear On', value: gem.wearingDay, icon: Calendar },
              { label: 'Finger', value: gem.wearingFinger, icon: Fingerprint },
              { label: 'Hardness', value: `${gem.hardness} / 10`, icon: Star },
              { label: 'Origin', value: gem.origin, icon: MapPin },
            ].map((prop, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <prop.icon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wider">{prop.label}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{prop.value}</p>
              </div>
            ))}
          </div>

          {/* Zodiac & Benefits */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Compatible Zodiac Signs</h3>
            <div className="flex flex-wrap gap-2">
              {gem.zodiacSigns.map((z, i) => (
                <span key={i} className="px-3 py-1.5 bg-blue-50 text-[var(--color-gem-primary)] rounded-lg text-sm font-medium border border-blue-100">{z}</span>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Benefits</h3>
            <div className="flex flex-wrap gap-2">
              {gem.benefits.map((b, i) => (
                <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">{b}</span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {isAuthenticated && (
            <div className="flex gap-3 border-t border-gray-100 pt-6">
              <button
                onClick={() => toggleWatchlist(gem._id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${isInWatchlist ? 'bg-red-50 text-red-600 border-2 border-red-200' : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-red-200 hover:text-red-600'}`}
              >
                <Heart className="h-4 w-4" fill={isInWatchlist ? 'currentColor' : 'none'} />
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
              <button
                onClick={() => addPurchase(gem._id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[var(--color-gem-primary)] to-blue-700 text-white hover:shadow-lg transition-all"
              >
                <ShoppingBag className="h-4 w-4" /> Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GemstoneDetail;
