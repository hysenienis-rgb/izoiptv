import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import { 
  Tv, Film, Sparkles, Smartphone, Monitor, Tablet, 
  Star, ChevronRight, Zap, Play, Radio, Users
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Home = () => {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialsRes, faqsRes] = await Promise.all([
          axios.get(`${API}/testimonials`),
          axios.get(`${API}/faqs`)
        ]);
        setTestimonials(testimonialsRes.data);
        setFaqs(faqsRes.data.slice(0, 3)); // Only first 3 for preview
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const features = [
    {
      icon: <Radio className="w-8 h-8" />,
      title: t('features.channels.title'),
      description: t('features.channels.description'),
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Film className="w-8 h-8" />,
      title: t('features.vod.title'),
      description: t('features.vod.description'),
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: t('features.quality.title'),
      description: t('features.quality.description'),
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: t('features.devices.title'),
      description: t('features.devices.description'),
      gradient: 'from-emerald-500 to-green-500'
    }
  ];

  const devices = [
    { icon: <Tv className="w-10 h-10" />, name: t('devices.smart_tv') },
    { icon: <Monitor className="w-10 h-10" />, name: t('devices.android_box') },
    { icon: <Zap className="w-10 h-10" />, name: t('devices.fire_stick') },
    { icon: <Smartphone className="w-10 h-10" />, name: t('devices.mobile') },
    { icon: <Tablet className="w-10 h-10" />, name: t('devices.pc') },
    { icon: <Play className="w-10 h-10" />, name: t('devices.mag') }
  ];

  const channelCategories = [
    'SPORT', 'MOVIES', 'ENTERTAINMENT', 'NEWS', 'KIDS', 'MUSIC', 
    'DOCUMENTARY', 'LIFESTYLE', 'PREMIUM', 'INTERNATIONAL'
  ];

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1708778002477-75611274f23d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxjaW5lbWF0aWMlMjBtb3ZpZSUyMGNvbGxhZ2UlMjBhYnN0cmFjdCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc3MDY0NDQzNHww&ixlib=rb-4.1.0&q=85')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass mb-8"
            >
              <Tv className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-300">Premium IPTV Service</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6 font-['Outfit']" data-testid="hero-title">
              <span className="text-white">{t('hero.title')}</span>
              <br />
              <span className="text-gradient">{t('hero.subtitle')}</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed" data-testid="hero-description">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/packages"
                className="btn-primary px-8 py-4 rounded-full text-base font-semibold text-white inline-flex items-center space-x-2"
                data-testid="hero-cta-packages"
              >
                <span>{t('hero.cta_packages')}</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="btn-secondary px-8 py-4 rounded-full text-base font-medium text-white inline-flex items-center space-x-2"
                data-testid="hero-cta-contact"
              >
                <span>{t('hero.cta_contact')}</span>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white font-['Outfit']">10K+</div>
                <div className="text-sm text-slate-400 mt-1">Kanale</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white font-['Outfit']">50K+</div>
                <div className="text-sm text-slate-400 mt-1">VOD</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white font-['Outfit']">4K</div>
                <div className="text-sm text-slate-400 mt-1">Ultra HD</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-white/50"
            />
          </div>
        </motion.div>
      </section>

      {/* Channel Categories Marquee */}
      <section className="py-8 border-y border-white/5 bg-slate-950/50">
        <Marquee speed={40} gradient={false} pauseOnHover>
          <div className="flex items-center space-x-12 px-6">
            {channelCategories.map((category, index) => (
              <div key={index} className="flex items-center space-x-3 text-slate-500">
                <Star className="w-4 h-4 text-blue-500/50" />
                <span className="text-sm font-medium tracking-wider">{category}</span>
              </div>
            ))}
          </div>
        </Marquee>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 relative" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 font-['Outfit']">
              {t('features.title')}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-all duration-500 overflow-hidden"
                data-testid={`feature-card-${index}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 font-['Outfit']">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Devices Section */}
      <section className="py-24 md:py-32 bg-slate-950/50 relative" data-testid="devices-section">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 font-['Outfit']">
              {t('devices.title')}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t('devices.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {devices.map((device, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group text-center p-6 rounded-2xl bg-slate-900/30 border border-white/5 hover:border-blue-500/30 hover:bg-slate-900/50 transition-all duration-300"
                data-testid={`device-${index}`}
              >
                <div className="text-slate-400 group-hover:text-blue-400 transition-colors duration-300 flex justify-center mb-4">
                  {device.icon}
                </div>
                <p className="text-sm font-medium text-slate-300">{device.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-24 md:py-32 relative overflow-hidden" data-testid="sports-section">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxzcG9ydHMlMjBmb290YmFsbCUyMHNvY2NlciUyMHN0YWRpdW0lMjBuaWdodHxlbnwwfHx8fDE3NzA2NDY4NTB8MA&ixlib=rb-4.1.0&q=85"
            alt="Football stadium"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 font-['Outfit']">
                {language === 'sq' ? 'Sport Live në HD' : language === 'de' ? 'Live-Sport in HD' : 'Live Sports in HD'}
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                {language === 'sq' 
                  ? 'Ndiqni të gjitha ndeshjet e futbollit, basketbollit, tenisit dhe sporteve të tjera live në cilësi të lartë. Kurrë mos humbisni një moment!'
                  : language === 'de'
                  ? 'Verfolgen Sie alle Fußball-, Basketball-, Tennis- und andere Sportspiele live in hoher Qualität. Verpassen Sie nie einen Moment!'
                  : 'Watch all football, basketball, tennis and other sports matches live in high quality. Never miss a moment!'}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">Football</div>
                <div className="px-4 py-2 rounded-full bg-violet-500/20 text-violet-400 text-sm font-medium">Basketball</div>
                <div className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">Tennis</div>
                <div className="px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium">MMA/UFC</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden lg:block"
            >
              <img 
                src="https://images.unsplash.com/photo-1729564739457-2c6aa728b06e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmb290YmFsbCUyMHNvY2NlciUyMHN0YWRpdW0lMjBuaWdodHxlbnwwfHx8fDE3NzA2NDY4NTB8MA&ixlib=rb-4.1.0&q=85"
                alt="Stadium at night"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 relative" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 font-['Outfit']">
              {t('testimonials.title')}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-slate-900/30 border border-white/5 backdrop-blur-sm"
                data-testid={`testimonial-${index}`}
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  "{testimonial.text?.[language] || testimonial.text?.sq}"
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image_url || 'https://via.placeholder.com/40'}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white text-sm font-medium">{testimonial.name}</p>
                    <p className="text-slate-500 text-xs">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-24 md:py-32 bg-slate-950/50 relative" data-testid="faq-preview-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 font-['Outfit']">
              {t('faq_preview.title')}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-slate-900/30 border border-white/5 rounded-2xl px-6 overflow-hidden"
                  data-testid={`faq-preview-${index}`}
                >
                  <AccordionTrigger className="text-left text-white hover:text-blue-400 py-5 font-medium">
                    {faq.question?.[language] || faq.question?.sq}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 pb-5">
                    {faq.answer?.[language] || faq.answer?.sq}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              to="/faq"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
              data-testid="faq-view-all"
            >
              <span>{t('faq_preview.view_all')}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1593784991251-92ded75ea290?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxzbWFydCUyMHR2JTIwc3RyZWFtaW5nJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHx8fDE3NzA2NDY4NDR8MA&ixlib=rb-4.1.0&q=85"
            alt="Smart TV streaming"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 font-['Outfit']">
              Ready to Start Streaming?
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
              {t('hero.description')}
            </p>
            <Link
              to="/packages"
              className="btn-primary px-10 py-5 rounded-full text-lg font-semibold text-white inline-flex items-center space-x-2"
              data-testid="cta-packages"
            >
              <span>{t('hero.cta_packages')}</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
