import { VolunteerOpportunity, ImpactStory, GrowthGoal, Donation } from './types';

export const teamMembers = [
  {
    name: "Ahmed Sajid",
    role: "Founder & Professional Social Worker",
    bio: "Passionate social entrepreneur spearheading coastal grassroots movements, with over a decade of community organization experience across Kerala.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300" // Fallback high-fidelity placeholder
  },
  {
    name: "Lijin Lowrence",
    role: "Director & Professional at USA",
    bio: "Drives strategic global partnerships and resource optimization to bridge the divide between international supporters and coastal grassroots needs.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
  },
  {
    name: "Jaseemul Farhan",
    role: "Co-founder & PhD Scholar at Jamia Millia",
    bio: "Focuses on rigorous academic research, community policy evaluation, and evidence-backed social integration programs for marginalized youth.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"
  },
  {
    name: "Khaleel Hamadan",
    role: "Member & Architect at Turkey",
    bio: "Guides sustainable, climate-resilient infrastructure layouts, mangrove layout zones, and low-cost eco-friendly community spaces.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300"
  }
];

export const focusAreas = [
  {
    id: "edu",
    title: "Education & Youth",
    tagline: "Ensuring coastal children stay in school and dream big",
    description: "Setting up supplementary study centres, evening tutor groups, and digital libraries across remote coastal fishing villages. We provide learning kits and career workshops to curb high dropout rates.",
    accomplishments: "Supported 240+ students with study-mentorship circles."
  },
  {
    id: "women",
    title: "Women’s Empowerment",
    tagline: "Skill training, SHGs, leadership, and financial literacy",
    description: "Mobilizing local micro-savings Self-Help Groups (SHGs) to run fish value-addition facilities, craft circles, and local co-operatives. Providing direct digital financial training.",
    accomplishments: "Empowered 120+ women in financial accounting and digital banking."
  },
  {
    id: "livelihoods",
    title: "Sustainable Livelihoods",
    tagline: "Beyond fishing: aquaculture, value addition, market links",
    description: "Diversifying income streams via safe marine cage farming, seaweed cultivation, modern drying equipment, and direct market integration that eliminates predatory middlemen.",
    accomplishments: "Established 3 cooperative fish-dryer micro-units."
  },
  {
    id: "climate",
    title: "Climate & Environment",
    tagline: "Mangrove restoration, awareness, disaster preparedness",
    description: "Planting native mangrove saplings to buffer cyclone surges, fighting tidal erosion and beach degradation, and carrying out coastal plastic trash extraction.",
    accomplishments: "Restored 1.2 hectares of active mangrove buffers since 2018."
  },
  {
    id: "health",
    title: "Health & Nutrition",
    tagline: "Supporting health access, nutrition, and sanitation",
    description: "Organizing mobile health clinics, distributing fresh iron-fortified multi-nutrient food packets list, and creating hygienic community sanitation layouts in remote coastal hamlets.",
    accomplishments: "Conducted 15+ remote check-up camps with expert pediatricians."
  }
];

export const initialGrowthGoals: GrowthGoal[] = [
  {
    id: "goal-y1",
    title: "Year 1 - Immediate Expansion Target",
    targetAmount: 2000000, // ₹20 Lakhs
    currentAmount: 1140000, // ~57% achieved
    timeline: "2026 - 2027",
    objectives: [
      "Baseline survey of 500 family units across 5 vulnerable coastal areas",
      "Setting up permanent Community Grassroots Office in Trivandrum Coastline",
      "Launching pilot women's alternative livelihood initiative supporting 50 women directly"
    ],
    details: "Every rupee is fully audited, transparently reported on-chain/on-site, and reaches coastal families directly. We provide comprehensive project development reports to all donors."
  },
  {
    id: "goal-y2",
    title: "Year 2 - Collaborative Scale-Up",
    targetAmount: 5000000, // ₹50 Lakhs
    currentAmount: 0,
    timeline: "2027 - 2028",
    objectives: [
      "Scaling structured development programs to 5 major coastal villages across central Kerala",
      "Onboarding 3-4 professional full-time community field officers",
      "Expanding high-impact programs including supplementary education sessions and weekly medicine camps"
    ],
    details: "Focuses on deep regional integration, enabling community structures to manage livelihoods and prevent forced migration of high-school youth to crowded metropolitan zones."
  }
];

