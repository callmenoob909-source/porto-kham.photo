import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WorkGallery from './components/WorkGallery';
import PhotoLightbox from './components/PhotoLightbox';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PhotoEditorModal from './components/PhotoEditorModal';
import PinAuthModal from './components/PinAuthModal';
import AdminPage from './components/AdminPage';
import { PhotoWork, PhotographerProfile } from './types';
import { WORKS_DATA, HERO_IMAGE, PROFILE_DATA } from './data/portfolio';
import {
  subscribeToWorks,
  subscribeToSettings,
  syncAllWorksToFirestore,
  updateHeroInFirestore,
  updateProfileInFirestore,
  updatePinInFirestore,
} from './services/firestoreService';

const STORAGE_KEY_WORKS = 'kham_portfolio_works_v1';
const STORAGE_KEY_HERO = 'kham_portfolio_hero_v1';
const STORAGE_KEY_PROFILE = 'kham_portfolio_profile_v1';
const STORAGE_KEY_PIN = 'kham_portfolio_pin_v1';
const DEFAULT_PIN = '111222';

export default function App() {
  // Current route detection (e.g. '/' or '/admin')
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path === '/admin' ||
        path === '/admin/' ||
        search.includes('admin') ||
        hash.includes('admin')
      ) {
        return '/admin';
      }
      return path || '/';
    }
    return '/';
  });

  // Gallery works state with LocalStorage fallback & Firestore sync
  const [works, setWorks] = useState<PhotoWork[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORKS);
      if (saved) {
        const parsed: PhotoWork[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load works from localStorage', e);
    }
    return WORKS_DATA;
  });

  // Hero Image state
  const [heroImage, setHeroImage] = useState<{ url: string; alt: string }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HERO);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load hero from localStorage', e);
    }
    return HERO_IMAGE;
  });

  // Profile data state
  const [profile, setProfile] = useState<PhotographerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load profile from localStorage', e);
    }
    return PROFILE_DATA;
  });

  // Editor and PIN state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');

  // Owner PIN
  const [ownerPin, setOwnerPin] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PIN);
    if (!saved || saved === '1406') {
      localStorage.setItem(STORAGE_KEY_PIN, DEFAULT_PIN);
      return DEFAULT_PIN;
    }
    return saved;
  });

  // 1. Subscribe to real-time Firestore database for Works
  useEffect(() => {
    const unsubscribe = subscribeToWorks((remoteWorks) => {
      if (remoteWorks && remoteWorks.length > 0) {
        setWorks(remoteWorks);
        try {
          localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(remoteWorks));
        } catch {
          // ignore
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to real-time Firestore database for Settings (Hero, Profile, PIN)
  useEffect(() => {
    const unsubscribe = subscribeToSettings((settings) => {
      if (settings.hero) {
        setHeroImage(settings.hero);
        try {
          localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(settings.hero));
        } catch {
          // ignore
        }
      }
      if (settings.profile) {
        setProfile(settings.profile);
        try {
          localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(settings.profile));
        } catch {
          // ignore
        }
      }
      if (settings.adminPin) {
        setOwnerPin(settings.adminPin);
        try {
          localStorage.setItem(STORAGE_KEY_PIN, settings.adminPin);
        } catch {
          // ignore
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Lightbox State
  const [activePhoto, setActivePhoto] = useState<PhotoWork | null>(null);
  const [currentPhotosList, setCurrentPhotosList] = useState<PhotoWork[]>(works);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Keep currentPhotosList in sync if works change
  useEffect(() => {
    setCurrentPhotosList(works);
  }, [works]);

  // Listen to browser navigation (back/forward and custom route changes)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path === '/admin' ||
        path === '/admin/' ||
        search.includes('admin') ||
        hash.includes('admin')
      ) {
        setCurrentPath('/admin');
      } else {
        setCurrentPath(path || '/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch {
      // Fallback
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestOpenEditor = () => {
    // Navigate directly to /admin
    navigateTo('/admin');
  };

  const handlePinSuccess = () => {
    setIsPinModalOpen(false);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
  };

  // Keyboard shortcut: Shift + E to trigger /admin navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        if (currentPath === '/admin') {
          navigateTo('/');
        } else {
          navigateTo('/admin');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPath]);

  const handleLockOwner = () => {
    setIsEditorOpen(false);
    setIsPinModalOpen(false);
  };

  const handleUpdatePin = async (newPin: string) => {
    setOwnerPin(newPin);
    localStorage.setItem(STORAGE_KEY_PIN, newPin);
    try {
      await updatePinInFirestore(newPin);
    } catch (e) {
      console.warn('Could not sync PIN to Firestore:', e);
    }
  };

  const handleSaveWorks = async (newWorks: PhotoWork[]) => {
    setWorks(newWorks);
    setSyncStatus('saving');
    try {
      localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(newWorks));
      await syncAllWorksToFirestore(newWorks);
      setSyncStatus('synced');
    } catch (e) {
      console.error('Error saving works to Firestore / LocalStorage', e);
      setSyncStatus('error');
    }
  };

  const handleSaveHeroImage = async (newHero: { url: string; alt: string }) => {
    setHeroImage(newHero);
    setSyncStatus('saving');
    try {
      localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(newHero));
      await updateHeroInFirestore(newHero);
      setSyncStatus('synced');
    } catch (e) {
      console.error('Error saving hero to Firestore / LocalStorage', e);
      setSyncStatus('error');
    }
  };

  const handleSaveProfile = async (newProfile: PhotographerProfile) => {
    setProfile(newProfile);
    setSyncStatus('saving');
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
      await updateProfileInFirestore(newProfile);
      setSyncStatus('synced');
    } catch (e) {
      console.error('Error saving profile to Firestore / LocalStorage', e);
      setSyncStatus('error');
    }
  };

  const handleResetDefaults = () => {
    localStorage.removeItem(STORAGE_KEY_WORKS);
    localStorage.removeItem(STORAGE_KEY_HERO);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    setWorks(WORKS_DATA);
    setHeroImage(HERO_IMAGE);
    setProfile(PROFILE_DATA);
  };

  const handleOpenPhoto = (photo: PhotoWork, index: number, list: PhotoWork[]) => {
    setActivePhoto(photo);
    setCurrentPhotosList(list);
    setCurrentIndex(index);
  };

  const handleCloseLightbox = () => {
    setActivePhoto(null);
  };

  const handleNextPhoto = () => {
    if (currentPhotosList.length === 0) return;
    const nextIdx = (currentIndex + 1) % currentPhotosList.length;
    setCurrentIndex(nextIdx);
    setActivePhoto(currentPhotosList[nextIdx]);
  };

  const handlePrevPhoto = () => {
    if (currentPhotosList.length === 0) return;
    const prevIdx = (currentIndex - 1 + currentPhotosList.length) % currentPhotosList.length;
    setCurrentIndex(prevIdx);
    setActivePhoto(currentPhotosList[prevIdx]);
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 1. Render Admin Page if visiting /admin or khamphoto.eu.cc/admin
  if (currentPath === '/admin') {
    return (
      <AdminPage
        works={works}
        onSaveWorks={handleSaveWorks}
        heroImage={heroImage}
        onSaveHeroImage={handleSaveHeroImage}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onResetDefaults={handleResetDefaults}
        currentPin={ownerPin}
        onUpdatePin={handleUpdatePin}
        onBackToHome={() => navigateTo('/')}
        syncStatus={syncStatus}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] selection:bg-[#141414] selection:text-[#FAF8F5] relative">
      {/* Top Minimalist Navigation */}
      <Navbar
        onNavigate={handleScrollToSection}
        onOpenEditor={handleRequestOpenEditor}
        isOwner={false}
        onOpenAuth={handleRequestOpenEditor}
        profile={profile}
      />

      {/* Main Content Area */}
      <main>
        {/* Visual Hero Section */}
        <Hero
          onViewWork={() => handleScrollToSection('work')}
          heroImage={heroImage}
          profile={profile}
        />

        {/* Selected Works Editorial Gallery */}
        <WorkGallery
          works={works}
          onSelectPhoto={handleOpenPhoto}
          onOpenEditor={handleRequestOpenEditor}
          isOwner={false}
        />

        {/* About Section */}
        <About profile={profile} />

        {/* Contact Section */}
        <Contact profile={profile} />
      </main>

      {/* Minimalist Footer */}
      <Footer
        onOpenEditor={handleRequestOpenEditor}
        isOwner={false}
        onOpenAuth={handleRequestOpenEditor}
        onLock={handleCloseEditor}
        onNavigateAdmin={() => navigateTo('/admin')}
        profile={profile}
      />

      {/* In-App Photo & Portfolio Editor Modal */}
      <PhotoEditorModal
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        works={works}
        onSaveWorks={handleSaveWorks}
        heroImage={heroImage}
        onSaveHeroImage={handleSaveHeroImage}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onResetDefaults={handleResetDefaults}
        currentPin={ownerPin}
        onUpdatePin={handleUpdatePin}
        onLock={handleCloseEditor}
      />

      {/* Secret Owner PIN Authentication Modal */}
      <PinAuthModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        currentPin={ownerPin}
      />

      {/* Fullscreen Photo Lightbox Modal */}
      <PhotoLightbox
        isOpen={Boolean(activePhoto)}
        activePhoto={activePhoto}
        currentIndex={currentIndex}
        totalPhotos={currentPhotosList.length}
        onClose={handleCloseLightbox}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
      />
    </div>
  );
}
