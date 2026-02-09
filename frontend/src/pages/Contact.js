import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Contact = () => {
  const { t } = useLanguage();
  const [contactInfo, setContactInfo] = useState({
    whatsapp: '+383 49 123 456',
    telegram: '@izoiptv',
    email: 'info@izoip.tv'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get(`${API}/contact-info`);
        setContactInfo(response.data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };
    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.post(`${API}/contact`, formData);
      setStatus({ type: 'success', message: t('contact.form_success') });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: t('contact.form_error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24" data-testid="contact-page">
      {/* Header */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 font-['Outfit']" data-testid="contact-title">
              {t('contact.title')}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 font-['Outfit']">
                {t('contact.info_title')}
              </h2>
              <p className="text-slate-400 mb-8">
                {t('contact.info_text')}
              </p>

              <div className="space-y-6">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-green-500/30 transition-all duration-200 group"
                  data-testid="contact-whatsapp"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <MessageCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{t('contact.whatsapp')}</p>
                    <p className="text-slate-400 text-sm">{contactInfo.whatsapp}</p>
                  </div>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/${contactInfo.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-all duration-200 group"
                  data-testid="contact-telegram"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Send className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{t('contact.telegram')}</p>
                    <p className="text-slate-400 text-sm">{contactInfo.telegram}</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-violet-500/30 transition-all duration-200 group"
                  data-testid="contact-email"
                >
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
                    <Mail className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{t('contact.email')}</p>
                    <p className="text-slate-400 text-sm">{contactInfo.email}</p>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <form onSubmit={handleSubmit} className="glass rounded-3xl p-8" data-testid="contact-form">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t('contact.form_name')}
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full input-dark rounded-xl px-4 py-3"
                      placeholder={t('contact.form_name')}
                      data-testid="contact-input-name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t('contact.form_email')}
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full input-dark rounded-xl px-4 py-3"
                      placeholder={t('contact.form_email')}
                      data-testid="contact-input-email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t('contact.form_subject')}
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full input-dark rounded-xl px-4 py-3"
                      placeholder={t('contact.form_subject')}
                      data-testid="contact-input-subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t('contact.form_message')}
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full input-dark rounded-xl px-4 py-3 resize-none"
                      placeholder={t('contact.form_message')}
                      data-testid="contact-input-message"
                    />
                  </div>

                  {status.message && (
                    <div className={`flex items-center space-x-2 p-4 rounded-xl ${
                      status.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {status.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      <span className="text-sm">{status.message}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-4 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="contact-submit-btn"
                  >
                    {loading ? 'Sending...' : t('contact.form_submit')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
