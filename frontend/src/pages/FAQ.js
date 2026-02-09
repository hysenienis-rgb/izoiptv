import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const FAQ = () => {
  const { t, language } = useLanguage();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(`${API}/faqs`);
        setFaqs(response.data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <div className="min-h-screen pt-24" data-testid="faq-page">
      {/* Header */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 mb-6">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 font-['Outfit']" data-testid="faq-title">
              {t('faq.title')}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-pulse text-slate-400">Loading...</div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="bg-slate-900/30 border border-white/5 rounded-2xl px-6 overflow-hidden"
                    data-testid={`faq-item-${index}`}
                  >
                    <AccordionTrigger className="text-left text-white hover:text-blue-400 py-5 font-medium text-lg">
                      {faq.question?.[language] || faq.question?.sq}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-400 pb-5 leading-relaxed">
                      {faq.answer?.[language] || faq.answer?.sq}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          )}
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-['Outfit']">
              {language === 'sq' ? 'Keni pyetje të tjera?' : language === 'de' ? 'Haben Sie weitere Fragen?' : 'Have more questions?'}
            </h2>
            <p className="text-slate-400 mb-8">
              {language === 'sq' 
                ? 'Na kontaktoni në çdo kohë dhe ekipi ynë do t\'ju përgjigjet me kënaqësi.'
                : language === 'de'
                ? 'Kontaktieren Sie uns jederzeit und unser Team wird Ihnen gerne antworten.'
                : 'Contact us anytime and our team will be happy to assist you.'}
            </p>
            <a
              href="/contact"
              className="btn-primary inline-flex items-center space-x-2 px-8 py-4 rounded-full text-white font-semibold"
              data-testid="faq-contact-btn"
            >
              <span>{t('nav.contact')}</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
