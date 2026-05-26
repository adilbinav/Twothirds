export interface Donation {
  id: string;
  donorName: string;
  email?: string;
  amount: number;
  date: string;
  campaignId: string;
  isAnonymous: boolean;
  message?: string;
  certificateCode?: string;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  focusArea: 'Education & Youth' | 'Women’s Empowerment' | 'Sustainable Livelihoods' | 'Climate & Environment' | 'Health & Nutrition';
  location: string;
  requirements: string[];
  duration: string;
  spotsAvailable: number;
  status: 'active' | 'closed';
  appliesCount: number;
  postedDate: string;
}

export interface VolunteerApplication {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  skills: string;
  comments: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ImpactStory {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'Education' | 'Women’s Empowerment' | 'Livelihoods' | 'Climate & Coast' | 'Health';
  author: string;
  date: string;
  likes: number;
  imageTheme: 'ocean' | 'women' | 'education' | 'climate' | 'fishing';
  readTime: string;
}

export interface GrowthGoal {
  id: string;
  title: string;
  targetAmount: number; // in Indian Rupees
  currentAmount: number;
  timeline: string;
  objectives: string[];
  details: string;
}

export interface ProofPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  uploadedAt: string;
  uploaderName: string;
}

