import React, { useState } from 'react';
import { focusAreas, teamMembers } from '../data';
import { GrowthGoal, ProofPhoto } from '../types';
import { 
  Info, AlertTriangle, Lightbulb, Compass, Users, TrendingUp, HandHelping, Banknote, Camera, Trash2, Plus, Sparkles, User, Calendar,
  Sun, Ship, Fish, Wind, GraduationCap, Waves, Heart, Check, BookOpen, Sprout
} from 'lucide-react';

const getFocusAreaIcon = (id: string) => {
  switch (id) {
    case 'edu':
      return <BookOpen className="w-10 h-10 text-[#3d5a4c] mb-4" />;
    case 'women':
      return <Users className="w-10 h-10 text-[#3d5a4c] mb-4" />;
    case 'livelihoods':
      return <Fish className="w-10 h-10 text-[#3d5a4c] mb-4" />;
    case 'climate':
      return <Sprout className="w-10 h-10 text-[#3d5a4c] mb-4" />;
    case 'health':
      return <Heart className="w-10 h-10 text-[#3d5a4c] mb-4" />;
    default:
      return <Sparkles className="w-10 h-10 text-[#3d5a4c] mb-4" />;
  }
};

interface OverviewProps {
  growthGoals: GrowthGoal[];
  setActiveTab: (tab: 'overview' | 'donations' | 'volunteer' | 'impact') => void;
  proofGallery: ProofPhoto[];
  isAdminMode: boolean;
  onAddProofPhoto: (newProof: ProofPhoto) => void;
  onDeleteProofPhoto: (proofId: string) => void;
}

