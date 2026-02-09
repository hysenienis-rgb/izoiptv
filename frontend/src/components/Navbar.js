import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const { language, t, changeLanguage } = useLanguage();
  const location = useLocation();

  const languages = [
    { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/packages', label: t('nav.packages') },
    { path: '/about', label: t('nav.about') },
    { path: '/faq', label: t('nav.faq') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'glass-heavy' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-testid="navbar-logo">
            <span className="text-2xl font-bold text-gradient font-['Outfit']">Izo IPTV</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.path.replace('/', '') || 'home'}`}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
                data-testid="language-switcher"
              >
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{currentLang?.flag} {currentLang?.code.toUpperCase()}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${langDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {langDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-40 glass rounded-xl overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setLangDropdown(false);
                        }}
                        data-testid={`lang-option-${lang.code}`}
                        className={`w-full px-4 py-3 text-left text-sm flex items-center space-x-2 transition-colors duration-200 ${
                          language === lang.code
                            ? 'bg-blue-500/20 text-white'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/packages"
              className="btn-primary px-6 py-2.5 rounded-full text-sm font-semibold text-white"
              data-testid="nav-cta-packages"
            >
              {t('hero.cta_packages')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors duration-200"
            data-testid="mobile-menu-toggle"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    data-testid={`mobile-nav-${link.path.replace('/', '') || 'home'}`}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'bg-blue-500/20 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile Language Switcher */}
                <div className="px-4 py-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Language</p>
                  <div className="flex space-x-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        data-testid={`mobile-lang-${lang.code}`}
                        className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-1 transition-colors duration-200 ${
                          language === lang.code
                            ? 'bg-blue-500/20 text-white'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.code.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-4 pt-2">
                  <Link
                    to="/packages"
                    className="btn-primary block text-center px-6 py-3 rounded-full text-sm font-semibold text-white"
                    data-testid="mobile-cta-packages"
                  >
                    {t('hero.cta_packages')}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
