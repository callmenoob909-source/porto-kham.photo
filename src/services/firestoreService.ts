import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { PhotoWork, PhotographerProfile } from '../types';
import { WORKS_DATA, HERO_IMAGE, PROFILE_DATA } from '../data/portfolio';

const WORKS_COLLECTION = 'works';
const SETTINGS_COLLECTION = 'settings';
const CONFIG_DOC = 'config';

export interface RemoteSettings {
  hero: { url: string; alt: string };
  profile: PhotographerProfile;
  adminPin: string;
}

// 1. Subscribe to real-time works updates from Firestore
export function subscribeToWorks(callback: (works: PhotoWork[]) => void) {
  const worksRef = collection(db, WORKS_COLLECTION);
  const q = query(worksRef, orderBy('order', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is still empty, seed default works in background
        seedDefaultWorksIfEmpty();
        callback(WORKS_DATA);
        return;
      }

      const items: PhotoWork[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        items.push({
          id: docSnap.id,
          title: d.title || 'Untitled',
          category: d.category || 'WEDDING',
          categoryLabel: d.categoryLabel || d.category || 'Wedding',
          image: d.image || '',
          aspectRatio: d.aspectRatio || 'portrait',
          orientation: d.orientation || (d.aspectRatio === 'landscape' ? 'horizontal' : 'vertical'),
          year: d.year || '2026',
          location: d.location || '',
          alt: d.alt || `${d.title} - Fotografi oleh Irkham`,
        });
      });
      callback(items);
    },
    (err) => {
      console.warn('Firestore snapshot error for works, using fallback:', err);
    }
  );
}

// 2. Subscribe to real-time site settings (Hero, Profile, Admin PIN)
export function subscribeToSettings(
  callback: (settings: RemoteSettings) => void
) {
  const configDocRef = doc(db, SETTINGS_COLLECTION, CONFIG_DOC);

  return onSnapshot(
    configDocRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        const initial: RemoteSettings = {
          hero: HERO_IMAGE,
          profile: PROFILE_DATA,
          adminPin: '111222',
        };
        // Save initial defaults to Firestore
        setDoc(configDocRef, initial).catch(console.warn);
        callback(initial);
        return;
      }

      const data = snapshot.data();
      callback({
        hero: data.hero || HERO_IMAGE,
        profile: data.profile || PROFILE_DATA,
        adminPin: data.adminPin || '111222',
      });
    },
    (err) => {
      console.warn('Firestore snapshot error for settings:', err);
    }
  );
}

// 3. Seed default works if the collection is brand new
async function seedDefaultWorksIfEmpty() {
  try {
    const worksRef = collection(db, WORKS_COLLECTION);
    const snap = await getDocs(worksRef);
    if (snap.empty) {
      const batch = writeBatch(db);
      WORKS_DATA.forEach((work, idx) => {
        const docRef = doc(db, WORKS_COLLECTION, work.id);
        batch.set(docRef, {
          title: work.title,
          category: work.category,
          categoryLabel: work.categoryLabel || work.category,
          image: work.image,
          aspectRatio: work.aspectRatio || 'portrait',
          orientation: work.orientation || 'vertical',
          year: work.year || '2026',
          location: work.location || '',
          alt: work.alt || `${work.title} - Fotografi oleh Irkham`,
          order: idx,
          createdAt: new Date().toISOString(),
        });
      });
      await batch.commit();
    }
  } catch (err) {
    console.warn('Failed seeding default works:', err);
  }
}

// 4. Save entire works array (add/update/delete/reorder)
export async function syncAllWorksToFirestore(worksList: PhotoWork[]) {
  try {
    const worksRef = collection(db, WORKS_COLLECTION);
    const currentSnap = await getDocs(worksRef);
    const existingIds = new Set(currentSnap.docs.map((d) => d.id));
    const newIds = new Set(worksList.map((w) => w.id));

    // Delete any documents removed by admin
    const batch = writeBatch(db);
    for (const docSnap of currentSnap.docs) {
      if (!newIds.has(docSnap.id)) {
        batch.delete(docSnap.ref);
      }
    }

    // Set / Update all items with their ordered index
    worksList.forEach((work, idx) => {
      const docRef = doc(db, WORKS_COLLECTION, work.id);
      batch.set(
        docRef,
        {
          title: work.title,
          category: work.category,
          categoryLabel: work.categoryLabel || work.category,
          image: work.image,
          aspectRatio: work.aspectRatio || 'portrait',
          orientation: work.orientation || (work.aspectRatio === 'landscape' ? 'horizontal' : 'vertical'),
          year: work.year || '2026',
          location: work.location || '',
          alt: work.alt || `${work.title} - Fotografi oleh Irkham`,
          order: idx,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    });

    await batch.commit();
    return true;
  } catch (err) {
    console.error('Failed to sync works to Firestore:', err);
    throw err;
  }
}

// 5. Update individual work
export async function saveSingleWorkToFirestore(work: PhotoWork, order: number = 0) {
  const docRef = doc(db, WORKS_COLLECTION, work.id);
  await setDoc(
    docRef,
    {
      title: work.title,
      category: work.category,
      categoryLabel: work.categoryLabel || work.category,
      image: work.image,
      aspectRatio: work.aspectRatio || 'portrait',
      orientation: work.orientation || (work.aspectRatio === 'landscape' ? 'horizontal' : 'vertical'),
      year: work.year || '2026',
      location: work.location || '',
      alt: work.alt || `${work.title} - Fotografi oleh Irkham`,
      order,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

// 6. Delete single work
export async function deleteSingleWorkFromFirestore(workId: string) {
  const docRef = doc(db, WORKS_COLLECTION, workId);
  await deleteDoc(docRef);
}

// 7. Update Hero Image
export async function updateHeroInFirestore(hero: { url: string; alt: string }) {
  const configDocRef = doc(db, SETTINGS_COLLECTION, CONFIG_DOC);
  await setDoc(configDocRef, { hero, updatedAt: new Date().toISOString() }, { merge: true });
}

// 8. Update Profile
export async function updateProfileInFirestore(profile: PhotographerProfile) {
  const configDocRef = doc(db, SETTINGS_COLLECTION, CONFIG_DOC);
  await setDoc(configDocRef, { profile, updatedAt: new Date().toISOString() }, { merge: true });
}

// 9. Update Admin PIN
export async function updatePinInFirestore(adminPin: string) {
  const configDocRef = doc(db, SETTINGS_COLLECTION, CONFIG_DOC);
  await setDoc(configDocRef, { adminPin, updatedAt: new Date().toISOString() }, { merge: true });
}
