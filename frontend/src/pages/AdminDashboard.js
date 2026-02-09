import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, HelpCircle, MessageSquare, Users, 
  Settings, Image, LogOut, Menu, X, Save, Plus, Trash2, Edit2,
  Mail, Phone, Send, Eye, EyeOff, Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('izo-admin-token'));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('packages');
  
  // Data states
  const [packages, setPackages] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [messages, setMessages] = useState([]);
  const [contactInfo, setContactInfo] = useState({ whatsapp: '', telegram: '', email: '' });
  
  // Edit states
  const [editingPackage, setEditingPackage] = useState(null);
  const [editingFaq, setEditingFaq] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);

  const axiosAuth = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchAllData();
  }, [token]);

  const fetchAllData = async () => {
    try {
      const [packagesRes, faqsRes, testimonialsRes, messagesRes, contactRes] = await Promise.all([
        axios.get(`${API}/packages`),
        axiosAuth.get(`${API}/faqs/all`),
        axiosAuth.get(`${API}/testimonials/all`),
        axiosAuth.get(`${API}/contact/messages`),
        axios.get(`${API}/contact-info`)
      ]);
      setPackages(packagesRes.data);
      setFaqs(faqsRes.data);
      setTestimonials(testimonialsRes.data);
      setMessages(messagesRes.data);
      setContactInfo(contactRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('izo-admin-token');
    setToken(null);
    navigate('/admin/login');
  };

  // Package handlers
  const handleSavePackage = async (pkg) => {
    setLoading(true);
    try {
      if (pkg.id) {
        await axiosAuth.put(`${API}/packages/${pkg.id}`, pkg);
      } else {
        await axiosAuth.post(`${API}/packages`, pkg);
      }
      fetchAllData();
      setEditingPackage(null);
    } catch (error) {
      console.error('Error saving package:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axiosAuth.delete(`${API}/packages/${id}`);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  // FAQ handlers
  const handleSaveFaq = async (faq) => {
    setLoading(true);
    try {
      if (faq.id) {
        await axiosAuth.put(`${API}/faqs/${faq.id}`, faq);
      } else {
        await axiosAuth.post(`${API}/faqs`, faq);
      }
      fetchAllData();
      setEditingFaq(null);
    } catch (error) {
      console.error('Error saving FAQ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axiosAuth.delete(`${API}/faqs/${id}`);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  // Testimonial handlers
  const handleSaveTestimonial = async (testimonial) => {
    setLoading(true);
    try {
      if (testimonial.id) {
        await axiosAuth.put(`${API}/testimonials/${testimonial.id}`, testimonial);
      } else {
        await axiosAuth.post(`${API}/testimonials`, testimonial);
      }
      fetchAllData();
      setEditingTestimonial(null);
    } catch (error) {
      console.error('Error saving testimonial:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axiosAuth.delete(`${API}/testimonials/${id}`);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  // Message handlers
  const handleMarkRead = async (id) => {
    try {
      await axiosAuth.put(`${API}/contact/messages/${id}/read`);
      fetchAllData();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axiosAuth.delete(`${API}/contact/messages/${id}`);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Contact info handler
  const handleSaveContactInfo = async () => {
    setLoading(true);
    try {
      await axiosAuth.put(`${API}/contact-info`, contactInfo);
      alert('Contact info saved!');
    } catch (error) {
      console.error('Error saving contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'packages', icon: Package, label: t('admin.packages') },
    { id: 'faqs', icon: HelpCircle, label: t('admin.faqs') },
    { id: 'testimonials', icon: Users, label: t('admin.testimonials') },
    { id: 'messages', icon: MessageSquare, label: t('admin.messages'), badge: messages.filter(m => !m.is_read).length },
    { id: 'contact', icon: Phone, label: t('admin.contact_info') }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/5 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
          <span className="text-xl font-bold text-gradient font-['Outfit']">Izo Admin</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
              data-testid={`admin-menu-${item.id}`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            data-testid="admin-logout"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('admin.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="h-16 bg-slate-900/50 border-b border-white/5 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-white font-['Outfit']">
            {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <div></div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div className="space-y-6" data-testid="admin-packages-section">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{t('admin.packages')}</h2>
                <button
                  onClick={() => setEditingPackage({
                    name: { sq: '', de: '', en: '' },
                    price: 0,
                    currency: '€',
                    period: { sq: 'muaj', de: 'Monat', en: 'month' },
                    features: { sq: [''], de: [''], en: [''] },
                    is_popular: false,
                    order: packages.length + 1
                  })}
                  className="btn-primary px-4 py-2 rounded-full text-sm font-medium text-white flex items-center space-x-2"
                  data-testid="add-package-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('admin.add')}</span>
                </button>
              </div>

              <div className="grid gap-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="glass rounded-xl p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{pkg.name?.[language] || pkg.name?.sq}</h3>
                      <p className="text-slate-400 text-sm">{pkg.price}{pkg.currency} / {pkg.period?.[language]}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingPackage(pkg)}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                        data-testid={`edit-package-${pkg.id}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="p-2 rounded-lg bg-white/5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        data-testid={`delete-package-${pkg.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Package Edit Modal */}
              {editingPackage && (
                <PackageEditModal
                  pkg={editingPackage}
                  onSave={handleSavePackage}
                  onClose={() => setEditingPackage(null)}
                  loading={loading}
                />
              )}
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="space-y-6" data-testid="admin-faqs-section">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{t('admin.faqs')}</h2>
                <button
                  onClick={() => setEditingFaq({
                    question: { sq: '', de: '', en: '' },
                    answer: { sq: '', de: '', en: '' },
                    order: faqs.length + 1,
                    is_active: true
                  })}
                  className="btn-primary px-4 py-2 rounded-full text-sm font-medium text-white flex items-center space-x-2"
                  data-testid="add-faq-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('admin.add')}</span>
                </button>
              </div>

              <div className="grid gap-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="glass rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{faq.question?.[language] || faq.question?.sq}</h3>
                        <p className="text-slate-400 text-sm mt-2 line-clamp-2">{faq.answer?.[language] || faq.answer?.sq}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setEditingFaq(faq)}
                          className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="p-2 rounded-lg bg-white/5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Edit Modal */}
              {editingFaq && (
                <FaqEditModal
                  faq={editingFaq}
                  onSave={handleSaveFaq}
                  onClose={() => setEditingFaq(null)}
                  loading={loading}
                />
              )}
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6" data-testid="admin-testimonials-section">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{t('admin.testimonials')}</h2>
                <button
                  onClick={() => setEditingTestimonial({
                    name: '',
                    location: '',
                    text: { sq: '', de: '', en: '' },
                    rating: 5,
                    image_url: '',
                    is_active: true,
                    order: testimonials.length + 1
                  })}
                  className="btn-primary px-4 py-2 rounded-full text-sm font-medium text-white flex items-center space-x-2"
                  data-testid="add-testimonial-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('admin.add')}</span>
                </button>
              </div>

              <div className="grid gap-4">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="glass rounded-xl p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={testimonial.image_url || 'https://via.placeholder.com/40'}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-white font-medium">{testimonial.name}</h3>
                        <p className="text-slate-400 text-sm">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingTestimonial(testimonial)}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                        className="p-2 rounded-lg bg-white/5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial Edit Modal */}
              {editingTestimonial && (
                <TestimonialEditModal
                  testimonial={editingTestimonial}
                  onSave={handleSaveTestimonial}
                  onClose={() => setEditingTestimonial(null)}
                  loading={loading}
                />
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-6" data-testid="admin-messages-section">
              <h2 className="text-xl font-bold text-white">{t('admin.messages')}</h2>
              
              {messages.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center">
                  <Mail className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">{t('admin.no_messages')}</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`glass rounded-xl p-6 ${!message.is_read ? 'border border-blue-500/30' : ''}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-white font-medium">{message.name}</h3>
                            {!message.is_read && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs">{t('admin.unread')}</span>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm">{message.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!message.is_read && (
                            <button
                              onClick={() => handleMarkRead(message.id)}
                              className="p-2 rounded-lg bg-white/5 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                              title={t('admin.mark_read')}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="p-2 rounded-lg bg-white/5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-300 font-medium mb-2">{message.subject}</p>
                      <p className="text-slate-400 text-sm">{message.message}</p>
                      <p className="text-slate-600 text-xs mt-4">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contact Info Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6" data-testid="admin-contact-section">
              <h2 className="text-xl font-bold text-white">{t('admin.contact_info')}</h2>
              
              <div className="glass rounded-xl p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">WhatsApp</label>
                  <Input
                    value={contactInfo.whatsapp}
                    onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                    className="w-full input-dark rounded-xl"
                    placeholder="+383 49 123 456"
                    data-testid="contact-info-whatsapp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Telegram</label>
                  <Input
                    value={contactInfo.telegram}
                    onChange={(e) => setContactInfo({ ...contactInfo, telegram: e.target.value })}
                    className="w-full input-dark rounded-xl"
                    placeholder="@izoiptv"
                    data-testid="contact-info-telegram"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <Input
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full input-dark rounded-xl"
                    placeholder="info@izoip.tv"
                    data-testid="contact-info-email"
                  />
                </div>
                <button
                  onClick={handleSaveContactInfo}
                  disabled={loading}
                  className="btn-primary px-6 py-3 rounded-full text-white font-semibold flex items-center space-x-2"
                  data-testid="save-contact-info-btn"
                >
                  <Save className="w-4 h-4" />
                  <span>{t('admin.save')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Package Edit Modal Component
const PackageEditModal = ({ pkg, onSave, onClose, loading }) => {
  const [data, setData] = useState(pkg);

  const handleFeatureChange = (lang, index, value) => {
    const newFeatures = { ...data.features };
    newFeatures[lang][index] = value;
    setData({ ...data, features: newFeatures });
  };

  const addFeature = (lang) => {
    const newFeatures = { ...data.features };
    newFeatures[lang] = [...(newFeatures[lang] || []), ''];
    setData({ ...data, features: newFeatures });
  };

  const removeFeature = (lang, index) => {
    const newFeatures = { ...data.features };
    newFeatures[lang] = newFeatures[lang].filter((_, i) => i !== index);
    setData({ ...data, features: newFeatures });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-xl font-bold text-white font-['Outfit']">
            {pkg.id ? 'Edit Package' : 'New Package'}
          </h3>
        </div>
        
        <div className="p-6 space-y-6">
          <Tabs defaultValue="sq">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="sq">Shqip</TabsTrigger>
              <TabsTrigger value="de">Deutsch</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            
            {['sq', 'de', 'en'].map((lang) => (
              <TabsContent key={lang} value={lang} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name ({lang.toUpperCase()})</label>
                  <Input
                    value={data.name?.[lang] || ''}
                    onChange={(e) => setData({ ...data, name: { ...data.name, [lang]: e.target.value } })}
                    className="w-full input-dark rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Features ({lang.toUpperCase()})</label>
                  {(data.features?.[lang] || []).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(lang, index, e.target.value)}
                        className="flex-1 input-dark rounded-xl"
                      />
                      <button
                        onClick={() => removeFeature(lang, index)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addFeature(lang)}
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Feature</span>
                  </button>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Price</label>
              <Input
                type="number"
                step="0.01"
                value={data.price}
                onChange={(e) => setData({ ...data, price: parseFloat(e.target.value) })}
                className="w-full input-dark rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Order</label>
              <Input
                type="number"
                value={data.order}
                onChange={(e) => setData({ ...data, order: parseInt(e.target.value) })}
                className="w-full input-dark rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_popular"
              checked={data.is_popular}
              onChange={(e) => setData({ ...data, is_popular: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600"
            />
            <label htmlFor="is_popular" className="text-sm text-slate-300">Mark as Popular</label>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(data)}
            disabled={loading}
            className="btn-primary px-4 py-2 rounded-full text-white font-medium"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

// FAQ Edit Modal Component
const FaqEditModal = ({ faq, onSave, onClose, loading }) => {
  const [data, setData] = useState(faq);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-xl font-bold text-white font-['Outfit']">
            {faq.id ? 'Edit FAQ' : 'New FAQ'}
          </h3>
        </div>
        
        <div className="p-6 space-y-6">
          <Tabs defaultValue="sq">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="sq">Shqip</TabsTrigger>
              <TabsTrigger value="de">Deutsch</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            
            {['sq', 'de', 'en'].map((lang) => (
              <TabsContent key={lang} value={lang} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Question ({lang.toUpperCase()})</label>
                  <Input
                    value={data.question?.[lang] || ''}
                    onChange={(e) => setData({ ...data, question: { ...data.question, [lang]: e.target.value } })}
                    className="w-full input-dark rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Answer ({lang.toUpperCase()})</label>
                  <Textarea
                    value={data.answer?.[lang] || ''}
                    onChange={(e) => setData({ ...data, answer: { ...data.answer, [lang]: e.target.value } })}
                    className="w-full input-dark rounded-xl"
                    rows={4}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={data.is_active}
              onChange={(e) => setData({ ...data, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600"
            />
            <label htmlFor="is_active" className="text-sm text-slate-300">Active</label>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10">
            Cancel
          </button>
          <button onClick={() => onSave(data)} disabled={loading} className="btn-primary px-4 py-2 rounded-full text-white font-medium">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Testimonial Edit Modal Component
const TestimonialEditModal = ({ testimonial, onSave, onClose, loading }) => {
  const [data, setData] = useState(testimonial);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-xl font-bold text-white font-['Outfit']">
            {testimonial.id ? 'Edit Testimonial' : 'New Testimonial'}
          </h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <Input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full input-dark rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
              <Input
                value={data.location}
                onChange={(e) => setData({ ...data, location: e.target.value })}
                className="w-full input-dark rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
            <Input
              value={data.image_url}
              onChange={(e) => setData({ ...data, image_url: e.target.value })}
              className="w-full input-dark rounded-xl"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Rating (1-5)</label>
            <Input
              type="number"
              min="1"
              max="5"
              value={data.rating}
              onChange={(e) => setData({ ...data, rating: parseInt(e.target.value) })}
              className="w-full input-dark rounded-xl"
            />
          </div>

          <Tabs defaultValue="sq">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="sq">Shqip</TabsTrigger>
              <TabsTrigger value="de">Deutsch</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            
            {['sq', 'de', 'en'].map((lang) => (
              <TabsContent key={lang} value={lang} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Review Text ({lang.toUpperCase()})</label>
                  <Textarea
                    value={data.text?.[lang] || ''}
                    onChange={(e) => setData({ ...data, text: { ...data.text, [lang]: e.target.value } })}
                    className="w-full input-dark rounded-xl"
                    rows={3}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="testimonial_active"
              checked={data.is_active}
              onChange={(e) => setData({ ...data, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600"
            />
            <label htmlFor="testimonial_active" className="text-sm text-slate-300">Active</label>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10">
            Cancel
          </button>
          <button onClick={() => onSave(data)} disabled={loading} className="btn-primary px-4 py-2 rounded-full text-white font-medium">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
