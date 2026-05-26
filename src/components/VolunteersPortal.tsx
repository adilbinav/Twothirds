import React, { useState } from 'react';
import { VolunteerOpportunity, VolunteerApplication } from '../types';
import { initialOpportunities } from '../data';
import { Sparkles, Calendar, MapPin, Search, Check, X, ShieldAlert, PlusCircle, Inbox, User, Phone, Mail, Award, ThumbsUp, Trash2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, updateDoc, deleteDoc, writeBatch, collection, query, where, getDocs } from 'firebase/firestore';

interface VolunteersPortalProps {
  opportunities: VolunteerOpportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<VolunteerOpportunity[]>>;
  applications: VolunteerApplication[];
  setApplications: React.Dispatch<React.SetStateAction<VolunteerApplication[]>>;
  isAdminMode: boolean;
}

export default function VolunteersPortal({
  opportunities,
  setOpportunities,
  applications,
  setApplications,
  isAdminMode
}: VolunteersPortalProps) {
  
  // Selection filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFocus, setFilterFocus] = useState<string>('all');

  // Application Drawer/Modal controls
  const [applyingFor, setApplyingFor] = useState<VolunteerOpportunity | null>(null);
  
  // Respective Applicant Form states
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantSkills, setApplicantSkills] = useState('');
  const [applicantComments, setApplicantComments] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Administrator Form states (creating new listing)
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFocus, setNewFocus] = useState<VolunteerOpportunity['focusArea']>('Education & Youth');
  const [newLocation, setNewLocation] = useState('');
  const [newRequirements, setNewRequirements] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newSpots, setNewSpots] = useState<number>(10);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Handle volunteer submission
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingFor) return;

    const appId = 'app-' + Math.random().toString(36).slice(2, 9);
    const newApp: VolunteerApplication = {
      id: appId,
      opportunityId: applyingFor.id,
      opportunityTitle: applyingFor.title,
      applicantName,
      applicantEmail,
      applicantPhone,
      skills: applicantSkills,
      comments: applicantComments,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    try {
      // 1. Save application document
      await setDoc(doc(db, 'applications', appId), newApp);

      // 2. Increment applies count atomically
      const oppRef = doc(db, 'opportunities', applyingFor.id);
      await updateDoc(oppRef, {
        appliesCount: (applyingFor.appliesCount || 0) + 1
      });

      setIsSubmitSuccess(true);
      setTimeout(() => {
        setApplyingFor(null);
        setIsSubmitSuccess(false);
        setApplicantName('');
        setApplicantEmail('');
        setApplicantPhone('');
        setApplicantSkills('');
        setApplicantComments('');
      }, 2500);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'applications/' + appId);
    }
  };

  // Handle administrator creating a new opportunity
  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newLocation || !newDuration) {
      alert('Please fill out all fields for the posting');
      return;
    }

    const reqList = newRequirements
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const oppId = 'opp-' + Math.random().toString(36).slice(2, 9);
    const newOpp: VolunteerOpportunity = {
      id: oppId,
      title: newTitle,
      description: newDescription,
      focusArea: newFocus,
      location: newLocation,
      requirements: reqList.length ? reqList : ['Eager to learn from traditional fishermen', 'High commitment'],
      duration: newDuration,
      spotsAvailable: newSpots,
      status: 'active',
      appliesCount: 0,
      postedDate: new Date().toISOString().split('T')[0]
    };

    try {
      await setDoc(doc(db, 'opportunities', oppId), newOpp);
      setShowCreateForm(false);
      
      // Clear inputs
      setNewTitle('');
      setNewDescription('');
      setNewLocation('');
      setNewRequirements('');
      setNewDuration('');
      setNewSpots(10);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'opportunities/' + oppId);
    }
  };

  // Admin approves/rejects application
  const handleUpdateStatus = async (appId: string, flag: 'approved' | 'rejected') => {
    try {
      const activeApp = applications.find(a => a.id === appId);
      if (!activeApp) return;

      // Update basic status in Firestore
      await updateDoc(doc(db, 'applications', appId), { status: flag });

      // Adjust spots available if approved
      if (flag === 'approved' && activeApp.status !== 'approved') {
        const targetOpp = opportunities.find(o => o.id === activeApp.opportunityId);
        if (targetOpp) {
          const newSpots = Math.max(0, targetOpp.spotsAvailable - 1);
          await updateDoc(doc(db, 'opportunities', activeApp.opportunityId), {
            spotsAvailable: newSpots
          });
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'applications/' + appId + '/status');
    }
  };

  // Admin deletes opportunity posting and related applications
  const handleDeleteOpportunity = async (oppId: string) => {
    if (confirm('Are you sure you want to delete this volunteer opportunity and all accompanying applications?')) {
      try {
        // 1. Delete opportunity
        await deleteDoc(doc(db, 'opportunities', oppId));

        // 2. Query and delete corresponding applications to keep firestore tidy
        const q = query(collection(db, 'applications'), where('opportunityId', '==', oppId));
        const appSnap = await getDocs(q);
        const batch = writeBatch(db);
        appSnap.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, 'opportunities/' + oppId);
      }
    }
  };

  const filteredOpps = opportunities.filter((o) => {
    const matchesQuery = o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         o.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFocus = filterFocus === 'all' || o.focusArea === filterFocus;
    return matchesQuery && matchesFocus;
  });

  return (
    <div className="space-y-12 py-6 pb-20">
      
      {/* Intro Context banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-stone-200 pb-6">
        <div>
          <span className="text-[#3d5a4c] font-mono text-xs uppercase tracking-widest font-bold">Grassroots Mobilization</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] mt-1">Actively Seek Engagement</h2>
          <p className="text-xs text-stone-500 uppercase tracking-wider font-mono mt-1">
            Build sustainable livelihoods, assist study hubs, and plant mangroves alongside traditional coastal families.
          </p>
        </div>
        
        {/* Creation button for admin */}
        {isAdminMode && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#1a1a1a] hover:bg-black text-[#f9f7f2] px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none select-none cursor-pointer flex items-center gap-2 transition-all shadow-sm"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            <span>{showCreateForm ? 'Cancel Creation' : 'Post New Position'}</span>
          </button>
        )}
      </div>

      {/* ADMIN LEVEL: CREATE NEW OPPORTUNITY DRAWER FORM */}
      {isAdminMode && showCreateForm && (
        <div className="bg-[#f9f7f2] p-6 sm:p-8 rounded-none border-2 border-double border-[#1a1a1a]/40 space-y-6 max-w-3xl animate-fade-in">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-[#1a1a1a]">Post New Public Volunteer Opening</h3>
            <p className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">Draft real opportunities tied directly underneath our 5 focus pillars.</p>
          </div>

          <form onSubmit={handleCreateOpportunity} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-stone-750">Project / Opportunity Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Traditional Nets Repair Instructor Assistance"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-none p-2.5 text-xs focus:outline-none focus:border-[#3d5a4c]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-stone-750">Position Summary & Scope *</label>
              <textarea
                rows={3}
                required
                placeholder="Write an inviting, thorough description for potential regional high-school students or urban volunteers..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-none p-2.5 text-xs focus:outline-none focus:border-[#3d5a4c] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-750">Focus Anchor Pillar *</label>
              <select
                value={newFocus}
                onChange={(e) => setNewFocus(e.target.value as VolunteerOpportunity['focusArea'])}
                className="w-full bg-white border border-stone-200 rounded-none p-2 text-xs focus:outline-none text-stone-850"
              >
                <option value="Education & Youth" className="text-gray-855">Education & Youth</option>
                <option value="Women’s Empowerment" className="text-gray-855">Women’s Empowerment</option>
                <option value="Sustainable Livelihoods" className="text-gray-855">Sustainable Livelihoods</option>
                <option value="Climate & Environment" className="text-gray-855">Climate & Environment</option>
                <option value="Health & Nutrition" className="text-gray-855">Health & Nutrition</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-750">Specific Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Poonthura Village Centre, Kerala"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-none p-2.5 text-xs focus:outline-none focus:border-[#3d5a4c]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-750">Commited Duration *</label>
              <input
                type="text"
                required
                placeholder="e.g. Saturdays for 6 weeks"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-none p-2.5 text-xs focus:outline-none focus:border-[#3d5a4c]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-750">Spots Available to Fill *</label>
              <input
                type="number"
                required
                min={1}
                value={newSpots}
                onChange={(e) => setNewSpots(parseInt(e.target.value) || 5)}
                className="w-full bg-white border border-stone-200 rounded-none p-2 text-xs focus:outline-none focus:border-[#3d5a4c]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-stone-750">Requirements & Prerequisites (One per line)</label>
              <textarea
                rows={3}
                placeholder="Malayalam speaker (highly preferred)&#10;Comfortable working in hot coastal weather&#10;Prior digital bookkeeping or sheet entry basics"
                value={newRequirements}
                onChange={(e) => setNewRequirements(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-none p-2.5 text-xs focus:outline-none focus:border-[#3d5a4c] resize-none"
              />
            </div>

            <button
              type="submit"
              className="sm:col-span-2 w-full mt-2 bg-[#1a1a1a] hover:bg-black text-[#f9f7f2] text-xs font-mono uppercase tracking-widest py-3 rounded-none select-none cursor-pointer text-center font-bold"
            >
              Issue Public Job Listing
            </button>
          </form>
        </div>
      )}

      {/* FILTER & SEARCH STRAP FOR EVERYONE */}
      <div className="bg-white p-4 rounded-none border border-[#1a1a1a]/15 shadow-none flex flex-col md:flex-row gap-4 items-center justify-between animate-fade-in">
        
        {/* Search */}
        <div className="flex items-center gap-2 bg-[#f9f7f2] rounded-none p-2 border border-stone-200 w-full md:max-w-md">
          <Search className="w-4 h-4 text-stone-400 font-bold" />
          <input
            type="text"
            placeholder="Search by role title, location, duration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none text-stone-800 w-full"
          />
        </div>

        {/* Focus Pillar filter */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
          <span className="text-xs text-stone-500 font-bold font-sans">Focus Pillar:</span>
          <select
            value={filterFocus}
            onChange={(e) => setFilterFocus(e.target.value)}
            className="bg-[#f9f7f2] border border-stone-200 rounded-none p-1.5 text-xs focus:outline-none text-stone-850 font-medium"
          >
            <option value="all">All Anchors</option>
            <option value="Education & Youth">Education & Youth</option>
            <option value="Women’s Empowerment">Women’s Empowerment</option>
            <option value="Sustainable Livelihoods">Sustainable Livelihoods</option>
            <option value="Climate & Environment">Climate & Environment</option>
            <option value="Health & Nutrition">Health & Nutrition</option>
          </select>
        </div>

      </div>

      {/* ADMIN CONTROL DECK: LIVE INCOMING APPLICATIONS LIST */}
      {isAdminMode && (
        <div className="bg-white rounded-none border-t-4 border-[#3d5a4c] border-x border-b border-[#1a1a1a]/15 p-6 space-y-4 shadow-sm">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#3d5a4c]" />
              <span>Incoming Volunteer Applications Registry</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">Review registrations, read profile skills, and manage direct candidate statuses.</p>
          </div>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div key={app.id} className="p-4 bg-[#f9f7f2]/50 rounded-none border border-stone-200 relative space-y-3">
                  
                  {/* Title and Status section */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-stone-100 pb-2">
                    <div>
                      <span className="text-[10px] bg-[#ebf0ec] text-[#3d5a4c] font-mono font-bold px-2 py-0.5 rounded-none uppercase">
                        For Position: {app.opportunityTitle}
                      </span>
                      <h4 className="font-serif font-bold text-stone-900 text-sm mt-1">{app.applicantName}</h4>
                    </div>
                    <div>
                      <span className={`inline-block text-[10px] font-mono font-bold px-2 py-1 rounded-none uppercase ${
                        app.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Contact grid */}
                  <div className="grid sm:grid-cols-3 gap-2 text-xs font-mono text-stone-605">
                    <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-stone-450" /> {app.applicantEmail}</p>
                    <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-stone-450" /> {app.applicantPhone}</p>
                    <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-stone-450" /> Applied: {app.appliedAt}</p>
                  </div>

                  {/* Experience notes */}
                  <div className="bg-white p-3 rounded-none border border-stone-200 text-xs text-stone-700 space-y-1">
                    <p className="font-bold text-stone-800">Skills, Trades & Prerequisites:</p>
                    <p className="leading-relaxed italic font-serif">“{app.skills}”</p>
                    {app.comments && (
                      <p className="leading-relaxed text-stone-500 pt-1.5 border-t border-dashed border-stone-100 font-serif">
                        <span className="font-bold text-stone-600 font-sans not-italic text-[11px] uppercase tracking-wider block">Motivation Letter:</span> {app.comments}
                      </p>
                    )}
                  </div>

                  {/* Actions buttons */}
                  {app.status === 'pending' && (
                    <div className="flex justify-end gap-2.5 pt-1">
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'rejected')}
                        className="bg-transparent hover:bg-stone-100 text-red-750 border border-red-300 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none select-none cursor-pointer flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline Candidate</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'approved')}
                        className="bg-[#3d5a4c] hover:bg-[#2d4338] text-white border border-[#3d5a4c] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none select-none cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Applicant</span>
                      </button>
                    </div>
                  )}

                  {app.status !== 'pending' && (
                    <p className="text-right text-[10px] text-stone-400 font-mono">
                      Decided & locked. Notification simulated to {app.applicantEmail}.
                    </p>
                  )}

                </div>
              ))
            ) : (
              <p className="text-center text-xs text-stone-400 py-8">No volunteer applications logged in workspace.</p>
            )}
          </div>
        </div>
      )}

      {/* CORE ACTIVE OPENINGS GRID */}
      <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
        {filteredOpps.length > 0 ? (
          filteredOpps.map((opp) => (
            <div
              key={opp.id}
              className="bg-white p-6 rounded-none border border-[#1a1a1a]/15 hover:border-[#1a1a1a] transition-all flex flex-col justify-between"
            >
              
              {/* Category, Status & Edit details */}
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="border border-[#1a1a1a]/15 text-[#3d5a4c] text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-none bg-[#ebf0ec]/40">
                    {opp.focusArea}
                  </span>
                  
                  <div className="flex items-center gap-2 font-mono">
                    <span className="bg-[#f9f7f2] border border-stone-200 text-stone-700 text-[9px] font-bold px-2 py-0.5 rounded-none select-none">
                      {opp.spotsAvailable} Slots Remain
                    </span>
                    {isAdminMode && (
                      <button
                        onClick={() => handleDeleteOpportunity(opp.id)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Delete slot posting"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="font-serif font-extrabold text-[#1a1a1a] text-lg leading-snug">
                  {opp.title}
                </h3>
                <p className="text-xs text-stone-605 leading-relaxed font-serif">
                  {opp.description}
                </p>

                {/* Scope details and duration */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-stone-607 bg-[#f9f7f2] p-3 rounded-none border border-stone-200">
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" /> {opp.location}</p>
                  <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" /> {opp.duration}</p>
                </div>

                {/* Specific bullets requirements */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider block border-l-2 border-[#1a1a1a] pl-2">Prerequisites Check:</span>
                  <ul className="space-y-1 pl-1 font-serif">
                    {opp.requirements.map((req, rid) => (
                      <li key={rid} className="text-xs text-stone-600 flex items-start gap-2">
                        <span className="text-[#3d5a4c] font-bold shrink-0">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Apply button */}
              <div className="pt-6 border-t border-dashed border-stone-200 mt-6 flex justify-between items-center bg-white">
                <span className="text-[10px] font-mono font-medium text-stone-400">
                  Total applied: {opp.appliesCount} candidates
                </span>
                <button
                  id={`apply-${opp.id}-btn`}
                  onClick={() => setApplyingFor(opp)}
                  className="bg-[#1a1a1a] hover:bg-black text-[#f9f7f2] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-none select-none cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply Now</span>
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="md:col-span-2 text-center py-12 bg-white rounded-none border border-stone-200">
            <ShieldAlert className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-stone-500 text-xs font-mono uppercase">No active slots match search fields.</p>
          </div>
        )}
      </div>

      {/* MODAL DRAWER OVERLAY FOR APPLYING */}
      {applyingFor && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-none border-2 border-[#1a1a1a] p-6 sm:p-8 max-w-xl w-full shadow-2xl relative animate-fade-in space-y-6">
            
            <button
              onClick={() => setApplyingFor(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 bg-white border border-stone-200 p-1.5 rounded-none cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 bg-[#ebf0ec] text-[#3d5a4c] flex items-center justify-center mx-auto rounded-none border border-[#3d5a4c]/20">
                  <ThumbsUp className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-lg text-stone-900">Application Submitted!</h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed font-serif">
                  Thank you {applicantName}. Your application has been registered locally. Under "Staff Portal", administrators can view and process your submission instantly.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Header info */}
                <div className="border-b border-stone-200 pb-3">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#3d5a4c] font-bold">Volunteer Registration</span>
                  <h3 className="font-serif font-extrabold text-lg text-[#1a1a1a] leading-tight mt-0.5 animate-fade-in">
                    {applyingFor.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono mt-1">Location: {applyingFor.location} | Commited Time: {applyingFor.duration}</p>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sreekumari Pillai"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full bg-[#f9f7f2] border border-stone-200 rounded-none p-2 text-xs focus:outline-none focus:border-[#3d5a4c] text-stone-800 font-medium"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-stone-400" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="sree@gmail.com"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full bg-[#f9f7f2] border border-stone-200 rounded-none p-2 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>Phone Number *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 9447..."
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full bg-[#f9f7f2] border border-stone-200 rounded-none p-2 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-stone-400" />
                      <span>Your Skills, Occupations, and Background Check *</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Traditional fisherwoman, expert in UPI and bank passbooks. High social motivation."
                      value={applicantSkills}
                      onChange={(e) => setApplicantSkills(e.target.value)}
                      className="w-full bg-[#f9f7f2] border border-stone-200 rounded-none p-2 text-xs resize-none text-stone-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Motivation / Message to Team (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="I wish to help bridge the financial divide so our local SHG women can lead self-reliant networks."
                      value={applicantComments}
                      onChange={(e) => setApplicantComments(e.target.value)}
                      className="w-full bg-[#f9f7f2] border border-stone-200 rounded-none p-2 text-xs resize-none text-stone-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 bg-[#1a1a1a] hover:bg-black text-[#f9f7f2] text-xs font-mono uppercase tracking-widest py-3 rounded-none font-bold select-none cursor-pointer"
                  >
                    Send Direct Application to Staff
                  </button>

                </form>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
