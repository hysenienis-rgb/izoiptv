import React from 'react';
import { motion } from 'framer-motion';
import { Tv, Shield, Users, Headphones, Check, Zap, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const whyItems = t('about.why_items') || [];

  return (
    <div className="min-h-screen pt-24" data-testid="about-page">
      {/* Header */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 font-['Outfit']" data-testid="about-title">
              {t('about.title')}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                <Tv className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white font-['Outfit']">Izo IPTV</h2>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed">
              {t('about.intro')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Quality */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-slate-900/50 border border-white/5"
              data-testid="mission-card"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-['Outfit']">
                {t('about.mission_title')}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {t('about.mission_text')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-slate-900/50 border border-white/5"
              data-testid="quality-card"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 font-['Outfit']">
                {t('about.quality_title')}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {t('about.quality_text')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Izo IPTV */}
      <section className="py-24 md:py-32 bg-slate-950/50 relative" data-testid="why-section">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 font-['Outfit']">
              {t('about.why_title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.isArray(whyItems) && whyItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/30 border border-white/5"
                data-testid={`why-item-${index}`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl glass"
            >
              <Tv className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white font-['Outfit'] mb-1">10,000+</div>
              <div className="text-slate-400 text-sm">Live Channels</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 rounded-2xl glass"
            >
              <Users className="w-8 h-8 text-violet-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white font-['Outfit'] mb-1">5,000+</div>
              <div className="text-slate-400 text-sm">Happy Customers</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 rounded-2xl glass"
            >
              <Zap className="w-8 h-8 text-amber-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white font-['Outfit'] mb-1">99.9%</div>
              <div className="text-slate-400 text-sm">Uptime</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center p-6 rounded-2xl glass"
            >
              <Headphones className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white font-['Outfit'] mb-1">24/7</div>
              <div className="text-slate-400 text-sm">Support</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1593784991251-92ded75ea290?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxzbWFydCUyMHR2JTIwc3RyZWFtaW5nJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3NzA2NDY4NDR8MA&ixlib=rb-4.1.0&q=85"
                alt="Smart TV streaming"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-semibold">Smart TV Experience</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative rounded-3xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1730830741396-ffb85bb2e983?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwyfHx0diUyMHJlbW90ZSUyMGNvbnRyb2wlMjBlbnRlcnRhaW5tZW50fGVufDB8fHx8MTc3MDY0Njg1NHww&ixlib=rb-4.1.0&q=85"
                alt="Entertainment setup"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-semibold">Multi-Device Control</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
