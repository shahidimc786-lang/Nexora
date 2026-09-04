import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Pricing } from './components/Pricing';
import { About } from './components/About';
import { Process } from './components/Process';
import { DeliveryInfo } from './components/DeliveryInfo';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { ProjectOrderModal } from './components/ProjectOrderModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ProjectType } from './types';

export default function App() {
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<string>('Website Development');
  const [activeSection, setActiveSection] = useState<string>('home');

  // Modals state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalPresetType, setOrderModalPresetType] = useState<ProjectType | undefined>(undefined);

  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackingInitialOrderId, setTrackingInitialOrderId] = useState<string>('');

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Scroll spy to highlight active section in Header
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'about', 'pricing', 'process', 'delivery-info', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToContact = (serviceName?: string) => {
    if (serviceName) {
      setSelectedServiceForContact(serviceName);
    }
    scrollToSection('contact');
  };

  const handleStartProject = (presetType?: ProjectType) => {
    setOrderModalPresetType(presetType);
    setIsOrderModalOpen(true);
  };

  const handleTrackOrder = (orderId?: string) => {
    if (orderId) {
      setTrackingInitialOrderId(orderId);
    }
    setIsTrackModalOpen(true);
  };

  const handleOrderCreatedSuccess = (orderId: string) => {
    // Open tracking modal with newly created Order ID
    setTrackingInitialOrderId(orderId);
    setIsTrackModalOpen(true);
  };

  const handleSelectService = (serviceTitle: string) => {
    if (serviceTitle.toLowerCase().includes('app')) {
      handleStartProject('mobile_app');
    } else if (serviceTitle.toLowerCase().includes('brand') || serviceTitle.toLowerCase().includes('logo')) {
      handleStartProject('branding');
    } else {
      handleStartProject('website');
    }
  };

  const handleSelectPlan = (planName: string) => {
    if (planName === 'STARTER') {
      setSelectedServiceForContact('Starter Website Plan (₹1,499+)');
      handleStartProject('website');
    } else if (planName === 'BUSINESS') {
      setSelectedServiceForContact('Business Website Plan (₹2,999+)');
      handleStartProject('website');
    } else if (planName === 'PREMIUM') {
      setSelectedServiceForContact('Premium Website Plan (₹4,999+)');
      handleStartProject('combo');
    } else {
      setSelectedServiceForContact('Custom Digital Solution');
      handleStartProject('website');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Fixed Header */}
      <Header
        activeSection={activeSection}
        onNavigateToContact={() => handleNavigateToContact()}
        onStartProject={() => handleStartProject()}
        onTrackOrder={() => handleTrackOrder()}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        <Hero
          onGetStarted={() => handleStartProject()}
          onViewServices={() => scrollToSection('services')}
          onTrackOrder={() => handleTrackOrder()}
        />

        <Services onSelectService={handleSelectService} />

        <About />

        <Process onStartProcess={() => handleStartProject()} />

        <DeliveryInfo onStartProject={() => handleStartProject()} />

        <Pricing onSelectPlan={handleSelectPlan} />

        <Contact
          initialService={selectedServiceForContact}
          onClearService={() => setSelectedServiceForContact('Website Development')}
        />
      </main>

      {/* Site Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenTracking={() => handleTrackOrder()}
        onStartProject={() => handleStartProject()}
      />

      {/* Persistent Floating WhatsApp Help Trigger */}
      <WhatsAppFloatingButton />

      {/* Order Project Modal (Multi-step form, requirements, files, payment, order ID) */}
      <ProjectOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialProjectType={orderModalPresetType}
        onOrderSuccess={handleOrderCreatedSuccess}
      />

      {/* Track Order Modal (Order ID search, 7-stage visual milestone tracker) */}
      <TrackOrderModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        initialOrderId={trackingInitialOrderId}
      />

      {/* Protected Private Admin Dashboard (Password protected, order management, status updates) */}
      <AdminDashboard
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
