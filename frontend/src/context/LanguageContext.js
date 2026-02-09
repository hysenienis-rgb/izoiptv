import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  sq: {
    // Navigation
    nav: {
      home: 'Kryefaqja',
      packages: 'Paketat',
      about: 'Rreth Nesh',
      faq: 'FAQ',
      contact: 'Kontakti',
      admin: 'Admin'
    },
    // Hero Section
    hero: {
      title: 'Izo IPTV',
      subtitle: 'Përvoja më e mirë e televizionit',
      description: 'Shijojeni argëtimin pa kufij me mbi 10,000+ kanale, filma dhe seri në cilësi të lartë HD, FHD dhe 4K.',
      cta_packages: 'Shiko Paketat',
      cta_contact: 'Kontakto'
    },
    // Features
    features: {
      title: 'Pse të zgjidhni Izo IPTV?',
      subtitle: 'Argëtim premium në çdo pajisje tuajën',
      channels: {
        title: 'Mbi 10,000+ Kanale',
        description: 'Sport, filma, dokumentarë, kanale për fëmijë dhe shumë më tepër nga e gjithë bota.'
      },
      vod: {
        title: 'Filma & Seri VOD',
        description: 'Bibliotekë e gjerë me filmat dhe seritë më të fundit, të përditësuar vazhdimisht.'
      },
      quality: {
        title: 'Cilësi HD / FHD / 4K',
        description: 'Shijoni përmbajtje në cilësinë më të lartë të mundshme për përvojë kinematografike.'
      },
      devices: {
        title: 'Punon në çdo pajisje',
        description: 'Smart TV, telefon, tablet, kompjuter, Fire Stick dhe shumë pajisje të tjera.'
      }
    },
    // Devices
    devices: {
      title: 'Pajisje të Mbështetura',
      subtitle: 'Një abonim, të gjitha pajisjet tuaja',
      smart_tv: 'Smart TV',
      android_box: 'Android Box',
      fire_stick: 'Fire Stick',
      mobile: 'Telefon & Tablet',
      pc: 'PC & Mac',
      mag: 'MAG Box'
    },
    // Testimonials
    testimonials: {
      title: 'Çfarë thonë klientët tanë',
      subtitle: 'Mijëra klientë të kënaqur nga e gjithë bota'
    },
    // FAQ Preview
    faq_preview: {
      title: 'Pyetje të Shpeshta',
      view_all: 'Shiko të gjitha pyetjet'
    },
    // Packages Page
    packages: {
      title: 'Zgjidhni Paketën Tuaj',
      subtitle: 'Plane fleksibël për çdo nevojë',
      per_month: '/ muaj',
      order: 'Porosit Tani',
      popular: 'Më Popullorja',
      comparison_title: 'Krahasimi i Paketave',
      feature: 'Karakteristika',
      devices_count: 'Numri i pajisjeve',
      live_channels: 'Kanale Live',
      vod: 'VOD (Filma & Seri)',
      quality: 'Cilësia',
      catch_up: 'Catch-up',
      support: 'Mbështetje',
      sd_hd: 'SD/HD',
      hd_fhd: 'HD/FHD',
      up_to_4k: 'Deri në 4K',
      days_7: '7 ditë',
      days_14: '14 ditë',
      standard_support: 'Standarde',
      priority_support: 'Prioritare'
    },
    // About Page
    about: {
      title: 'Rreth Izo IPTV',
      subtitle: 'Partneri juaj i besueshëm për argëtim televiziv',
      intro: 'Izo IPTV është një ofrues premium i shërbimeve IPTV që sjell televizionin më të mirë drejtpërdrejt në shtëpinë tuaj. Me vite përvojë në industri, ne ofrojmë cilësi të jashtëzakonshme dhe mbështetje të shkëlqyer për klientët tanë.',
      mission_title: 'Misioni Ynë',
      mission_text: 'Misioni ynë është t\'ju ofrojmë akses në argëtimin më të mirë televiziv me cilësi të lartë, çmime të arsyeshme dhe mbështetje të vazhdueshme. Ne besojmë se çdokush meriton të shijoni programet e tyre të preferuara pa kompromis.',
      quality_title: 'Cilësi e Garantuar',
      quality_text: 'Ne përdorim servera të avancuar dhe teknologji moderne për të siguruar transmetim të qëndrueshëm dhe cilësor. Stafi ynë teknik monitoron sistemin 24/7 për të garantuar përvojën më të mirë.',
      why_title: 'Pse Izo IPTV?',
      why_items: [
        'Mbi 10,000+ kanale nga e gjithë bota',
        'Bibliotekë e gjerë VOD me filma dhe seri',
        'Cilësi transmetimi HD, FHD dhe 4K',
        'Mbështetje e shpejtë dhe profesionale',
        'Çmime konkurruese dhe plane fleksibël',
        'Aktivizim i shpejtë i llogarisë'
      ]
    },
    // FAQ Page
    faq: {
      title: 'Pyetje të Shpeshta',
      subtitle: 'Gjeni përgjigjet për pyetjet më të zakonshme'
    },
    // Contact Page
    contact: {
      title: 'Na Kontaktoni',
      subtitle: 'Jemi këtu për t\'ju ndihmuar',
      form_name: 'Emri juaj',
      form_email: 'Email adresa',
      form_subject: 'Subjekti',
      form_message: 'Mesazhi juaj',
      form_submit: 'Dërgo Mesazhin',
      form_success: 'Mesazhi u dërgua me sukses!',
      form_error: 'Ndodhi një gabim. Ju lutem provoni përsëri.',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      email: 'Email',
      info_title: 'Informacione Kontakti',
      info_text: 'Ekipi ynë është i gatshëm t\'ju përgjigjet 24/7. Zgjidhni mënyrën tuaj të preferuar të komunikimit.'
    },
    // Footer
    footer: {
      description: 'Izo IPTV - Ofrues premium i shërbimeve televizive IPTV. Argëtim pa kufij në çdo pajisje tuajën.',
      quick_links: 'Lidhje të Shpejta',
      legal: 'Ligjore',
      privacy: 'Politika e Privatësisë',
      terms: 'Kushtet e Shërbimit',
      cookies: 'Politika e Cookies',
      copyright: '© 2024 Izo IPTV. Të gjitha të drejtat e rezervuara.'
    },
    // Cookie Banner
    cookies: {
      message: 'Ne përdorim cookies për të përmirësuar përvojën tuaj në faqen tonë.',
      accept: 'Pranoj',
      decline: 'Refuzoj',
      learn_more: 'Mëso më shumë'
    },
    // Admin
    admin: {
      login: 'Hyrje Admin',
      username: 'Përdoruesi',
      password: 'Fjalëkalimi',
      login_btn: 'Hyr',
      logout: 'Dil',
      dashboard: 'Paneli',
      packages: 'Paketat',
      faqs: 'FAQ',
      testimonials: 'Dëshmitë',
      messages: 'Mesazhet',
      content: 'Përmbajtja',
      contact_info: 'Info Kontakti',
      images: 'Imazhet',
      save: 'Ruaj',
      cancel: 'Anulo',
      delete: 'Fshi',
      edit: 'Ndrysho',
      add: 'Shto',
      unread: 'Pa lexuar',
      read: 'Lexuar',
      mark_read: 'Shëno si lexuar',
      no_messages: 'Nuk ka mesazhe'
    }
  },
  de: {
    // Navigation
    nav: {
      home: 'Startseite',
      packages: 'Pakete',
      about: 'Über Uns',
      faq: 'FAQ',
      contact: 'Kontakt',
      admin: 'Admin'
    },
    // Hero Section
    hero: {
      title: 'Izo IPTV',
      subtitle: 'Das beste Fernseherlebnis',
      description: 'Genießen Sie grenzenloses Entertainment mit über 10.000+ Kanälen, Filmen und Serien in hochwertiger HD, FHD und 4K Qualität.',
      cta_packages: 'Pakete ansehen',
      cta_contact: 'Kontakt'
    },
    // Features
    features: {
      title: 'Warum Izo IPTV wählen?',
      subtitle: 'Premium-Unterhaltung auf all Ihren Geräten',
      channels: {
        title: 'Über 10.000+ Kanäle',
        description: 'Sport, Filme, Dokumentationen, Kinderkanäle und vieles mehr aus aller Welt.'
      },
      vod: {
        title: 'Filme & Serien VOD',
        description: 'Umfangreiche Bibliothek mit den neuesten Filmen und Serien, ständig aktualisiert.'
      },
      quality: {
        title: 'HD / FHD / 4K Qualität',
        description: 'Genießen Sie Inhalte in höchstmöglicher Qualität für ein kinoähnliches Erlebnis.'
      },
      devices: {
        title: 'Funktioniert auf jedem Gerät',
        description: 'Smart TV, Telefon, Tablet, Computer, Fire Stick und viele weitere Geräte.'
      }
    },
    // Devices
    devices: {
      title: 'Unterstützte Geräte',
      subtitle: 'Ein Abonnement, alle Ihre Geräte',
      smart_tv: 'Smart TV',
      android_box: 'Android Box',
      fire_stick: 'Fire Stick',
      mobile: 'Telefon & Tablet',
      pc: 'PC & Mac',
      mag: 'MAG Box'
    },
    // Testimonials
    testimonials: {
      title: 'Was unsere Kunden sagen',
      subtitle: 'Tausende zufriedene Kunden weltweit'
    },
    // FAQ Preview
    faq_preview: {
      title: 'Häufig gestellte Fragen',
      view_all: 'Alle Fragen anzeigen'
    },
    // Packages Page
    packages: {
      title: 'Wählen Sie Ihr Paket',
      subtitle: 'Flexible Pläne für jeden Bedarf',
      per_month: '/ Monat',
      order: 'Jetzt bestellen',
      popular: 'Am beliebtesten',
      comparison_title: 'Paketvergleich',
      feature: 'Funktion',
      devices_count: 'Anzahl der Geräte',
      live_channels: 'Live-Kanäle',
      vod: 'VOD (Filme & Serien)',
      quality: 'Qualität',
      catch_up: 'Catch-up',
      support: 'Support',
      sd_hd: 'SD/HD',
      hd_fhd: 'HD/FHD',
      up_to_4k: 'Bis zu 4K',
      days_7: '7 Tage',
      days_14: '14 Tage',
      standard_support: 'Standard',
      priority_support: 'Priorität'
    },
    // About Page
    about: {
      title: 'Über Izo IPTV',
      subtitle: 'Ihr vertrauenswürdiger Partner für TV-Unterhaltung',
      intro: 'Izo IPTV ist ein Premium-Anbieter von IPTV-Diensten, der das beste Fernsehen direkt in Ihr Zuhause bringt. Mit jahrelanger Branchenerfahrung bieten wir außergewöhnliche Qualität und hervorragenden Kundensupport.',
      mission_title: 'Unsere Mission',
      mission_text: 'Unsere Mission ist es, Ihnen Zugang zu den besten TV-Inhalten in hoher Qualität, zu vernünftigen Preisen und mit kontinuierlichem Support zu bieten. Wir glauben, dass jeder seine Lieblingsprogramme ohne Kompromisse genießen verdient.',
      quality_title: 'Garantierte Qualität',
      quality_text: 'Wir verwenden fortschrittliche Server und moderne Technologie, um stabiles und qualitativ hochwertiges Streaming zu gewährleisten. Unser technisches Team überwacht das System rund um die Uhr, um das beste Erlebnis zu garantieren.',
      why_title: 'Warum Izo IPTV?',
      why_items: [
        'Über 10.000+ Kanäle aus aller Welt',
        'Umfangreiche VOD-Bibliothek mit Filmen und Serien',
        'HD, FHD und 4K Streaming-Qualität',
        'Schneller und professioneller Support',
        'Wettbewerbsfähige Preise und flexible Pläne',
        'Schnelle Kontoaktivierung'
      ]
    },
    // FAQ Page
    faq: {
      title: 'Häufig gestellte Fragen',
      subtitle: 'Finden Sie Antworten auf die häufigsten Fragen'
    },
    // Contact Page
    contact: {
      title: 'Kontaktieren Sie uns',
      subtitle: 'Wir sind hier, um Ihnen zu helfen',
      form_name: 'Ihr Name',
      form_email: 'E-Mail-Adresse',
      form_subject: 'Betreff',
      form_message: 'Ihre Nachricht',
      form_submit: 'Nachricht senden',
      form_success: 'Nachricht erfolgreich gesendet!',
      form_error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      email: 'E-Mail',
      info_title: 'Kontaktinformationen',
      info_text: 'Unser Team steht Ihnen rund um die Uhr zur Verfügung. Wählen Sie Ihre bevorzugte Kommunikationsmethode.'
    },
    // Footer
    footer: {
      description: 'Izo IPTV - Premium-Anbieter von IPTV-TV-Diensten. Grenzenlose Unterhaltung auf all Ihren Geräten.',
      quick_links: 'Schnelllinks',
      legal: 'Rechtliches',
      privacy: 'Datenschutzerklärung',
      terms: 'Nutzungsbedingungen',
      cookies: 'Cookie-Richtlinie',
      copyright: '© 2024 Izo IPTV. Alle Rechte vorbehalten.'
    },
    // Cookie Banner
    cookies: {
      message: 'Wir verwenden Cookies, um Ihr Erlebnis auf unserer Website zu verbessern.',
      accept: 'Akzeptieren',
      decline: 'Ablehnen',
      learn_more: 'Mehr erfahren'
    },
    // Admin
    admin: {
      login: 'Admin-Anmeldung',
      username: 'Benutzername',
      password: 'Passwort',
      login_btn: 'Anmelden',
      logout: 'Abmelden',
      dashboard: 'Dashboard',
      packages: 'Pakete',
      faqs: 'FAQ',
      testimonials: 'Bewertungen',
      messages: 'Nachrichten',
      content: 'Inhalt',
      contact_info: 'Kontaktinfo',
      images: 'Bilder',
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      add: 'Hinzufügen',
      unread: 'Ungelesen',
      read: 'Gelesen',
      mark_read: 'Als gelesen markieren',
      no_messages: 'Keine Nachrichten'
    }
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      packages: 'Packages',
      about: 'About Us',
      faq: 'FAQ',
      contact: 'Contact',
      admin: 'Admin'
    },
    // Hero Section
    hero: {
      title: 'Izo IPTV',
      subtitle: 'The Best Television Experience',
      description: 'Enjoy unlimited entertainment with over 10,000+ channels, movies and series in high quality HD, FHD and 4K.',
      cta_packages: 'View Packages',
      cta_contact: 'Contact Us'
    },
    // Features
    features: {
      title: 'Why Choose Izo IPTV?',
      subtitle: 'Premium entertainment on all your devices',
      channels: {
        title: 'Over 10,000+ Channels',
        description: 'Sports, movies, documentaries, kids channels and much more from around the world.'
      },
      vod: {
        title: 'Movies & Series VOD',
        description: 'Extensive library with the latest movies and series, constantly updated.'
      },
      quality: {
        title: 'HD / FHD / 4K Quality',
        description: 'Enjoy content in the highest possible quality for a cinematic experience.'
      },
      devices: {
        title: 'Works on Any Device',
        description: 'Smart TV, phone, tablet, computer, Fire Stick and many other devices.'
      }
    },
    // Devices
    devices: {
      title: 'Supported Devices',
      subtitle: 'One subscription, all your devices',
      smart_tv: 'Smart TV',
      android_box: 'Android Box',
      fire_stick: 'Fire Stick',
      mobile: 'Phone & Tablet',
      pc: 'PC & Mac',
      mag: 'MAG Box'
    },
    // Testimonials
    testimonials: {
      title: 'What Our Customers Say',
      subtitle: 'Thousands of satisfied customers worldwide'
    },
    // FAQ Preview
    faq_preview: {
      title: 'Frequently Asked Questions',
      view_all: 'View all questions'
    },
    // Packages Page
    packages: {
      title: 'Choose Your Package',
      subtitle: 'Flexible plans for every need',
      per_month: '/ month',
      order: 'Order Now',
      popular: 'Most Popular',
      comparison_title: 'Package Comparison',
      feature: 'Feature',
      devices_count: 'Number of devices',
      live_channels: 'Live Channels',
      vod: 'VOD (Movies & Series)',
      quality: 'Quality',
      catch_up: 'Catch-up',
      support: 'Support',
      sd_hd: 'SD/HD',
      hd_fhd: 'HD/FHD',
      up_to_4k: 'Up to 4K',
      days_7: '7 days',
      days_14: '14 days',
      standard_support: 'Standard',
      priority_support: 'Priority'
    },
    // About Page
    about: {
      title: 'About Izo IPTV',
      subtitle: 'Your trusted partner for TV entertainment',
      intro: 'Izo IPTV is a premium provider of IPTV services that brings the best television directly to your home. With years of industry experience, we offer exceptional quality and excellent customer support.',
      mission_title: 'Our Mission',
      mission_text: 'Our mission is to provide you with access to the best TV entertainment in high quality, at reasonable prices, and with continuous support. We believe everyone deserves to enjoy their favorite programs without compromise.',
      quality_title: 'Guaranteed Quality',
      quality_text: 'We use advanced servers and modern technology to ensure stable and quality streaming. Our technical team monitors the system 24/7 to guarantee the best experience.',
      why_title: 'Why Izo IPTV?',
      why_items: [
        'Over 10,000+ channels from around the world',
        'Extensive VOD library with movies and series',
        'HD, FHD and 4K streaming quality',
        'Fast and professional support',
        'Competitive prices and flexible plans',
        'Fast account activation'
      ]
    },
    // FAQ Page
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to the most common questions'
    },
    // Contact Page
    contact: {
      title: 'Contact Us',
      subtitle: 'We are here to help you',
      form_name: 'Your name',
      form_email: 'Email address',
      form_subject: 'Subject',
      form_message: 'Your message',
      form_submit: 'Send Message',
      form_success: 'Message sent successfully!',
      form_error: 'An error occurred. Please try again.',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      email: 'Email',
      info_title: 'Contact Information',
      info_text: 'Our team is available 24/7. Choose your preferred method of communication.'
    },
    // Footer
    footer: {
      description: 'Izo IPTV - Premium provider of IPTV television services. Unlimited entertainment on all your devices.',
      quick_links: 'Quick Links',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
      copyright: '© 2024 Izo IPTV. All rights reserved.'
    },
    // Cookie Banner
    cookies: {
      message: 'We use cookies to improve your experience on our website.',
      accept: 'Accept',
      decline: 'Decline',
      learn_more: 'Learn more'
    },
    // Admin
    admin: {
      login: 'Admin Login',
      username: 'Username',
      password: 'Password',
      login_btn: 'Login',
      logout: 'Logout',
      dashboard: 'Dashboard',
      packages: 'Packages',
      faqs: 'FAQ',
      testimonials: 'Testimonials',
      messages: 'Messages',
      content: 'Content',
      contact_info: 'Contact Info',
      images: 'Images',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      unread: 'Unread',
      read: 'Read',
      mark_read: 'Mark as read',
      no_messages: 'No messages'
    }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('izo-language');
    return saved || 'sq';
  });

  useEffect(() => {
    localStorage.setItem('izo-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
