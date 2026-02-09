import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('izo-cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('izo-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('izo-cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          data-testid="cookie-banner"
        >
          <div className="max-w-4xl mx-auto glass rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {t('cookies.message')}{' '}
                    <a href="/cookies" className="text-blue-400 hover:text-blue-300 underline">
                      {t('cookies.learn_more')}
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={handleDecline}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-sm font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors duration-200"
                  data-testid="cookie-decline"
                >
                  {t('cookies.decline')}
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 sm:flex-none btn-primary px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                  data-testid="cookie-accept"
                >
                  {t('cookies.accept')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
