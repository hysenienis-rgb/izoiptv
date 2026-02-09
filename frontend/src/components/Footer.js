import React from 'react';
import { Link } from 'react-router-dom';
import { Tv, Mail, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4" data-testid="footer-logo">
              <Tv className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-gradient font-['Outfit']">Izo IPTV</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <a
                href="https://wa.me/38349123456"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-green-500/20 hover:text-green-400 transition-colors duration-200"
                data-testid="footer-whatsapp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/izoiptv"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-500/20 hover:text-blue-400 transition-colors duration-200"
                data-testid="footer-telegram"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@izoip.tv"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-violet-500/20 hover:text-violet-400 transition-colors duration-200"
                data-testid="footer-email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-['Outfit']">{t('footer.quick_links')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 text-sm hover:text-white transition-colors duration-200" data-testid="footer-link-home">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-slate-400 text-sm hover:text-white transition-colors duration-200" data-testid="footer-link-packages">
                  {t('nav.packages')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 text-sm hover:text-white transition-colors duration-200" data-testid="footer-link-about">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-400 text-sm hover:text-white transition-colors duration-200" data-testid="footer-link-faq">
                  {t('nav.faq')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 text-sm hover:text-white transition-colors duration-200" data-testid="footer-link-contact">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-['Outfit']">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-slate-400 text-sm hover:text-white transition-colors duration-200" data-testid="footer-link-privacy">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 text-sm hover:text-white transition-colors duration-200" data-testid="footer-link-terms">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-slate-400 text-sm hover:text-white transition-colors duration-200" data-testid="footer-link-cookies">
                  {t('footer.cookies')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-['Outfit']">{t('contact.info_title')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MessageCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-400 text-sm">+383 49 123 456</span>
              </li>
              <li className="flex items-center space-x-3">
                <Send className="w-4 h-4 text-blue-400" />
                <span className="text-slate-400 text-sm">@izoiptv</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-violet-400" />
                <span className="text-slate-400 text-sm">info@izoip.tv</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-center text-slate-500 text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