export const initialOpportunities: VolunteerOpportunity[] = [
  {
    id: "opp-1",
    title: "Mangrove Coastal Restoration Volunteer",
    description: "Join our weekend hands-on planting drive. Help plant mangrove saplings, survey coastal nurseries, and raise ecological awareness in remote Kerala villages.",
    focusArea: "Climate & Environment",
    location: "Trivandrum Coast & Estuaries",
    requirements: [
      "Physically fit for outdoor mud wading",
      "Basic interest in coastal ecology or gardening",
      "Willingness to spend 4 hours on Saturday mornings"
    ],
    duration: "Saturdays / 4 Weeks",
    spotsAvailable: 25,
    status: "active",
    appliesCount: 16,
    postedDate: "2026-05-10"
  },
  {
    id: "opp-2",
    title: "Women's SHG Financial Literacy Mentor",
    description: "Support local women's Self Help Groups (SHGs) by teaching basic book-keeping, how to operate UPI banking apps, and navigating government micro-credit schemes.",
    focusArea: "Women’s Empowerment",
    location: "Veli / Vizhinjam Coastal Hamlets",
    requirements: [
      "Fluency in Malayalam (highly preferred) or English with high empathy",
      "Understanding of basic accounting/digital payment tools",
      "Commitment of 2 hours on Sunday afternoons"
    ],
    duration: "Flexible / 8 Weeks",
    spotsAvailable: 5,
    status: "active",
    appliesCount: 3,
    postedDate: "2026-05-18"
  },
  {
    id: "opp-3",
    title: "Evening Auxiliary Tutor for Board Students",
    description: "Help children in 10th standard stay on track with mathematics, science, and English grammar at our evening study centres to prevent coastal dropouts.",
    focusArea: "Education & Youth",
    location: "Poonthura Village Centre & Digital Library",
    requirements: [
      "Strong background in high school subjects",
      "Patience and encouragement to work with first-generation learners",
      "Available 2 evenings a week (5:00 PM - 6:30 PM)"
    ],
    duration: "Ongoing / Academic Term",
    spotsAvailable: 8,
    status: "active",
    appliesCount: 9,
    postedDate: "2026-05-22"
  },
  {
    id: "opp-4",
    title: "Mobile Health Camp Administrative Assistant",
    description: "Help coordinate client registrations, track height/weight charts, distribute nutrition packs, and manage queue layouts at our local coastal medical camps.",
    focusArea: "Health & Nutrition",
    location: "Remote Trivandrum Coastal Hamlets",
    requirements: [
      "Empathetic communicator with strong organizing skills",
      "Basic data entry skills using mobile apps or sheets",
      "Available on select weekend camp schedules"
    ],
    duration: "3 Alternate Weekends",
    spotsAvailable: 12,
    status: "active",
    appliesCount: 4,
    postedDate: "2026-05-25"
  }
];

export const initialImpactStories: ImpactStory[] = [
  {
    id: "story-1",
    title: "From Shells to Financial Independence: Bindu's Journey",
    description: "How Bindu, a mother of two in Vizhinjam, mastered micro-accounting and steered an entire cooperative SHG to sell premium shell commodities.",
    content: "Bindu's family relied entirely on a single seasonal trawling income. When fish stocks plummeted in early 2018, the household faced severe debt stress. Through the Two-Thirds Community Foundation, Bindu enrolled in a comprehensive 6-week skill training and financial literacy program. Today, she leads a cooperative of 15 women fabricating bio-degradable, value-added shell and coir products. 'We don't borrow from informal lenders anymore,' she smiles. 'We have digital savings accounts and decide our own prices.'",
    category: "Women’s Empowerment",
    author: "Jaseemul Farhan",
    date: "2026-04-12",
    likes: 42,
    imageTheme: "women",
    readTime: "4 min read"
  },
  {
    id: "story-2",
    title: "The Silent Wall: Restoring Mangroves as Living Surges Shields",
    description: "How a community-driven climate action coalition successfully planted and nurtured a native mangrove forest wall along the crumbling Trivandrum estuaries.",
    content: "Kerala's coastline faces massive annual erosion under cyclone surges. While brick and concrete seawalls often sink or worsen neighboring beach erosion, the Two-Thirds Community Foundation has championed a living shield approach. Working with traditional fishermen who know the local estuary tides, our team led volunteer groups in planting 3,200 mangrove saplings. Eight years later, these trees have expanded into a dense forest zone, stabilizing the shoreline, rebuilding fish breeding environments, and shielding homes from wild tidal waves.",
    category: "Climate & Coast",
    author: "Ahmed Sajid",
    date: "2026-05-01",
    likes: 58,
    imageTheme: "climate",
    readTime: "5 min read"
  },
  {
    id: "story-3",
    title: "First Generation Learners Unlock the Digital World",
    description: "Two-Thirds volunteers establish the first community evening digital library in Poonthura, keeping young high-schoolers motivated and off dropout rosters.",
    content: "In fishing villages, kids are often drawn into active boat labor early to support family income, leading to an incredibly high dropout rate. Seeing this, the Foundation mobilized young village leaders to renovate a container room into a vibrant community library. Equipped with second-hand computers, high-speed internet, and academic guides, several volunteer tutors provide structured evening classes. The centre currently serves 75 eager students. Already, 5 participants have successfully secured fully-funded higher education scholarships!",
    category: "Education",
    author: "Lijin Lowrence",
    date: "2026-05-15",
    likes: 31,
    imageTheme: "education",
    readTime: "3 min read"
  }
];

export const initialDonationHistory: Donation[] = [
  { id: "don-1", donorName: "Rohan K.", amount: 25000, date: "2026-05-24", message: "Empower the coastal communities! Fully backing the Year 1 survey goal.", isAnonymous: false, campaignId: "goal-y1", certificateCode: "cert-110292" },
  { id: "don-2", donorName: "Anonymous Sister", amount: 5000, date: "2026-05-25", message: "For our children to study well and stay in school.", isAnonymous: true, campaignId: "goal-y1", certificateCode: "cert-234234" },
  { id: "don-3", donorName: "Mariyam Chacko", amount: 10000, date: "2026-05-26", message: "In honor of coastal mothers who work day and night.", isAnonymous: false, campaignId: "goal-y2", certificateCode: "cert-556123" },
  { id: "don-4", donorName: "Deepak & Family", amount: 50000, date: "2026-05-26", message: "CSR support for aquaculture studies. Keep up the high transparency!", isAnonymous: false, campaignId: "goal-y1", certificateCode: "cert-889021" }
];
