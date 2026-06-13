import { useState } from 'react';
import axios from 'axios';
import { ChevronRight, Sparkles, User, Calendar, MapPin, Target, Brain, ChevronLeft, Edit3 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';

const getZodiacSign = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((month === 1 && day <= 19) || (month === 12 && day >= 22)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  return "";
};

const zodiacEmoji = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

const allZodiacSigns = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

const RecommendationEngine = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', dob: '', timeOfBirth: '', placeOfBirth: '', purpose: '', zodiacSign: ''
  });
  const [zodiacOverride, setZodiacOverride] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const autoZodiac = formData.dob ? getZodiacSign(formData.dob) : '';
  const activeZodiac = formData.zodiacSign || autoZodiac;

  const handleDobChange = (val) => {
    const detected = getZodiacSign(val);
    setFormData({ ...formData, dob: val, zodiacSign: detected });
    setZodiacOverride(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await axios.post('http://localhost:5000/api/gemstones/recommend', {
        zodiacSign: activeZodiac,
        purpose: formData.purpose,
        name: formData.name,
        dob: formData.dob,
        timeOfBirth: formData.timeOfBirth,
        placeOfBirth: formData.placeOfBirth
      }, { headers });

      setRecommendations(res.data.gemstones || res.data);
      setAiInsight(res.data.aiInsight || '');
      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const purposes = [
    { label: 'Wealth', emoji: '💰', desc: 'Financial prosperity' },
    { label: 'Health', emoji: '💚', desc: 'Physical vitality' },
    { label: 'Love', emoji: '❤️', desc: 'Romantic relationships' },
    { label: 'Career', emoji: '🚀', desc: 'Professional growth' },
    { label: 'Protection', emoji: '🛡️', desc: 'Spiritual shield' },
    { label: 'Peace', emoji: '☮️', desc: 'Inner harmony' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.3), transparent 60%), radial-gradient(circle at 70% 50%, rgba(16,185,129,0.3), transparent 60%)' }}></div>
          <Brain className="h-14 w-14 text-blue-400 mx-auto mb-4 animate-float relative z-10" />
          <h2 className="text-3xl md:text-4xl font-bold text-white relative z-10 font-display">AI-Powered Consultation</h2>
          <p className="mt-3 text-gray-300 relative z-10">Gemini AI analyzes your cosmic profile for precision recommendations</p>

          {/* Progress */}
          <div className="mt-8 flex justify-center items-center gap-1.5 relative z-10">
            {['Details', 'Birth Info', 'Purpose', 'Results'].map((label, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i + 1 ? 'bg-emerald-400 text-white' : step === i + 1 ? 'bg-white text-[var(--color-gem-primary)] shadow-lg' : 'bg-white/10 text-white/50'}`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] ${step === i + 1 ? 'text-white' : 'text-white/40'}`}>{label}</span>
                </div>
                {i < 3 && <div className={`w-10 h-0.5 mx-1 mb-4 ${step > i + 1 ? 'bg-emerald-400' : 'bg-white/10'}`}></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-12">
          {step === 1 && (
            <div className="animate-fade-in-up max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><User className="h-5 w-5 text-blue-600" /></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
                  <p className="text-sm text-gray-500">Tell us about yourself</p>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gem-primary)] focus:border-transparent focus:bg-white transition-all text-sm"
                    placeholder="e.g. Lavish Garg" />
                </div>
              </div>
              <div className="mt-10 flex justify-end">
                <button onClick={() => setStep(2)} disabled={!formData.name}
                  className="inline-flex items-center px-7 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[var(--color-gem-primary)] to-blue-600 disabled:opacity-40 hover:shadow-lg transition-all">
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><Calendar className="h-5 w-5 text-purple-600" /></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Birth Information</h3>
                  <p className="text-sm text-gray-500">For precise planetary alignment</p>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                  <input type="date" value={formData.dob} onChange={(e) => handleDobChange(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gem-primary)] focus:border-transparent focus:bg-white transition-all text-sm" />
                </div>

                {/* Zodiac auto-detect with override */}
                {formData.dob && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 animate-fade-in">
                    {!zodiacOverride ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{zodiacEmoji[activeZodiac]}</span>
                          <div>
                            <p className="text-sm font-bold text-[var(--color-gem-primary)]">{activeZodiac}</p>
                            <p className="text-xs text-gray-500">Auto-detected from your DOB</p>
                          </div>
                        </div>
                        <button onClick={() => setZodiacOverride(true)}
                          className="flex items-center gap-1 text-xs font-medium text-[var(--color-gem-primary)] bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
                          <Edit3 className="h-3 w-3" /> Change
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-gray-700">Select your Zodiac Sign</p>
                          <button onClick={() => { setFormData({ ...formData, zodiacSign: autoZodiac }); setZodiacOverride(false); }}
                            className="text-xs text-gray-500 hover:text-gray-700 underline">Reset to auto</button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {allZodiacSigns.map(sign => (
                            <button key={sign} onClick={() => { setFormData({ ...formData, zodiacSign: sign }); setZodiacOverride(false); }}
                              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg text-xs font-medium transition-all ${activeZodiac === sign ? 'bg-[var(--color-gem-primary)] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>
                              <span className="text-lg">{zodiacEmoji[sign]}</span>
                              <span className="leading-none">{sign}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time of Birth</label>
                    <input type="time" value={formData.timeOfBirth} onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gem-primary)] focus:border-transparent focus:bg-white transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Place of Birth</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="text" value={formData.placeOfBirth} onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                        className="w-full pl-9 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gem-primary)] focus:border-transparent focus:bg-white transition-all text-sm"
                        placeholder="City" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex justify-between">
                <button onClick={() => setStep(1)} className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
                  <ChevronLeft className="mr-1 h-4 w-4" /> Back
                </button>
                <button onClick={() => setStep(3)} disabled={!formData.dob}
                  className="inline-flex items-center px-7 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[var(--color-gem-primary)] to-blue-600 disabled:opacity-40 hover:shadow-lg transition-all">
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-8 max-w-md mx-auto">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><Target className="h-5 w-5 text-amber-600" /></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">What is your primary goal?</h3>
                  <p className="text-sm text-gray-500">Choose the area you want to improve</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {purposes.map(({ label, emoji, desc }) => (
                  <button key={label} onClick={() => setFormData({ ...formData, purpose: label })}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.purpose === label ? 'border-[var(--color-gem-secondary)] bg-emerald-50 shadow-md transform -translate-y-1' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                    <span className="text-2xl block mb-2">{emoji}</span>
                    <span className={`font-bold text-sm ${formData.purpose === label ? 'text-[var(--color-gem-secondary)]' : 'text-gray-900'}`}>{label}</span>
                    <span className="block text-xs text-gray-400 mt-0.5">{desc}</span>
                  </button>
                ))}
              </div>
              <div className="mt-10 flex justify-between max-w-2xl mx-auto">
                <button onClick={() => setStep(2)} className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
                  <ChevronLeft className="mr-1 h-4 w-4" /> Back
                </button>
                <button onClick={handleSubmit} disabled={!formData.purpose || loading}
                  className="inline-flex items-center px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-[var(--color-gem-secondary)] disabled:opacity-40 hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      AI is analyzing...
                    </span>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Get AI Recommendation</>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in-up">
              {aiInsight && (
                <div className="mb-10 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-gem-primary)] to-[var(--color-gem-secondary)] flex items-center justify-center flex-shrink-0">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Gemini AI Insight</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{aiInsight}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mb-10">
                <span className="text-4xl mb-3 block">{zodiacEmoji[activeZodiac]}</span>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-2 font-display">Your Cosmic Matches, {formData.name.split(' ')[0]}</h3>
                <p className="text-gray-500">{activeZodiac} · Goal: {formData.purpose}</p>
              </div>

              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {recommendations.map(gem => (
                    <Link to={`/gemstone/${gem._id}`} key={gem._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
                      <div className="h-44 overflow-hidden relative">
                        <img src={gem.imageUrl} alt={gem.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-black/30 backdrop-blur px-2 py-1 rounded">{gem.rulingPlanet}</span>
                      </div>
                      <div className="p-5">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{gem.name}</h4>
                        <p className="text-xs text-gray-400 mb-3">Wear on {gem.wearingDay} · {gem.wearingFinger} · {gem.chakra} Chakra</p>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{gem.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {gem.benefits.map((b, i) => (
                            <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{b}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <p className="text-gray-500">No matching gemstones found. The stars suggest a custom consultation.</p>
                </div>
              )}

              <div className="mt-10 flex justify-center">
                <button onClick={() => { setStep(1); setFormData({ name: '', dob: '', timeOfBirth: '', placeOfBirth: '', purpose: '', zodiacSign: '' }); setAiInsight(''); setZodiacOverride(false); }}
                  className="px-8 py-3 border-2 border-gray-200 font-bold rounded-xl text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all">
                  Start New Consultation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationEngine;
