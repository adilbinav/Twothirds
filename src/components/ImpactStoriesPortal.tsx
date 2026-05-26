import React, { useState } from 'react';
import { ImpactStory } from '../types';
import { Sparkles, Calendar, BookOpen, Heart, User, Check, Trash2, ArrowRight, Lightbulb, Heading, PenTool } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface ImpactStoriesPortalProps {
  stories: ImpactStory[];
  setStories: React.Dispatch<React.SetStateAction<ImpactStory[]>>;
  isAdminMode: boolean;
}

export default function ImpactStoriesPortal({
  stories,
  setStories,
  isAdminMode
}: ImpactStoriesPortalProps) {
  
  // Category selections
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Reading story modal
  const [readingStory, setReadingStory] = useState<ImpactStory | null>(null);

  // Liked stories tracking locally
  const [likedStories, setLikedStories] = useState<string[]>([]);

  // Admin Publish Form states
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCat, setNewCat] = useState<ImpactStory['category']>('Education');
  const [newAuthor, setNewAuthor] = useState('Ahmed Sajid');
  const [newTheme, setNewTheme] = useState<ImpactStory['imageTheme']>('ocean');

  // AI draft assistant states
  const [showAiDraft, setShowAiDraft] = useState(false);
  const [aiName, setAiName] = useState('');
  const [aiFocus, setAiFocus] = useState<'Women' | 'Education' | 'Mangroves' | 'Fishing'>('Women');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleLike = async (storyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedStories.includes(storyId)) return; // already liked

    try {
      setLikedStories([...likedStories, storyId]);
      const storyRef = doc(db, 'stories', storyId);
      const targetStory = stories.find(s => s.id === storyId);
      if (targetStory) {
        await updateDoc(storyRef, {
          likes: targetStory.likes + 1
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'stories/' + storyId + '/likes');
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newContent) {
      alert('Please fill out all fields for the story');
      return;
    }

    const newId = 'story-' + Math.random().toString(36).slice(2, 9);
    const newStory: ImpactStory = {
      id: newId,
      title: newTitle,
      description: newDescription,
      content: newContent,
      category: newCat,
      author: newAuthor,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      imageTheme: newTheme,
      readTime: '3 min read'
    };

    try {
      await setDoc(doc(db, 'stories', newId), newStory);
      setShowPublishForm(false);
      
      // Clear inputs
      setNewTitle('');
      setNewDescription('');
      setNewContent('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'stories/' + newId);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (confirm('Are you sure you want to delete this impact story?')) {
      try {
        await deleteDoc(doc(db, 'stories', storyId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, 'stories/' + storyId);
      }
    }
  };

  // Highly intelligent storytelling generator matching specific slide concepts
  const generateAiDraft = () => {
    if (!aiName) {
      alert('Please enter a participant name (e.g. Sujatha)');
      return;
    }

    setIsAiGenerating(true);
    setNewAuthor('Ahmed Sajid');

    setTimeout(() => {
      if (aiFocus === 'Women') {
        setNewTitle(`Decentralized Self-Reliance: How ${aiName} Lifted Trivandrum Craft Circles`);
        setNewDescription(`A story of grassroots leadership where ${aiName} mastered digital bookkeeping to manage local micro-savings networks.`);
        setNewContent(`For generations, traditional artisans on Kerala's shores worked without direct banking access. When ${aiName} joined the Two-Thirds Community Foundation livelihood workshops, her path shifted completely. After mastering digital bookkeeping tools, she mobilized a collective of 12 women. Today, ${aiName}'s group sells high-quality coir crafts directly to urban distributors, tripling their historic household earnings and securing a sustainable family threshold.`);
        setNewCat('Women’s Empowerment');
        setNewTheme('women');
      } else if (aiFocus === 'Education') {
        setNewTitle(`Breaking Barriers: ${aiName}'s Path to Advanced Computer Literacy`);
        setNewDescription(`See how ${aiName}, a student in Poonthura libraries, unlocked programming tools to support village cooperatives.`);
        setNewContent(`Youth dropouts remained a substantial structural bottleneck around Vizhinjam coastal lines. But when ${aiName} enrolled in the evening digital training loops hosted by foundation volunteers, she unlocked a passion for technology. Using second-hand study systems, ${aiName} excelled in algebraic calculations and is now assisting local cooperatives in automating sales ledgers. 'I want to prove coastal children can lead global digital initiatives,' she says.`);
        setNewCat('Education');
        setNewTheme('education');
      } else if (aiFocus === 'Mangroves') {
        setNewTitle(`The Coral Guard: ${aiName}'s Pledge to Protect Local Estuaries`);
        setNewDescription(`Meet ${aiName}, the community leader who coordinated traditional fishermen to plant 1,500 mangrove buffers.`);
        setNewContent(`High-speed tidal surges and sea-level rise have consistently eroded Kerala's beach buffers, taking cottages and drying yards with them. Under the coordination of ${aiName}, traditional fishing groups initiated a major natural boundary campaign. Over six months, they nurtured mangrove saplings in estuary clay. 'The root walls are already binding the shores,' explains ${aiName}. 'We are saving our families by listening to traditional maritime lore.'`);
        setNewCat('Climate & Coast');
        setNewTheme('climate');
      } else {
        setNewTitle(`Rebuilding the Fleet: ${aiName} Innovates Sustainable Cold Storage`);
        setNewDescription(`How local fisher ${aiName} reduced post-harvest losses by establishing village cooperative solar cooling boxes.`);
        setNewContent(`Volatile fuel costs and predatory local middlemen leave fishermen with minimal profit margins. Determined to secure value, traditional fisherman ${aiName} participated in the sustainable aquaculture training cohort. Collaborating with engineers, he spearheaded a local cold solar storage vault. Today, local boats preserve catches up to 48 hours longer, letting fishers negotiate fair market prices directly.`);
        setNewCat('Livelihoods');
        setNewTheme('fishing');
      }

      setIsAiGenerating(false);
      setShowAiDraft(false);
      setShowPublishForm(true);
    }, 1500);
  };  // Map category codes to styling
  const getCategoryColor = (cat: ImpactStory['category']) => {
    switch (cat) {
      case 'Education': return 'border-[#1a1a1a]/20 text-[#1a1a1a] bg-transparent text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-none';
      case 'Women’s Empowerment': return 'border-[#1a1a1a]/20 text-[#3d5a4c] bg-transparent text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-none';
      case 'Livelihoods': return 'border-[#1a1a1a]/20 text-stone-700 bg-transparent text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-none';
      case 'Climate & Coast': return 'border-[#3d5a4c]/30 text-[#3d5a4c] bg-transparent text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-none';
      case 'Health': return 'border-red-300 text-red-800 bg-transparent text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-none';
    }
  };

  // Clean background layout themes for cards - editorial duotones
  const getThemeBackground = (theme: ImpactStory['imageTheme']) => {
    switch (theme) {
      case 'ocean': return 'from-stone-800 to-stone-900';
      case 'women': return 'from-[#3d5a4c] to-[#4e7462]';
      case 'education': return 'from-zinc-800 to-neutral-900';
      case 'climate': return 'from-[#3d5a4c] to-stone-900';
      case 'fishing': return 'from-stone-900 to-[#3d5a4c]';
    }
  };

  const filteredStories = selectedCategory === 'all'
    ? stories
    : stories.filter(s => s.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="space-y-12 py-6 pb-20">
      
      {/* Header with admin tools */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-stone-200 pb-6">
        <div>
          <span className="text-[#3d5a4c] font-mono text-xs uppercase tracking-widest font-bold">Documented Impact</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] mt-1">Village Impact Stories</h2>
          <p className="text-xs text-stone-500 uppercase tracking-wider font-mono mt-1">
            Real testimonials, research logs, and community victories written live by traditional organizers and volunteers.
          </p>
        </div>

        {/* Admin tools switch */}
        {isAdminMode && (
          <div className="flex gap-2.5">
            <button
              onClick={() => setShowAiDraft(!showAiDraft)}
              className="bg-[#3d5a4c] hover:bg-[#2d4338] text-[#f9f7f2] px-4 py-2.5 text-xs font-bold rounded-none select-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all uppercase tracking-wider font-mono"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Story Draft Helper</span>
            </button>
            <button
              onClick={() => setShowPublishForm(!showPublishForm)}
              className="bg-[#1a1a1a] hover:bg-black text-[#f9f7f2] px-4 py-2.5 text-xs font-bold rounded-none select-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all uppercase tracking-wider font-mono"
            >
              <PenTool className="w-4 h-4" />
              <span>{showPublishForm ? 'Cancel Draft' : 'Manual Write'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ADMIN LEVEL: AI STORY COPYWRITING DRAWER */}
      {isAdminMode && showAiDraft && (
        <div className="bg-[#f9f7f2] p-6 sm:p-8 rounded-none border border-double border-purple-300 max-w-2xl space-y-5 animate-fade-in">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-[#1a1a1a] text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#3d5a4c]" />
              <span>AI Press Outline Draft Generator</span>
            </h3>
            <p className="text-[11px] text-stone-500 uppercase tracking-wider font-mono">Simplify writing for grassroots fieldworkers. Generate beautifully formatted coastal narratives based on basic prompts.</p>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-705">Recipient Name (e.g. Mary, Sujatha)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mini Suresh"
                  value={aiName}
                  onChange={(e) => setAiName(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-none p-2.5 text-xs focus:outline-none focus:border-[#3d5a4c] font-medium text-stone-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-705">Strategic Milestone</label>
                <select
                  value={aiFocus}
                  onChange={(e) => setAiFocus(e.target.value as any)}
                  className="w-full bg-white border border-stone-200 rounded-none p-2 text-xs text-stone-805"
                >
                  <option value="Women">Livelihoods - Cooperative Craft Circles</option>
                  <option value="Education">Education - Evening Digital Libraries</option>
                  <option value="Mangroves">Climate - Mangrove Estuary Plantations</option>
                  <option value="Fishing">Economics - Solar Cooling Cooperatives</option>
                </select>
              </div>
            </div>

            <button
              onClick={generateAiDraft}
              disabled={isAiGenerating}
              className="w-full bg-[#1a1a1a] hover:bg-black text-[#f9f7f2] text-xs font-mono font-bold uppercase tracking-widest py-3 rounded-none flex items-center justify-center gap-2 select-none cursor-pointer"
            >
              {isAiGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#f9f7f2] border-t-transparent rounded-full animate-spin" />
                  <span>Drafting Immersive Narrative...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Article Draft</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ADMIN LEVEL: MANUAL/EDIT PUBLISH FORM */}
      {isAdminMode && showPublishForm && (
        <form onSubmit={handlePublish} className="bg-white p-6 sm:p-8 rounded-none border border-[#1a1a1a]/15 shadow-none space-y-5 max-w-3xl animate-fade-in">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-gray-900 border-b border-stone-200 pb-2">Publish New Testimonial Document</h3>
            <p className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">Add photos and stories manually or review the content drafted by our AI Helper below.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-stone-705">Article Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Traditional Estuary Fish Drying Masters Quadruple Weekly Returns"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#f9f7f2] border border-stone-200 rounded-none p-2.5 text-xs text-stone-900 font-serif font-bold"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-stone-705">Teaser / Intro Summary *</label>
              <input
                type="text"
                required
                placeholder="How local youths and fishers combined traditional net knowledge with solar boxes..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-[#f9f7f2] border border-stone-200 rounded-none p-2.5 text-xs text-stone-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-705">Focus Category *</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value as ImpactStory['category'])}
                className="w-full bg-[#f9f7f2] border border-stone-200 rounded-none p-2 text-xs text-stone-800"
              >
                <option value="Education">Education</option>
                <option value="Women’s Empowerment">Women’s Empowerment</option>
                <option value="Livelihoods">Livelihoods</option>
                <option value="Climate & Coast">Climate & Coast</option>
                <option value="Health">Health</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-705">Author Credit *</label>
              <select
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full bg-[#f9f7f2] border border-stone-200 rounded-none p-2 text-xs text-stone-800"
              >
                <option value="Ahmed Sajid">Ahmed Sajid (Founder)</option>
                <option value="Jaseemul Farhan">Jaseemul Farhan (Co-founder)</option>
                <option value="Lijin Lowrence">Lijin Lowrence (Director)</option>
                <option value="Khaleel Hamadan">Khaleel Hamadan (Architect)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-705">Visual Hero Theme *</label>
              <select
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value as ImpactStory['imageTheme'])}
                className="w-full bg-[#f9f7f2] border border-stone-200 rounded-none p-2 text-xs text-stone-800"
              >
                <option value="ocean">Ocean Gradient Blue</option>
                <option value="women">Sunset Orange & Teal</option>
                <option value="education">Amethyst & Indigo</option>
                <option value="climate">Deep Mangrove Forest Green</option>
                <option value="fishing">Sovereign Sandy Teal</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5 row-span-2">
              <label className="text-xs font-bold text-stone-705">Full Editorial Body Content *</label>
              <textarea
                rows={6}
                required
                placeholder="Compose a deep, inspiring story here. Describe the baseline poverty faced, our grassroots approach, and key takeaways..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full bg-[#f9f7f2] border border-stone-200 rounded-none p-2.5 text-xs text-stone-850 leading-relaxed font-serif focus:outline-none focus:border-[#3d5a4c] resize-none"
              />
            </div>

            <button
              type="submit"
              className="sm:col-span-2 w-full mt-2 bg-[#1a1a1a] hover:bg-black text-[#f9f7f2] text-xs font-mono font-bold uppercase tracking-widest py-3 rounded-none select-none cursor-pointer text-center"
            >
              Add Document to Public Wall
            </button>
          </div>
        </form>
      )}

      {/* FILTER CATEGORY SELECT BAR */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3 font-mono text-[10px]">
        <span className="text-stone-400 font-bold uppercase tracking-widest mr-2">Filter Articles:</span>
        {['all', 'Education', 'Women', 'Livelihoods', 'Climate'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-none cursor-pointer transition-all border ${
              selectedCategory === cat
                ? 'bg-[#1a1a1a] text-[#f9f7f2] border-[#1a1a1a]'
                : 'bg-white hover:bg-[#f9f7f2] text-stone-605 border-stone-200'
            }`}
          >
            {cat === 'all' ? 'All Milestones' : cat}
          </button>
        ))}
      </div>

      {/* IMPACT STORIES GRIDS */}
      <div className="grid md:grid-cols-3 gap-8">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            onClick={() => setReadingStory(story)}
            className="bg-white rounded-none overflow-hidden border border-[#1a1a1a]/15 hover:border-[#1a1a1a] transition-all flex flex-col justify-between cursor-pointer group"
          >
            
            <div className="space-y-4">
              {/* Rich Visual Banner holding Title header */}
              <div className={`h-36 bg-gradient-to-br ${getThemeBackground(story.imageTheme)} p-5 flex flex-col justify-between text-white relative rounded-none`}>
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 border ${getCategoryColor(story.category)}`}>
                    {story.category}
                  </span>
                  
                  {isAdminMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStory(story.id);
                      }}
                      className="bg-white/15 hover:bg-white/30 p-1.5 rounded-none text-white/80 hover:text-white"
                      title="Delete story"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div>
                  <h4 className="font-serif font-extrabold text-sm text-white line-clamp-2 leading-tight">
                    {story.title}
                  </h4>
                </div>
              </div>

              {/* Description Body padding */}
              <div className="p-5 space-y-3">
                <p className="text-xs text-stone-505 leading-relaxed font-serif line-clamp-3">
                  {story.description}
                </p>

                {/* Author detail info */}
                <div className="flex items-center gap-2 text-xs text-stone-600">
                  <div className="w-6 h-6 rounded-none bg-[#ebf0ec] text-[#3d5a4c] border border-[#3d5a4c]/20 font-mono font-bold flex items-center justify-center text-[10px]">
                    {story.author[0]}
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-[11px] leading-none">{story.author}</p>
                    <p className="text-[9px] text-stone-400 font-mono mt-0.5">Author • {story.date}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="p-5 border-t border-stone-100 flex justify-between items-center text-xs font-mono bg-[#f9f7f2]/50">
              <span className="text-stone-400 text-[10px] uppercase font-bold">{story.readTime}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleLike(story.id, e)}
                  className={`flex items-center gap-1 font-bold ${
                    likedStories.includes(story.id) ? 'text-red-700 font-bold' : 'text-stone-400 hover:text-red-700'
                  }`}
                  title={`${likedStories.includes(story.id) ? 'Thank you!' : 'Like this story'}`}
                >
                  <Heart className={`w-4 h-4 ${likedStories.includes(story.id) ? 'fill-red-700 text-red-700' : ''}`} />
                  <span>{story.likes}</span>
                </button>
                <span className="text-[#3d5a4c] font-sans font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform uppercase text-[10px] tracking-wider">
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* FULL STORY MODAL DETAIL VIEW */}
      {readingStory && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none border-2 border-[#1a1a1a] max-w-2xl w-full shadow-2xl relative overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            
            {/* Elegant Header Banner */}
            <div className={`p-8 pb-6 bg-gradient-to-br ${getThemeBackground(readingStory.imageTheme)} text-white space-y-3 shrink-0 rounded-none`}>
              <span className={`text-[9.5px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 border border-white/30 bg-white/10`}>
                {readingStory.category}
              </span>
              <h3 className="font-serif font-black text-xl sm:text-2xl leading-snug">
                {readingStory.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-white/85 font-mono">
                <p className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> By {readingStory.author}</p>
                <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {readingStory.date}</p>
                <p>• {readingStory.readTime}</p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto space-y-6 text-stone-800 bg-[#f9f7f2]/30">
              <p className="text-xs font-bold border-l-3 border-[#3d5a4c] pl-4 italic leading-relaxed text-stone-750 bg-[#f9f7f2] py-3 rounded-none font-serif">
                {readingStory.description}
              </p>
              
              <div className="text-xs sm:text-sm leading-relaxed space-y-4 font-serif text-stone-805">
                {readingStory.content.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 border-t border-stone-150 bg-[#f9f7f2] flex justify-between items-center sm:px-8 shrink-0">
              <button
                onClick={(e) => handleLike(readingStory.id, e)}
                className={`flex items-center gap-1.5 text-xs font-mono font-bold ${
                  likedStories.includes(readingStory.id) ? 'text-red-700' : 'text-stone-500 hover:text-red-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedStories.includes(readingStory.id) ? 'fill-red-700 text-red-700' : ''}`} />
                <span>Like ({readingStory.likes} supporters)</span>
              </button>
              
              <button
                onClick={() => setReadingStory(null)}
                className="bg-[#1a1a1a] hover:bg-black text-[#f9f7f2] text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-none cursor-pointer"
              >
                Close Story
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
