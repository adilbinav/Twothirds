import { collection, getDocs, setDoc, doc, writeBatch } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { initialGrowthGoals, initialOpportunities, initialImpactStories, initialDonationHistory } from '../data';
import { ProofPhoto } from '../types';


export const initialProofGallery: ProofPhoto[] = [
  {
    id: "proof-1",
    title: "Mangrove Nurseries in Estuaries",
    description: "Nurturing 15,000 native mangrove saplings in the mud estuaries of Trivandrum in collaboration with local fishing elders. Restoring biodiversity buffers.",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
    category: "Climate & Coast",
    uploadedAt: "2026-05-18",
    uploaderName: "Ahmed Sajid"
  },
  {
    id: "proof-2",
    title: "Trivandrum Coast Evening Study Circles",
    description: "Young children studying after school at the Poonthura Village Centre. Fitted with solar illumination and books purchased from Year 1 target donations.",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600",
    category: "Education",
    uploadedAt: "2026-05-20",
    uploaderName: "Lijin Lowrence"
  },
  {
    id: "proof-3",
    title: "Women's Micro-Cooperative Financial Hub",
    description: "Cooperative savings meeting in Vizhinjam. Direct training sessions on digital banking apps, book auditing, and government credit registers.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    category: "Women’s Empowerment",
    uploadedAt: "2026-05-22",
    uploaderName: "Jaseemul Farhan"
  },
  {
    id: "proof-4",
    title: "Solar Fish-Dryer Micro-Units Setup",
    description: "Livelihood expansion kits handed over to coastal families in Veli, enabling professional hygienic drying and bypassing local predatory lenders.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
    category: "Livelihoods",
    uploadedAt: "2026-05-24",
    uploaderName: "Ahmed Sajid"
  },
  {
    id: "proof-5",
    title: "Weekly Mobile Pediatric Health Camp",
    description: "Under-resourced families receiving free diagnostic screenings and nutritional formula kits from registered pediatricians in Trivandrum Coast.",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600",
    category: "Health",
    uploadedAt: "2026-05-25",
    uploaderName: "Khaleel Hamadan"
  }
];

export async function seedInitialDataIfEmpty() {
  try {
    // 1. Seed Growth Goals if empty
    const goalsRef = collection(db, 'growthGoals');
    const goalsSnapshot = await getDocs(goalsRef);
    if (goalsSnapshot.empty) {
      console.log('Seeding growth goals to Firestore...');
      for (const goal of initialGrowthGoals) {
        await setDoc(doc(db, 'growthGoals', goal.id), goal);
      }
    }

    // 2. Seed Opportunities if empty
    const oppsRef = collection(db, 'opportunities');
    const oppsSnapshot = await getDocs(oppsRef);
    if (oppsSnapshot.empty) {
      console.log('Seeding opportunities to Firestore...');
      for (const opp of initialOpportunities) {
        await setDoc(doc(db, 'opportunities', opp.id), opp);
      }
    }

    // 3. Seed Impact Stories if empty
    const storiesRef = collection(db, 'stories');
    const storiesSnapshot = await getDocs(storiesRef);
    if (storiesSnapshot.empty) {
      console.log('Seeding impact stories to Firestore...');
      for (const story of initialImpactStories) {
        await setDoc(doc(db, 'stories', story.id), story);
      }
    }

    // 4. Seed donations history if empty
    const donationsRef = collection(db, 'donations');
    const donationsSnapshot = await getDocs(donationsRef);
    if (donationsSnapshot.empty) {
      console.log('Seeding donations history to Firestore...');
      for (const don of initialDonationHistory) {
        await setDoc(doc(db, 'donations', don.id), {
          ...don,
          campaignId: don.campaignId || 'campaign-y1'
        });
      }
    }

    // 5. Seed proofGallery if empty
    const proofRef = collection(db, 'proofGallery');
    const proofSnapshot = await getDocs(proofRef);
    if (proofSnapshot.empty) {
      console.log('Seeding proof gallery to Firestore...');
      for (const proof of initialProofGallery) {
        await setDoc(doc(db, 'proofGallery', proof.id), proof);
      }
    }

    console.log('Seeding process completed check successfully.');
  } catch (err) {
    console.error('Seeding errored, probably due to public permission rules when unauthenticated. We can ignore since seeding needs admin or basic writes.', err);
  }
}
