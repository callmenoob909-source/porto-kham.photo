import { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WorkGallery from './components/WorkGallery';
import PhotoLightbox from './components/PhotoLightbox';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PhotoEditorModal from './components/PhotoEditorModal';
import PinAuthModal from './components/PinAuthModal';
import { PhotoWork, PhotographerProfile } from './types';
import { WORKS_DATA, HERO_IMAGE, PROFILE_DATA } from './data/portfolio';

const STORAGE_KEY_WORKS = 'kham_portfolio_works_v1';
const STORAGE_KEY_HERO = 'kham_portfolio_hero_v1';
const STORAGE_KEY_PROFILE = 'kham_portfolio_profile_v1';
const STORAGE_KEY_PIN = 'kham_portfolio_pin_v1';
const STORAGE_KEY_AUTH = 'kham_portfolio_auth_v1';
const DEFAULT_PIN = '1406';

export default function App() {
  // Gallery works state with LocalStorage persistence
  const [works, setWorks] = useState<PhotoWork[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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

  // Editor Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Owner PIN and Authentication state
  const [ownerPin, setOwnerPin] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PIN) || DEFAULT_PIN;
  });

  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Lightbox State
  const [activePhoto, setActivePhoto] = useState<PhotoWork | null>(null);
  const [currentPhotosList, setCurrentPhotosList] = useState<PhotoWork[]>(works);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Keep currentPhotosList in sync if works change
  useEffect(() => {
    setCurrentPhotosList(works);
  }, [works]);

  // Keyboard shortcut: Shift + E to trigger owner PIN unlock or editor toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        if (isOwnerAuthenticated) {
          setIsEditorOpen((prev) => !prev);
        } else {
          setIsPinModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOwnerAuthenticated]);

  const handlePinSuccess = () => {
    setIsOwnerAuthenticated(true);
    sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
    setIsEditorOpen(true);
  };

  const handleLockOwner = () => {
    setIsOwnerAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
    setIsEditorOpen(false);
  };

  const handleUpdatePin = (newPin: string) => {
    setOwnerPin(newPin);
    localStorage.setItem(STORAGE_KEY_PIN, newPin);
  };

  const handleSaveWorks = (newWorks: PhotoWork[]) => {
    setWorks(newWorks);
    try {
      localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(newWorks));
    } catch (e) {
      console.error('LocalStorage quota error', e);
    }
  };

  const handleSaveHeroImage = (newHero: { url: string; alt: string }) => {
    setHeroImage(newHero);
    try {
      localStorage.setItem(STORAGE_KEY_HERO, JSON.stringify(newHero));
    } catch (e) {
      console.error('LocalStorage quota error', e);
    }
  };

  const handleSaveProfile = (newProfile: PhotographerProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    } catch (e) {
      console.error('LocalStorage quota error', e);
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

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] selection:bg-[#141414] selection:text-[#FAF8F5] relative">
      {/* Top Minimalist Navigation */}
      <Navbar
        onNavigate={handleScrollToSection}
        onOpenEditor={() => setIsEditorOpen(true)}
        isOwner={isOwnerAuthenticated}
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
          onOpenEditor={() => setIsEditorOpen(true)}
          isOwner={isOwnerAuthenticated}
        />

        {/* About Section */}
        <About profile={profile} />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Minimalist Footer */}
      <Footer
        onOpenEditor={() => setIsEditorOpen(true)}
        isOwner={isOwnerAuthenticated}
        onOpenAuth={() => setIsPinModalOpen(true)}
        onLock={handleLockOwner}
      />

      {/* Persistent Floating Studio Curator Pill - ONLY visible when Owner is authenticated */}
      {isOwnerAuthenticated && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            id="floating-manage-photos-btn"
            onClick={() => setIsEditorOpen(true)}
            className="group flex items-center space-x-2.5 bg-[#141414] text-[#FAF8F5] hover:bg-[#333333] px-4 py-3 shadow-xl transition-all duration-300 cursor-pointer focus:outline-none border border-black/10 hover:shadow-2xl"
            title="Buka panel kelola atau tambah foto (Owner Mode)"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[1.75] transition-transform duration-300 group-hover:rotate-45" />
            <span className="text-[11px] tracking-[0.2em] uppercase font-medium">
              Kelola Foto
            </span>
          </button>
        </div>
      )}

      {/* In-App Photo & Portfolio Editor Modal */}
      <PhotoEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        works={works}
        onSaveWorks={handleSaveWorks}
        heroImage={heroImage}
        onSaveHeroImage={handleSaveHeroImage}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onResetDefaults={handleResetDefaults}
        currentPin={ownerPin}
        onUpdatePin={handleUpdatePin}
        onLock={handleLockOwner}
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
