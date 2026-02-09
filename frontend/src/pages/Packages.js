import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Packages = () => {
  const { t, language } = useLanguage();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(`${API}/packages`);
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleOrder = (packageName) => {
    // Placeholder for order functionality
    const whatsappNumber = '38349123456';
    const message = encodeURIComponent(`Hi, I would like to order the ${packageName} package.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-24" data-testid="packages-page">
      {/* Header */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 font-['Outfit']" data-testid="packages-title">
              {t('packages.title')}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t('packages.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-pulse text-slate-400">Loading...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-8 md:p-10 rounded-3xl border flex flex-col h-full ${
                    pkg.is_popular
                      ? 'bg-gradient-to-b from-blue-500/10 to-violet-500/10 border-blue-500/50'
                      : 'bg-slate-950 border-white/10 hover:border-blue-500/30'
                  } transition-all duration-300`}
                  data-testid={`package-card-${index}`}
                >
                  {pkg.is_popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-1.5 rounded-full">
                        <Star className="w-4 h-4 text-white fill-white" />
                        <span className="text-sm font-semibold text-white">{t('packages.popular')}</span>
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4 font-['Outfit']">
                      {pkg.name?.[language] || pkg.name?.sq}
                    </h3>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-white font-['Outfit']">{pkg.price}</span>
                      <span className="text-2xl font-bold text-white font-['Outfit']">{pkg.currency}</span>
                      <span className="text-slate-400 ml-2">{t('packages.per_month')}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 flex-grow mb-8">
                    {(pkg.features?.[language] || pkg.features?.sq || []).map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          pkg.is_popular ? 'bg-blue-500' : 'bg-slate-700'
                        }`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleOrder(pkg.name?.[language] || pkg.name?.sq)}
                    className={`w-full py-4 rounded-full font-semibold transition-all duration-200 ${
                      pkg.is_popular
                        ? 'btn-primary text-white'
                        : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                    }`}
                    data-testid={`order-btn-${index}`}
                  >
                    {t('packages.order')}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 md:py-32" data-testid="comparison-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 font-['Outfit']">
              {t('packages.comparison_title')}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full" data-testid="comparison-table">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">{t('packages.feature')}</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Basic</th>
                  <th className="text-center py-4 px-4 text-blue-400 font-semibold">
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Standard</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-slate-400">{t('packages.devices_count')}</td>
                  <td className="py-4 px-4 text-center text-slate-300">1</td>
                  <td className="py-4 px-4 text-center text-slate-300 bg-blue-500/5">2</td>
                  <td className="py-4 px-4 text-center text-slate-300">3</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-slate-400">{t('packages.live_channels')}</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="py-4 px-4 text-center bg-blue-500/5"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-slate-400">{t('packages.vod')}</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="py-4 px-4 text-center bg-blue-500/5"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-slate-400">{t('packages.quality')}</td>
                  <td className="py-4 px-4 text-center text-slate-300">{t('packages.sd_hd')}</td>
                  <td className="py-4 px-4 text-center text-slate-300 bg-blue-500/5">{t('packages.hd_fhd')}</td>
                  <td className="py-4 px-4 text-center text-slate-300">{t('packages.up_to_4k')}</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-slate-400">{t('packages.catch_up')}</td>
                  <td className="py-4 px-4 text-center text-slate-500">—</td>
                  <td className="py-4 px-4 text-center text-slate-300 bg-blue-500/5">{t('packages.days_7')}</td>
                  <td className="py-4 px-4 text-center text-slate-300">{t('packages.days_14')}</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-slate-400">{t('packages.support')}</td>
                  <td className="py-4 px-4 text-center text-slate-300">{t('packages.standard_support')}</td>
                  <td className="py-4 px-4 text-center text-slate-300 bg-blue-500/5">{t('packages.standard_support')}</td>
                  <td className="py-4 px-4 text-center text-slate-300">{t('packages.priority_support')}</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm mb-4">Payment Methods (Coming Soon)</p>
          <div className="flex items-center justify-center space-x-6">
            <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm">
              PayPal
            </div>
            <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm">
              Credit Card
            </div>
            <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm">
              Crypto
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Packages;