export default function Overview({ 
  growthGoals, 
  setActiveTab,
  proofGallery,
  isAdminMode,
  onAddProofPhoto,
  onDeleteProofPhoto
}: OverviewProps) {
  // CMS form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Climate & Coast');
  const [uploader, setUploader] = useState('Ahmed Sajid, Direct Ops');

  const presetImages = [
    { label: "Estuary Mangroves", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800" },
    { label: "Village Library Study", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800" },
    { label: "Traditional Boats Hub", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800" },
    { label: "Women Artisan Center", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" },
    { label: "Estuary Ecology Survey", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800" }
  ];

  const handleCMSFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageUrl) {
      alert("Please fill all fields or click a Preset Photo link!");
      return;
    }

    const newPhoto: ProofPhoto = {
      id: 'proof-' + Date.now(),
      title,
      description,
      imageUrl,
      category,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploaderName: uploader || 'Trust Admin'
    };

    onAddProofPhoto(newPhoto);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-16 py-6 pb-20">
      
      {/* Immersive Welcome Hero */}
      <section className="bg-[#3d5a4c] text-[#f9f7f2] rounded-none p-6 sm:p-12 relative overflow-hidden border border-[#1a1a1a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(26,26,26,0.15),transparent)] pointer-events-none" />
        <div className="max-w-3xl relative z-10 space-y-6">
          <span className="inline-block bg-[#1a1a1a] text-white text-xs font-mono font-bold tracking-widest px-3 py-1 uppercase border border-[#f9f7f2]/10">
            Kerala's Grassroots Coastal Trust
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl font-black tracking-tight leading-none text-white italic">
            For the two-thirds <br />
            <span className="font-light not-italic text-[#ebf0ec]">who deserve better</span>
          </h2>
          <p className="text-lg text-[#ebf0ec]/90 font-serif font-light leading-relaxed max-w-2xl italic">
            Despite living alongside abundant natural resources, coastal fishing hamlets remain among India's most marginalized. We are a registered Section 8 nonprofit partnering directly with local community leadership to build sustainable livelihoods, restore mangrove buffers, and ensure kids keep dreaming big.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              id="hero-donate-btn"
              onClick={() => setActiveTab('donations')}
              className="bg-[#1a1a1a] hover:bg-black text-[#f9f7f2] border border-[#1a1a1a] px-6 py-3 rounded-none font-bold text-xs uppercase tracking-wider select-none cursor-pointer flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <Banknote className="w-4 h-4" />
              <span>Back Our Expansion</span>
            </button>
            <button
              id="hero-volunteer-btn"
              onClick={() => setActiveTab('volunteer')}
              className="bg-transparent hover:bg-white/10 text-white border border-white px-6 py-3 rounded-none font-bold text-xs uppercase tracking-wider select-none cursor-pointer flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <HandHelping className="w-4 h-4" />
              <span>Join as a Volunteer</span>
            </button>
          </div>
        </div>
      </section>

      {/* Vision & Mission Split Card */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-none p-8 border border-[#1a1a1a]/15 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3d5a4c]" />
          <div className="flex items-center gap-3 mb-4">
            <Sun className="w-8 h-8 text-[#3d5a4c]" />
            <h3 className="font-serif text-2xl font-bold text-[#1a1a1a]">Our Vision</h3>
          </div>
          <p className="text-stone-700 font-sans leading-relaxed text-base">
            A world where coastal and marginalized communities live with genuine dignity, access to global opportunities, and localized climate resilience.
          </p>
        </div>

        <div className="bg-white rounded-none p-8 border border-[#1a1a1a]/15 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1a1a1a]" />
          <div className="flex items-center gap-3 mb-4">
            <Ship className="w-8 h-8 text-stone-900" />
            <h3 className="font-serif text-2xl font-bold text-[#1a1a1a]">Our Mission</h3>
          </div>
          <p className="text-stone-700 font-sans leading-relaxed text-base">
            To work hand-in-hand alongside vulnerable communities to build sustainable decentralized livelihoods, advance high-school education, empower coastal women, and actively secure environment margins—through mutual grassroots trust.
          </p>
        </div>
      </section>

      {/* Extreme Problem Detail Accordion */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-stone-800 text-xs font-mono tracking-widest uppercase font-bold border-b border-[#1a1a1a] pb-1">
            <AlertTriangle className="w-4 h-4 text-[#3d5a4c]" />
            <span>Underlying Reality</span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#1a1a1a]">
            The Reality Coastal Communities Face
          </h3>
          <p className="text-xs text-stone-500 uppercase tracking-wider font-mono">
            India's coastal margins are home to over 150 million people, facing unique structural challenges that standard government schemes sometimes cannot solve alone.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-none border border-[#1a1a1a]/15 transition-all">
            <Fish className="w-8 h-8 text-[#3d5a4c] mb-3" />
            <h4 className="font-bold font-serif text-[#1a1a1a] mb-2 text-sm">Economic Instability</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Depleting near-shore fish stocks, volatile fuel prices, and highly exploitative middle-men rings leave traditional fishers vulnerable.
            </p>
          </div>
          <div className="bg-white p-6 rounded-none border border-[#1a1a1a]/15 transition-all">
            <Wind className="w-8 h-8 text-[#3d5a4c] mb-3" />
            <h4 className="font-bold font-serif text-[#1a1a1a] mb-2 text-sm">Climate Vulnerability</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Rapid sea-level rise, erratic cyclones, and extreme estuarine erosion displace thousands of coastal families every season.
            </p>
          </div>
          <div className="bg-white p-6 rounded-none border border-[#1a1a1a]/15 transition-all">
            <GraduationCap className="w-8 h-8 text-[#3d5a4c] mb-3" />
            <h4 className="font-bold font-serif text-[#1a1a1a] mb-2 text-sm">Limited School Access</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Formal education stops early as youths join traditional fishing boats, leaving first-generation students behind.
            </p>
          </div>
          <div className="bg-white p-6 rounded-none border border-[#1a1a1a]/15 transition-all">
            <Users className="w-8 h-8 text-[#3d5a4c] mb-3" />
            <h4 className="font-bold font-serif text-[#1a1a1a] mb-2 text-sm">Left Behind</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Women have little access to modern skills or independent credit, prompting young men to migrate to far-away cities.
            </p>
          </div>
          <div className="bg-white p-6 rounded-none border border-[#1a1a1a]/15 transition-all">
            <Waves className="w-8 h-8 text-[#3d5a4c] mb-3" />
            <h4 className="font-bold font-serif text-[#1a1a1a] mb-2 text-sm">Cultural Erosion</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Centuries-old fishing dialects, boatcraft lore, and maritime traditions fade rapidly as community structures fracture.
            </p>
          </div>
        </div>
      </section>

      {/* Our Approach Component */}
      <section className="bg-[#ebf0ec] rounded-none p-6 sm:p-10 border border-[#1a1a1a]/15 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-[#3d5a4c] font-mono text-xs uppercase tracking-wider font-bold">
            <Compass className="w-4 h-4" />
            <span>Co-Created, Community-Led</span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#1a1a1a] leading-tight">
            How We Address Local Complexity
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed">
            We don't parachute in with pre-assembled urban answers. We work inside village structures, building local trust over months before launching collaborative programs.
          </p>
          <div className="border-l-2 border-[#1a1a1a] pl-4 italic text-sm text-stone-800 bg-white/40 py-2.5">
            “We don't bring solutions from outside. We bring resources to the solutions that traditional coastal families already know.”
          </div>
        </div>
        <div className="md:col-span-7 grid gap-4">
          <div className="bg-white p-5 rounded-none border border-[#1a1a1a]/10 flex gap-4">
            <div className="w-10 h-10 rounded-none bg-[#ebf0ec] text-[#3d5a4c] flex items-center justify-center font-bold shrink-0">1</div>
            <div>
              <h4 className="font-bold text-[#1a1a1a] text-sm font-serif">Community Leadership Model</h4>
              <p className="text-xs text-stone-600 mt-0.5">Women leaders and high-school youth formulate and execute their own development pathways with our coordination.</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-none border border-[#1a1a1a]/10 flex gap-4">
            <div className="w-10 h-10 rounded-none bg-[#ebf0ec] text-[#3d5a4c] flex items-center justify-center font-bold shrink-0">2</div>
            <div>
              <h4 className="font-bold text-[#1a1a1a] text-sm font-serif">Holistic Coastal Framework</h4>
              <p className="text-xs text-stone-600 mt-0.5">Integrating study aid clusters, alternative trade skills, climate mangrove defenses, and medical checkups under a single continuous loop.</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-none border border-[#1a1a1a]/10 flex gap-4">
            <div className="w-10 h-10 rounded-none bg-[#ebf0ec] text-[#3d5a4c] flex items-center justify-center font-bold shrink-0">3</div>
            <div>
              <h4 className="font-bold text-[#1a1a1a] text-sm font-serif">Tangible Climate Adaptations</h4>
              <p className="text-xs text-stone-600 mt-0.5">Restoring natural buffer estuaries dynamically to guard homes, instead of simply advocating for carbon legislation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Living Proof & Field Operations Photogalleries CMS Section */}
      <section className="space-y-8 border-t border-b border-stone-200 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[#3d5a4c] font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Camera className="w-4 h-4" />
              <span>Living Proof Stream</span>
            </span>
            <h3 className="font-serif text-3xl font-extrabold text-[#1a1a1a]">
              Empirical Results & Live Field Photos
            </h3>
            <p className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              Live updates uploaded directly by trust operators, maritime coordinators, and student volunteers. Hover for precise field metadata.
            </p>
          </div>

          <div className="flex gap-2">
            {isAdminMode ? (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-[#3d5a4c] hover:bg-emerald-950 text-white font-mono text-xs uppercase tracking-wider py-2 px-4 rounded-none font-bold cursor-pointer transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddForm ? "Hide Form" : "Upload Field Proof (CMS)"}</span>
              </button>
            ) : (
              <div className="bg-[#ebf0ec] text-[#3d5a4c] font-mono text-[10px] uppercase font-bold px-3 py-1 border border-[#3d5a4c]/20">
                ✓ Live Connected to Firestore
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Admin CMS Upload Form */}
        {isAdminMode && showAddForm && (
          <form 
            onSubmit={handleCMSFormSubmit}
            className="bg-white p-6 border-2 border-stone-900 shadow-lg space-y-4 max-w-3xl animate-fadeIn"
          >
            <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
              <Sparkles className="w-5 h-5 text-[#3d5a4c]" />
              <h4 className="font-serif font-bold text-lg text-stone-900">CMS: Publish New Real Photo Proof Card</h4>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-stone-700 uppercase">Proof Card Title</label>
                <input
                  type="text"
                  placeholder="e.g. Estuary Mangrove Canopy 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#f9f7f2] border border-stone-300 font-sans text-xs px-3 py-2 rounded-none text-stone-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-stone-700 uppercase">Category Area</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#f9f7f2] border border-stone-300 font-sans text-xs px-3 py-2 rounded-none text-stone-900"
                >
                  <option value="Climate & Coast">Climate & Coast</option>
                  <option value="Education">Education</option>
                  <option value="Women’s Empowerment">Women's Empowerment</option>
                  <option value="Livelihoods">Livelihoods</option>
                  <option value="Health">Health</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold text-stone-700 uppercase">Photo Image URL</label>
              <input
                type="text"
                placeholder="Paste an image URL or click a Quick-Preset below"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#f9f7f2] border border-stone-300 font-mono text-xs px-3 py-2 rounded-none text-stone-900"
                required
              />
              <div className="pt-1.5 flex flex-wrap gap-2">
                <span className="text-[10px] text-stone-400 font-mono flex items-center">Click a Quick-Preset:</span>
                {presetImages.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="text-[10px] font-mono uppercase bg-stone-100 hover:bg-[#3d5a4c] hover:text-white px-2 py-0.5 border border-stone-200 transition-colors cursor-pointer select-none"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold text-stone-700 uppercase">Direct Impact Description (Field Testimony/Measurement)</label>
              <textarea
                placeholder="Provide a detailed, auditable account of this specific field photo and what it proves to donors."
                value={description}
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#f9f7f2] border border-stone-200 font-sans text-xs p-3 rounded-none text-stone-900"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-stone-700 uppercase">Field Officer Uploader Signature</label>
                <input
                  type="text"
                  placeholder="e.g. Ahmed Sajid, Direct Ops"
                  value={uploader}
                  onChange={(e) => setUploader(e.target.value)}
                  className="w-full bg-[#f9f7f2] border border-stone-300 font-sans text-xs px-3 py-2 rounded-none text-stone-900"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-black text-white text-xs font-mono uppercase tracking-wider py-2.5 rounded-none font-bold cursor-pointer select-none"
                >
                  ✓ Commit to Firestore Live
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Rich Proof Cards Layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {proofGallery.map((proof) => (
            <div 
              key={proof.id}
              className="bg-white rounded-none border border-stone-200 overflow-hidden flex flex-col justify-between hover:border-stone-900 transition-all shadow-xs group"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-stone-100 border-b border-stone-100">
                <img
                  src={proof.imageUrl}
                  alt={proof.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-stone-900 text-white text-[9px] font-mono font-bold uppercase py-0.5 px-2 rounded-none">
                  {proof.category}
                </span>
                {isAdminMode && (
                  <button
                    onClick={() => onDeleteProofPhoto(proof.id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-800 text-white p-1 rounded-none cursor-pointer border border-red-500 shadow-sm"
                    title="Delete Proof Card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-stone-900 text-base group-hover:text-[#3d5a4c] transition-colors">
                    {proof.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans italic">
                    "{proof.description}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono border-t border-stone-100 pt-3">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-[#3d5a4c]" />
                    <span>{proof.uploaderName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>{proof.uploadedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Focus Areas Dashboard */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-serif text-3xl font-bold text-[#1a1a1a]">
            Our 5 Focus Anchors
          </h3>
          <p className="text-xs text-stone-500 uppercase tracking-wider font-mono">
            Click into our dedicated operational circles to learn what we carry out.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {focusAreas.map((area) => (
            <div
              key={area.id}
              className="bg-white p-6 rounded-none border border-[#1a1a1a]/15 hover:border-[#1a1a1a] transition-all flex flex-col justify-between"
            >
              <div>
                {getFocusAreaIcon(area.id)}
                <h4 className="font-serif font-bold text-[#1a1a1a] text-sm mb-1">{area.title}</h4>
                <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#3d5a4c] mb-3">{area.tagline}</p>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">{area.description}</p>
              </div>
              <div className="bg-[#ebf0ec] p-3 rounded-none border-l-2 border-[#3d5a4c]">
                <p className="text-[10px] font-mono font-bold text-[#3d5a4c] uppercase">Accomplishment Status:</p>
                <p className="text-xs text-stone-800 font-medium mt-0.5">{area.accomplishments}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Growth Tracker Goals */}
      <section className="bg-white rounded-none p-6 sm:p-10 border border-[#1a1a1a]/15 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#3d5a4c] text-xs font-mono font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Auditable Growth Needs</span>
            </div>
            <h3 className="font-serif text-3xl font-bold text-[#1a1a1a]">
              Grassroots Expansion Targets: Year 1 & 2
            </h3>
            <p className="text-xs text-stone-500 max-w-xl">
              Our initial 8 years of local trust have set the stage. Help us realize these tracked objectives. Every rupee contributed shifts current tallies instantly!
            </p>
          </div>
          <div className="bg-[#f9f7f2] p-4 rounded-none border border-[#1a1a1a]/10 flex items-center gap-3 shrink-0">
            <div className="p-2 bg-[#3d5a4c]/10 text-[#3d5a4c]">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-stone-500 font-mono uppercase font-semibold">Trivandrum Presence</p>
              <p className="text-sm font-bold text-stone-800 font-serif">5 Villages Registered</p>
            </div>
          </div>
        </div>

        {/* Goals Progress Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {growthGoals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <div
                key={goal.id}
                className="bg-[#ebf0ec]/30 p-6 rounded-none border border-[#1a1a1a]/10 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="bg-[#1a1a1a] text-[#f9f7f2] text-[10px] font-mono font-bold px-2 py-0.5 uppercase">
                        {goal.timeline}
                      </span>
                      <h4 className="font-serif font-bold text-[#1a1a1a] text-lg mt-1.5">{goal.title}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-stone-500 font-mono uppercase">Budget Target</p>
                      <p className="font-serif font-black text-[#3d5a4c] text-lg">
                        ₹{(goal.targetAmount / 100000).toFixed(0)} Lakhs
                      </p>
                    </div>
                  </div>

                  {/* Progress bar visual */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-stone-700">Funding Progress</span>
                      <span className="text-[#3d5a4c] font-mono">{percentage}% Funded</span>
                    </div>
                    <div className="w-full bg-stone-200 h-3 rounded-none overflow-hidden border border-[#1a1a1a]/10">
                      <div
                        className="bg-[#3d5a4c] h-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-stone-500 font-mono">
                      <span>Received: ₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                      <span>Target: ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Objective list bulleted */}
                  <div className="space-y-2 pt-2 border-t border-dashed border-[#1a1a1a]/10">
                    <p className="text-xs font-bold text-stone-800 font-serif">Current Funding Milestones:</p>
                    <ul className="space-y-1.55">
                      {goal.objectives.map((obj, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-stone-600">
                          <Check className="w-3.5 h-3.5 text-[#3d5a4c] shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#1a1a1a]/10 flex flex-col gap-2">
                  <p className="text-[11px] text-stone-500 leading-relaxed italic">{goal.details}</p>
                  <button
                    id={`back-${goal.id}-btn`}
                    onClick={() => setActiveTab('donations')}
                    className="w-full mt-2 bg-[#1a1a1a] hover:bg-black text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-none select-none cursor-pointer transition-colors text-center border border-[#1a1a1a]"
                  >
                    Contribute Towards This Milestone
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Meet Team Members */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[#3d5a4c] text-xs font-mono font-bold uppercase tracking-widest border-b border-[#3d5a4c] pb-0.5">
            <Users className="w-4 h-4" />
            <span>Office Bearers</span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#1a1a1a]">
            Meet Our Leadership Team
          </h3>
          <p className="text-xs text-stone-500 uppercase tracking-wider font-mono">
            Social professionals dedicating their careers to coastal empowerment with complete integrity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-none overflow-hidden border border-[#1a1a1a]/15 hover:border-[#1a1a1a] transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                <div className="w-20 h-20 rounded-none mx-auto bg-[#ebf0ec] text-[#3d5a4c] flex items-center justify-center font-bold font-serif text-2xl border border-[#3d5a4c]">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-center space-y-1">
                  <h4 className="font-serif font-bold text-[#1a1a1a] text-base">{member.name}</h4>
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#3d5a4c] font-sans">{member.role}</p>
                </div>
                <p className="text-xs text-stone-600 text-center leading-relaxed">
                  {member.bio}
                </p>
              </div>
              <div className="bg-[#f9f7f2] p-3 text-center border-t border-[#1a1a1a]/10">
                <span className="text-[9px] font-mono font-bold text-stone-400 select-none uppercase tracking-widest">Verified Organizer</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Interactive FAQ Banner */}
      <section className="bg-[#1a1a1a] text-white rounded-none p-6 sm:p-10 border-t-4 border-[#3d5a4c] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h4 className="font-serif font-bold text-2xl text-[#f9f7f2] italic">Transparency & Section 135 Compliance</h4>
          <p className="text-sm text-stone-300 max-w-xl font-serif italic">
            Our Section 8 registration allows companies to partner for CSR grant requirements safely under standard Section 135, Companies Act 2013 rules. 100% of income is directed to coastal operations.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <a
            href="mailto:twothirdscommunityfoundation@gmail.com"
            className="bg-[#3d5a4c] hover:bg-[#2d4338] text-white border border-[#3d5a4c] px-5 py-2.5 text-xs text-center font-extrabold uppercase tracking-wider rounded-none select-none cursor-pointer"
          >
            Email CSR / Queries
          </a>
          <button
            id="faq-audit-btn"
            onClick={() => setActiveTab('donations')}
            className="bg-transparent hover:bg-white/10 text-white border border-white/40 px-5 py-2.5 text-xs text-center font-bold uppercase tracking-wider rounded-none cursor-pointer"
          >
            View Bank Details
          </button>
        </div>
      </section>

    </div>
  );
}
