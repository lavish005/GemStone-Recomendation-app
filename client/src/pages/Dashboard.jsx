import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingBag, History, Gem, Star, Calendar, MapPin, Settings, Brain, LayoutDashboard, ArrowRight, Eye, Sparkles } from 'lucide-react';

const zodiacEmoji = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

const Dashboard = () => {
  const { user, isAuthenticated, loadUser, token, toggleWatchlist } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', dob: '', placeOfBirth: '', zodiacSign: '' });

  const handleEditClick = () => {
    setProfileForm({
      name: user.name || '',
      dob: user.dob ? user.dob.split('T')[0] : '',
      placeOfBirth: user.placeOfBirth || '',
      zodiacSign: user.zodiacSign || ''
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    const res = await useAuthStore.getState().updateProfile(profileForm);
    if (res.success) {
      setIsEditingProfile(false);
    } else {
      alert(res.message);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !token) {
      navigate('/login');
    } else if (token) {
      loadUser().then(() => setLoading(false));
    }
  }, [isAuthenticated, token, navigate, loadUser]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gem-primary)]"></div>
      </div>
    );
  }

  const watchlist = user.watchlist || [];
  const purchases = user.purchases || [];
  const recommendations = user.recommendationHistory || [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'watchlist', label: 'Watchlist', icon: Heart, count: watchlist.length },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag, count: purchases.length },
    { id: 'history', label: 'AI History', icon: History, count: recommendations.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Profile Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.4), transparent 50%), radial-gradient(circle at 80% 50%, rgba(16,185,129,0.4), transparent 50%)' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-4xl font-bold text-white border border-white/20 shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white font-display">{user.name}</h1>
              <p className="text-gray-300 text-sm mt-1">{user.email}</p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {user.zodiacSign && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm text-white border border-white/10 backdrop-blur-sm">
                    <span className="text-xl">{zodiacEmoji[user.zodiacSign]}</span> {user.zodiacSign}
                  </span>
                )}
                {user.dob && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm text-gray-300 border border-white/10">
                    <Calendar className="h-4 w-4" /> {new Date(user.dob).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
                {user.placeOfBirth && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm text-gray-300 border border-white/10">
                    <MapPin className="h-4 w-4" /> {user.placeOfBirth}
                  </span>
                )}
              </div>
            </div>
            {/* Stats Cards */}
            <div className="flex gap-4 md:gap-6">
              {[
                { label: 'Watchlist', value: watchlist.length, color: 'from-pink-500/20 to-red-500/20' },
                { label: 'Purchases', value: purchases.length, color: 'from-blue-500/20 to-indigo-500/20' },
                { label: 'AI Consults', value: recommendations.length, color: 'from-emerald-500/20 to-green-500/20' },
              ].map((stat, i) => (
                <div key={i} className={`text-center bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-xl px-5 py-4 border border-white/10 min-w-[90px]`}>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-300 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-[var(--color-gem-primary)] text-[var(--color-gem-primary)] bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-[var(--color-gem-primary)] text-white' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Actions */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Link to="/recommend" className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm card-hover group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Brain className="h-7 w-7 text-[var(--color-gem-primary)]" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Get AI Recommendation</h3>
                    <p className="text-sm text-gray-500 mb-4">Start a new personalized Gemini AI consultation</p>
                    <span className="text-sm text-[var(--color-gem-primary)] font-semibold flex items-center gap-1">Start now <ArrowRight className="h-4 w-4" /></span>
                  </Link>
                  <Link to="/catalog" className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm card-hover group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Gem className="h-7 w-7 text-[var(--color-gem-accent)]" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Browse Collection</h3>
                    <p className="text-sm text-gray-500 mb-4">Explore 15+ authentic astrological gemstones</p>
                    <span className="text-sm text-[var(--color-gem-accent)] font-semibold flex items-center gap-1">Browse <ArrowRight className="h-4 w-4" /></span>
                  </Link>
                  {user.zodiacSign && (
                    <Link to={`/catalog?zodiac=${user.zodiacSign}`} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm card-hover group">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <span className="text-2xl">{zodiacEmoji[user.zodiacSign]}</span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">Your {user.zodiacSign} Stones</h3>
                      <p className="text-sm text-gray-500 mb-4">Gemstones aligned with your zodiac sign</p>
                      <span className="text-sm text-purple-600 font-semibold flex items-center gap-1">Explore <ArrowRight className="h-4 w-4" /></span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Latest AI Insight */}
              {recommendations.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Latest AI Consultation</h2>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-gem-primary)] to-[var(--color-gem-secondary)] flex items-center justify-center flex-shrink-0">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-1 bg-blue-50 text-[var(--color-gem-primary)] rounded-lg text-xs font-semibold">{recommendations[recommendations.length - 1].zodiacSign}</span>
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">{recommendations[recommendations.length - 1].purpose}</span>
                          <span className="text-xs text-gray-400 ml-auto">{new Date(recommendations[recommendations.length - 1].createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4">
                          {recommendations[recommendations.length - 1].aiInsight || 'No AI insight recorded for this consultation.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Watchlist Preview */}
              {watchlist.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-gray-900">Watchlist Preview</h2>
                    <button onClick={() => setActiveTab('watchlist')} className="text-sm text-[var(--color-gem-primary)] font-semibold flex items-center gap-1">See all <ArrowRight className="h-4 w-4" /></button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {watchlist.slice(0, 4).map((gem) => (
                      <Link to={`/gemstone/${gem._id}`} key={gem._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover group">
                        <div className="h-32 overflow-hidden bg-gray-100">
                          <img src={gem.imageUrl} alt={gem.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-3">
                          <h4 className="font-bold text-sm text-gray-900 truncate">{gem.name}</h4>
                          <p className="text-xs text-gray-400">{gem.color} · {gem.rulingPlanet}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* WATCHLIST TAB */}
          {activeTab === 'watchlist' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-display">Your Watchlist</h2>
                <span className="text-sm text-gray-500">{watchlist.length} gemstone{watchlist.length !== 1 ? 's' : ''}</span>
              </div>
              {watchlist.length === 0 ? (
                <EmptyState icon={Heart} title="Your watchlist is empty" desc="Browse the catalog and tap the ❤️ icon on any gemstone to add it here." link="/catalog" btnText="Browse Catalog" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {watchlist.map((gem) => (
                    <div key={gem._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm card-hover group relative">
                      <button onClick={() => toggleWatchlist(gem._id)}
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md">
                        <Heart className="h-4 w-4" fill="currentColor" />
                      </button>
                      <Link to={`/gemstone/${gem._id}`}>
                        <div className="h-48 overflow-hidden bg-gray-100">
                          <img src={gem.imageUrl} alt={gem.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{gem.name}</h3>
                          <p className="text-xs text-gray-400 mb-3">{gem.rulingPlanet} · {gem.color} · {gem.chakra} Chakra</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-[var(--color-gem-primary)]">{gem.priceRange}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1"><Eye className="h-3 w-3" /> View</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PURCHASES TAB */}
          {activeTab === 'purchases' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-display">Purchase History</h2>
                <span className="text-sm text-gray-500">{purchases.length} purchase{purchases.length !== 1 ? 's' : ''}</span>
              </div>
              {purchases.length === 0 ? (
                <EmptyState icon={ShoppingBag} title="No purchases yet" desc="Buy your first astrological gemstone from our authenticated catalog." link="/catalog" btnText="Shop Now" />
              ) : (
                <div className="space-y-4">
                  {purchases.map((p, i) => p.gemstone && (
                    <Link to={`/gemstone/${p.gemstone._id}`} key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-6 card-hover">
                      <img src={p.gemstone.imageUrl} alt={p.gemstone.name} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900">{p.gemstone.name}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">{p.gemstone.color} · {p.gemstone.rulingPlanet} · {p.gemstone.category}</p>
                        <div className="flex gap-1 mt-2">
                          {p.gemstone.benefits?.slice(0, 3).map((b, j) => (
                            <span key={j} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{b}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-[var(--color-gem-primary)]">{p.gemstone.priceRange}</p>
                        <p className="text-xs text-gray-400 mt-1">Qty: {p.quantity}</p>
                        <p className="text-xs text-gray-400">{new Date(p.purchasedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI HISTORY TAB */}
          {activeTab === 'history' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-display">AI Recommendation History</h2>
                <span className="text-sm text-gray-500">{recommendations.length} consultation{recommendations.length !== 1 ? 's' : ''}</span>
              </div>
              {recommendations.length === 0 ? (
                <EmptyState icon={Brain} title="No AI consultations yet" desc="Start your first Gemini AI-powered gemstone consultation." link="/recommend" btnText="Start Consultation" />
              ) : (
                <div className="space-y-6">
                  {[...recommendations].reverse().map((rec, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-gem-primary)] to-[var(--color-gem-secondary)] flex items-center justify-center shadow-md">
                              <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-lg text-gray-900">Consultation #{recommendations.length - i}</p>
                              <p className="text-xs text-gray-400">{new Date(rec.createdAt).toLocaleString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <span className="px-3 py-1.5 bg-blue-50 text-[var(--color-gem-primary)] rounded-lg text-xs font-semibold">{rec.zodiacSign}</span>
                            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">{rec.purpose}</span>
                          </div>
                        </div>
                      </div>
                      {rec.aiInsight && (
                        <div className="px-6 py-5 bg-gray-50/50">
                          <p className="text-sm text-gray-700 leading-relaxed">{rec.aiInsight}</p>
                        </div>
                      )}
                      {rec.gemstones && rec.gemstones.length > 0 && (
                        <div className="p-6 flex gap-4 overflow-x-auto">
                          {rec.gemstones.map((gem) => gem && (
                            <Link to={`/gemstone/${gem._id}`} key={gem._id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 min-w-[220px] hover:border-[var(--color-gem-primary)] hover:shadow-md transition-all">
                              <img src={gem.imageUrl} alt={gem.name} className="w-12 h-12 rounded-lg object-cover" />
                              <div>
                                <p className="text-sm font-bold text-gray-900">{gem.name}</p>
                                <p className="text-xs text-gray-400">{gem.color} · {gem.rulingPlanet}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-display">Account Settings</h2>
                {!isEditingProfile && (
                  <button onClick={handleEditClick} className="px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Edit Profile
                  </button>
                )}
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-7">
                {isEditingProfile ? (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gem-primary)] focus:border-transparent text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input type="date" value={profileForm.dob} onChange={e => setProfileForm({ ...profileForm, dob: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gem-primary)] focus:border-transparent text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zodiac Sign (Optional Override)</label>
                      <select value={profileForm.zodiacSign} onChange={e => setProfileForm({ ...profileForm, zodiacSign: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gem-primary)] focus:border-transparent text-sm">
                        <option value="">Auto-detect from DOB</option>
                        {Object.keys(zodiacEmoji).map(sign => (
                          <option key={sign} value={sign}>{zodiacEmoji[sign]} {sign}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                      <input type="text" value={profileForm.placeOfBirth} onChange={e => setProfileForm({ ...profileForm, placeOfBirth: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gem-primary)] focus:border-transparent text-sm" />
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                      <button onClick={() => setIsEditingProfile(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleSaveProfile} className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[var(--color-gem-primary)] to-blue-600 hover:shadow-lg rounded-xl transition-all">
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="-mx-7 -my-7">
                    {[
                      { label: 'Full Name', value: user.name },
                      { label: 'Email', value: user.email, readOnly: true },
                      { label: 'Zodiac Sign', value: user.zodiacSign ? `${zodiacEmoji[user.zodiacSign]} ${user.zodiacSign}` : 'Not set' },
                      { label: 'Date of Birth', value: user.dob ? new Date(user.dob).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set' },
                      { label: 'Place of Birth', value: user.placeOfBirth || 'Not set' },
                      { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center justify-between px-7 py-5 ${i !== 5 ? 'border-b border-gray-50' : ''}`}>
                        <span className="text-sm font-medium text-gray-500">{item.label} {item.readOnly && <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded ml-2">Uneditable</span>}</span>
                        <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, desc, link, btnText }) => (
  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
      <Icon className="h-8 w-8 text-gray-300" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">{desc}</p>
    <Link to={link} className="px-8 py-3 bg-gradient-to-r from-[var(--color-gem-primary)] to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all">
      {btnText}
    </Link>
  </div>
);

export default Dashboard;
