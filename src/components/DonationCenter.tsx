import React, { useState } from 'react';
import { Donation, GrowthGoal } from '../types';
import { Banknote, ShieldCheck, Heart, Copy, Check, QrCode, Sparkles, Award, Calendar, Download, Search, Info } from 'lucide-react';

interface DonationCenterProps {
  growthGoals: GrowthGoal[];
  donations: Donation[];
  onAddDonation: (donation: Donation) => void;
}

export default function DonationCenter({ growthGoals, donations, onAddDonation }: DonationCenterProps) {
  // Navigation tabs for the donation center
  const [donateMethod, setDonateMethod] = useState<'gateway' | 'bank'>('gateway');

  // Form states
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState('goal-y1');
  const [message, setMessage] = useState('');

  // Checkout Simulation States
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [processingStatus, setProcessingStatus] = useState('');
  const [newCertificateCode, setNewCertificateCode] = useState('');
  const [latestDonation, setLatestDonation] = useState<Donation | null>(null);

  // Copy bank details safety states
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Search/Filter for donation log
  const [searchQuery, setSearchQuery] = useState('');

  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handlePresetSelect = (val: number) => {
    setIsCustom(false);
    setAmount(val);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustom(true);
    setCustomAmount(e.target.value);
    const parsed = parseInt(e.target.value, 10);
    setAmount(isNaN(parsed) ? 0 : parsed);
  };

  const handleSubmitMockPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCustom && amount <= 0) return alert('Please choose a donation amount');
    if (isCustom && (isNaN(amount) || amount <= 0)) {
      alert('Please enter a valid donation amount above zero');
      return;
    }
    if (!email) return alert('Email is required for receipt generation');

    // Initiate multi-step payment simulator
    setCheckoutStep('processing');
    setProcessingStatus('Securing checkout handshakes...');

    setTimeout(() => {
      setProcessingStatus('Validating routing with Federal Bank nodes...');
      setTimeout(() => {
         setProcessingStatus('Authorizing mock tax-exempt 80G credits...');
        setTimeout(() => {
          const uId = 'don-' + Math.random().toString(36).slice(2, 9);
          const certCode = 'cert-' + Math.floor(100000 + Math.random() * 900000);
          
          const newDon: Donation = {
            id: uId,
            donorName: isAnonymous ? 'Anonymous' : (donorName || 'Anonymous Supporter'),
            email,
            amount,
            date: new Date().toISOString().split('T')[0],
            campaignId: selectedCampaign,
            isAnonymous,
            message: message.trim() || undefined,
            certificateCode: certCode
          };

          // Update parent state
          onAddDonation(newDon);
          setLatestDonation(newDon);
          setNewCertificateCode(certCode);
          setCheckoutStep('success');
          
          // Clear inputs
          setDonorName('');
          setEmail('');
          setMessage('');
          setCustomAmount('');
          setIsCustom(false);
          setAmount(5000);
          setIsAnonymous(false);
        }, 1200);
      }, 1200);
    }, 1000);
  };

  const filteredDonations = donations.filter(don => {
    if (!searchQuery) return true;
    const nameMatch = don.donorName.toLowerCase().includes(searchQuery.toLowerCase());
    const msgMatch = don.message?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return nameMatch || msgMatch;
  });

  return (
    <div className="space-y-12 py-6 pb-20">
      
      {/* Intro Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="bg-[#3d5a4c] text-white text-[10px] font-mono font-bold px-3 py-1 uppercase tracking-widest border border-[#1a1a1a]/10">
          Grassroots Transparency
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
          Fund Our Vision For Malayalam Coasts
        </h2>
        <p className="text-xs text-stone-500 uppercase tracking-wider font-mono">
          100% of your resources proceed directly toward education studies, women's self-help loans, and estuary mangrove setups. All donations are simulated safely inside this app, updating our live targets instantly!
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Core Interactions Panel (Left/Center) */}
        <div className="lg:col-span-8 bg-white rounded-none border border-[#1a1a1a]/15 overflow-hidden">
          
          {/* Action Tabs for donating */}
          <div className="flex border-b border-stone-200">
            <button
              onClick={() => setDonateMethod('gateway')}
              className={`flex-1 py-4 text-center text-xs uppercase tracking-wider font-bold select-none cursor-pointer transition-colors flex items-center justify-center gap-2 rounded-none border-b-2 ${
                donateMethod === 'gateway'
                  ? 'border-[#1a1a1a] text-[#1a1a1a] bg-[#ebf0ec]/30'
                  : 'border-transparent text-stone-500 hover:text-[#1a1a1a] bg-stone-50/50'
              }`}
            >
              <Banknote className="w-4 h-4 text-[#3d5a4c]" />
              <span>Simulated Payment Portal</span>
            </button>
            <button
              onClick={() => setDonateMethod('bank')}
              className={`flex-1 py-4 text-center text-xs uppercase tracking-wider font-bold select-none cursor-pointer transition-colors flex items-center justify-center gap-2 rounded-none border-b-2 ${
                donateMethod === 'bank'
                  ? 'border-[#1a1a1a] text-[#1a1a1a] bg-[#ebf0ec]/30'
                  : 'border-transparent text-stone-500 hover:text-[#1a1a1a] bg-stone-50/50'
              }`}
            >
              <QrCode className="w-4 h-4 text-[#3d5a4c]" />
              <span>Federal Bank & UPI Credentials</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* METHOD 1: GATEWAY SELECT */}
            {donateMethod === 'gateway' && (
              <div>
                {checkoutStep === 'idle' && (
                  <form onSubmit={handleSubmitMockPay} className="space-y-6">
                    
                    {/* Amount selector grids */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold font-serif text-[#1a1a1a]">
                        Select Donation Amount in Indian Rupees (₹)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[1000, 5000, 10000, 25000].map((val) => (
                          <button
                            type="button"
                            key={val}
                            onClick={() => handlePresetSelect(val)}
                            className={`py-3 rounded-none border font-mono font-bold text-sm text-center select-none cursor-pointer transition-all ${
                              !isCustom && amount === val
                                ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white shadow'
                                : 'bg-[#f9f7f2]/50 border-stone-200 text-stone-700 hover:bg-[#f9f7f2]'
                            }`}
                          >
                            ₹{val.toLocaleString('en-IN')}
                          </button>
                        ))}
                      </div>

                      {/* Custom Input */}
                      <div className="flex items-center gap-2 bg-[#f9f7f2]/50 rounded-none p-3 border border-stone-200">
                        <span className="font-mono text-stone-400 font-bold pl-1 text-sm">₹</span>
                        <input
                          type="number"
                          placeholder="Or enter custom amount in rupees"
                          value={customAmount}
                          onChange={handleCustomChange}
                          className="flex-1 bg-transparent border-none text-sm font-mono focus:outline-none text-[#1a1a1a]"
                        />
                        <span className="text-[10px] text-[#3d5a4c] font-bold pr-1 select-none uppercase font-mono">Custom Input</span>
                      </div>
                    </div>

                    {/* Campaign Selector */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold font-serif text-[#1a1a1a]">
                        Designate This Resource Contribution To
                      </label>
                      <select
                        value={selectedCampaign}
                        onChange={(e) => setSelectedCampaign(e.target.value)}
                        className="w-full bg-[#f9f7f2]/50 border border-stone-200 rounded-none p-2.5 text-sm focus:outline-none focus:border-[#3d5a4c] text-stone-850 font-medium"
                      >
                        {growthGoals.map(goal => (
                          <option key={goal.id} value={goal.id} className="text-gray-800">
                            {goal.title} ({goal.timeline})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Personal Info Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-stone-700">
                          Your Name {isAnonymous && <span className="text-xs text-stone-400 font-normal">(hidden in logs)</span>}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Anand Satheesh"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          disabled={isAnonymous}
                          className="w-full bg-[#f9f7f2]/50 border border-stone-200 rounded-none p-2.5 text-sm focus:outline-none focus:border-[#3d5a4c] disabled:opacity-50 text-stone-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-stone-700">
                          Email Address <span className="text-xs text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. anand@outlook.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#f9f7f2]/50 border border-stone-200 rounded-none p-2.5 text-sm focus:outline-none focus:border-[#3d5a4c] text-stone-800"
                        />
                      </div>
                    </div>

                    {/* Comments & Message */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-stone-700">
                        Message of Encouragement
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Write a message of support to coastal youths, SHG leaders, or volunteer coordinators..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-[#f9f7f2]/50 border border-stone-200 rounded-none p-2.5 text-sm focus:outline-none focus:border-[#3d5a4c] text-stone-800 resize-none"
                      />
                    </div>

                    {/* Anonymous toggle */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="anon-checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="w-4 h-4 text-[#3d5a4c] border-stone-300 rounded-none focus:ring-0 cursor-pointer accent-[#3d5a4c]"
                      />
                      <label htmlFor="anon-checkbox" className="text-xs text-stone-600 cursor-pointer select-none">
                        Post this donation as <span className="font-bold text-stone-800">Anonymous</span> on the public board
                      </label>
                    </div>

                    {/* Secure Lock indicator */}
                    <div className="bg-[#ebf0ec] p-4 rounded-none border border-[#1a1a1a]/10 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#3d5a4c] shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[#1a1a1a]">Simulated Payment Sandboxing</p>
                        <p className="text-[11px] text-stone-700 leading-relaxed">
                          This is a local sandbox for the Two-Thirds Community Foundation. No real funds are moved, but the interactive growth trackers respond immediately to showcase complete site mechanics!
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="submit-donation-btn"
                      className="w-full bg-[#1a1a1a] hover:bg-black text-[#f9f7f2] font-bold uppercase tracking-wider text-xs py-3.5 rounded-none select-none cursor-pointer text-center flex items-center justify-center gap-2 transition-all"
                    >
                      <Heart className="w-4 h-4 fill-[#f9f7f2]" />
                      <span>Complete Secure Simulated Donation (₹{amount.toLocaleString('en-IN')})</span>
                    </button>

                  </form>
                )}

                {/* Processing State Animation */}
                {checkoutStep === 'processing' && (
                  <div className="py-16 text-center space-y-6">
                    <div className="w-16 h-16 border-4 border-[#3d5a4c] border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="space-y-2">
                      <h4 className="font-serif font-bold text-lg text-[#1a1a1a]">Processing Simulated Transfer...</h4>
                      <p className="text-sm font-mono text-stone-500 animate-pulse">{processingStatus}</p>
                    </div>
                  </div>
                )}

                {/* Payment Successful Badge/Certificate view */}
                {checkoutStep === 'success' && latestDonation && (
                  <div className="space-y-6 py-4 animate-fade-in">
                    
                    {/* Top Alert */}
                    <div className="bg-[#ebf0ec] border border-[#3d5a4c]/30 p-6 rounded-none flex items-center gap-4 text-[#3d5a4c]">
                      <div className="w-12 h-12 bg-[#3d5a4c] text-white flex items-center justify-center shrink-0">
                        <Check className="w-6 h-6 stroke-[3px]" />
                      </div>
                      <div>
                        <h4 className="font-serif font-black text-lg text-[#1a1a1a]">Simulated Contribution Accepted!</h4>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Thank you {latestDonation.isAnonymous ? 'Anonymous' : latestDonation.donorName} for backing Malayalam coastal villages. The Year 1 & 2 progress metrics have automatically updated.
                        </p>
                      </div>
                    </div>

                    {/* Printable Beautiful Badge Certificate */}
                    <div className="bg-white rounded-none p-6 sm:p-10 border-4 border-double border-[#1a1a1a] max-w-xl mx-auto space-y-8 relative overflow-hidden">
                      {/* Watermark/Estuary logo background */}
                      <div className="absolute -right-16 -top-16 text-[#3d5a4c]/5 text-9xl font-extrabold font-serif pointer-events-none">2/3</div>
                      
                      {/* Certificate Header */}
                      <div className="text-center space-y-1.5 border-b border-stone-200 pb-4">
                        <span className="text-[#3d5a4c] font-bold text-xs tracking-widest uppercase font-mono">Certificate of Appreciation</span>
                        <h5 className="font-serif font-bold text-xl text-[#1a1a1a]">Two-Thirds Community Foundation</h5>
                        <p className="text-[10px] text-stone-500 font-mono italic">Regd. Section 8, Companies Act, 2013 • Kerala, India</p>
                      </div>

                      {/* Recipient Details */}
                      <div className="text-center space-y-4 font-serif">
                        <p className="text-xs text-stone-500 uppercase tracking-widest font-bold font-sans">This authentic badge is proudly presented to</p>
                        <h6 className="text-2xl font-black text-[#3d5a4c] tracking-tight underline decoration-[#1a1a1a] underline-offset-6">
                          {latestDonation.isAnonymous ? 'An Anonymous Community Champion' : latestDonation.donorName}
                        </h6>
                        <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed italic">
                          for participating in the alternative livelihoods scale-up program, helping empower our 50-women pilot cluster and securing community libraries. Together, we walk with the two-thirds.
                        </p>
                      </div>

                      {/* Stat Metrics on Certificate */}
                      <div className="grid grid-cols-2 gap-4 bg-[#f9f7f2] p-4 rounded-none border border-[#1a1a1a]/15 font-mono text-center">
                        <div>
                          <p className="text-[10px] text-stone-500 uppercase">Simulated Sum Received</p>
                          <p className="text-base font-bold text-[#3d5a4c]">₹{latestDonation.amount.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-500 uppercase">Verification Code</p>
                          <p className="text-[11px] font-bold text-stone-800 uppercase">{latestDonation.certificateCode}</p>
                        </div>
                      </div>

                      {/* Certificate Footer */}
                      <div className="flex justify-between items-center text-[10px] text-stone-500 font-mono border-t border-stone-100 pt-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#3d5a4c]" />
                          <span>Date: {latestDonation.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-[#3d5a4c]" />
                          <span>8 Years of Grassroots Trust</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons inside result */}
                    <div className="text-center pt-2 flex flex-col sm:flex-row justify-center gap-3">
                      <button
                        onClick={() => triggerCopy(newCertificateCode, 'badge')}
                        className="bg-transparent hover:bg-stone-100 text-[#1a1a1a] border border-[#1a1a1a] px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedText === 'badge' ? 'Copied Certificate Code!' : 'Copy Certificate Code'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setCheckoutStep('idle');
                          setLatestDonation(null);
                        }}
                        className="bg-[#3d5a4c] hover:bg-[#2d4338] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Make Another Simulated Donation</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* METHOD 2: BANK & UPI DETAILS (COPIED DIRECTLY FROM PAGE 10 SLIDES) */}
            {donateMethod === 'bank' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Intro warning about direct transfers */}
                <div className="flex gap-3 bg-[#ebf0ec] p-4 rounded-none border border-[#3d5a4c]/10">
                  <Info className="w-5 h-5 text-[#3d5a4c] shrink-0 mt-0.5" />
                  <p className="text-xs text-stone-700 leading-relaxed font-serif italic">
                    Below are the official banking identities of the Two-Thirds Community Foundation. Registered companies or individuals who completed transfer are requested to email a screenshot to <a href="mailto:twothirdscommunityfoundation@gmail.com" className="font-bold underline text-[#3d5a4c]">twothirdscommunityfoundation@gmail.com</a> along with PAN/corporate registration logs for detailed tax reports.
                  </p>
                </div>

                {/* Split grid for bank and UPI QR */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  
                  {/* Bank detail card standard table format */}
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-[#1a1a1a] text-base border-b border-stone-200 pb-2">
                      Direct Federal Bank Transfer
                    </h4>

                    <div className="space-y-3.5 font-mono text-xs">
                      
                      <div className="bg-[#f9f7f2] p-3 rounded-none border border-stone-200 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-stone-400 uppercase">Account Holder</p>
                          <p className="font-bold text-stone-800">TWO-THIRDS COMMUNITY FOUNDATION</p>
                        </div>
                        <button
                          onClick={() => triggerCopy('TWO-THIRDS COMMUNITY FOUNDATION', 'holder')}
                          className="p-1 px-2 border border-[#1a1a1a]/20 rounded-none text-stone-600 hover:text-[#3d5a4c] hover:border-[#3d5a4c]"
                        >
                          {copiedText === 'holder' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="bg-[#f9f7f2] p-3 rounded-none border border-stone-200 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-stone-400 uppercase">Bank Name (Kerala Federal Network)</p>
                          <p className="font-bold text-stone-800">Federal Bank</p>
                        </div>
                        <button
                          onClick={() => triggerCopy('Federal Bank', 'bank')}
                          className="p-1 px-2 border border-[#1a1a1a]/20 rounded-none text-stone-600 hover:text-[#3d5a4c] hover:border-[#3d5a4c]"
                        >
                          {copiedText === 'bank' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="bg-[#f9f7f2] p-3 rounded-none border border-stone-200 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-stone-400 uppercase">Account Number</p>
                          <p className="font-bold text-stone-800 tracking-wider">12960200003680</p>
                        </div>
                        <button
                          onClick={() => triggerCopy('12960200003680', 'acc')}
                          className="p-1 px-2 border border-[#1a1a1a]/20 rounded-none text-stone-600 hover:text-[#3d5a4c] hover:border-[#3d5a4c]"
                        >
                          {copiedText === 'acc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="bg-[#f9f7f2] p-3 rounded-none border border-stone-200 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-stone-400 uppercase">IFSC Code</p>
                          <p className="font-bold text-stone-800 tracking-wider">FDRL0001296</p>
                        </div>
                        <button
                          onClick={() => triggerCopy('FDRL0001296', 'ifsc')}
                          className="p-1 px-2 border border-[#1a1a1a]/20 rounded-none text-stone-600 hover:text-[#3d5a4c] hover:border-[#3d5a4c]"
                        >
                          {copiedText === 'ifsc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* UPI QR Code Container page 10 exact match */}
                  <div className="bg-[#f9f7f2] p-6 rounded-none border border-[#1a1a1a]/15 flex flex-col items-center justify-center space-y-4">
                    <span className="bg-[#ebf0ec] text-[#3d5a4c] font-mono text-[9px] font-bold px-2 py-0.5 rounded-none uppercase tracking-wide">Scan and pay with any UPI app</span>
                    
                    {/* Visual QR Simulator box */}
                    <div className="w-44 h-44 bg-white p-3 rounded-none shadow border border-stone-200 flex flex-col items-center justify-center relative">
                      <div className="w-36 h-36 bg-[#3d5a4c]/5 border-2 border-dashed border-[#3d5a4c] rounded-none flex flex-col items-center justify-center relative">
                        {/* Fake illustrative patterns inside QR box */}
                        <div className="grid grid-cols-4 gap-2 w-28 h-28 opacity-75">
                          {[...Array(16)].map((_, i) => (
                            <div key={i} className={`rounded-none ${(i === 0 || i === 3 || i === 12 || i === 15 || i === 5 || i === 10) ? 'bg-[#1a1a1a]' : 'bg-[#f9f7f2]'}`} />
                          ))}
                        </div>
                        <span className="absolute text-[8px] font-mono font-bold bg-[#f9f7f2] text-[#3d5a4c] px-1 rounded-none border border-[#3d5a4c]/25">FBL Net</span>
                      </div>
                    </div>

                    <div className="text-center font-mono">
                      <p className="text-xs font-bold text-stone-800">biz.twothird740@fbl</p>
                      <p className="text-[10px] text-stone-400 font-sans italic">Federal Bank Merchants Net ID</p>
                    </div>

                    <button
                      onClick={() => triggerCopy('biz.twothird740@fbl', 'upi')}
                      className="bg-white hover:bg-[#ebf0ec] text-stone-700 border border-stone-300 px-3 py-1.5 text-xs font-semibold rounded-none select-none cursor-pointer flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedText === 'upi' ? 'Copied UPI!' : 'Copy BHIM ID'}</span>
                    </button>
                  </div>

                </div>

                {/* Sub registration detail notes */}
                <div className="border-t border-stone-200 pt-5 text-center text-xs text-stone-400 font-mono leading-relaxed">
                  <p className="font-semibold text-stone-500 text-[10px] tracking-wide uppercase">
                    CIN Identification Code: U88900KL2026NPL100608
                  </p>
                  <p className="mt-1">
                    Incorporated under Section 8(1) of the Companies Act, 2013, to empower under-resourced coastal layers.
                  </p>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Live Donor Ledger & Statistics (Right Side 4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Stats Summary widget */}
          <div className="bg-[#3d5a4c] text-white p-5 rounded-none border border-[#1a1a1a]">
            <h4 className="font-mono text-[9px] uppercase tracking-widest font-bold text-[#ebf0ec]">Total Raised Toward Year 1</h4>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-serif font-black text-3xl">
                ₹{growthGoals[0].currentAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[#ebf0ec] font-mono">
                / ₹{growthGoals[0].targetAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="w-full bg-[#2d4338] h-2 rounded-none overflow-hidden mt-3">
              <div
                className="bg-white h-full transition-all duration-350"
                style={{ width: `${Math.min(100, Math.round((growthGoals[0].currentAmount / growthGoals[0].targetAmount) * 100))}%` }}
              />
            </div>
          </div>

          {/* Donor Registry Header */}
          <div className="bg-white rounded-none border border-[#1a1a1a]/15 p-6 space-y-4">
            <div className="border-b border-stone-100 pb-3 flex justify-between items-center">
              <h4 className="font-serif font-bold text-[#1a1a1a] text-sm flex items-center gap-2">
                <Heart className="w-4.5 h-4.5 text-[#3d5a4c] fill-[#3d5a4c]" />
                <span>Donor Registry Board</span>
              </h4>
              <span className="bg-[#ebf0ec] text-[#3d5a4c] font-mono text-[9px] font-bold px-2 py-0.5 rounded-none uppercase tracking-wider">
                {donations.length} Active Records
              </span>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 bg-[#f9f7f2] rounded-none p-2 border border-stone-200">
              <Search className="w-4 h-4 text-stone-400 font-bold" />
              <input
                type="text"
                placeholder="Search direct donors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs focus:outline-none w-full text-stone-800"
              />
            </div>

            {/* Donor Listings */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {filteredDonations.length > 0 ? (
                filteredDonations.map((don) => (
                  <div key={don.id} className="p-3 bg-[#f9f7f2]/40 rounded-none border border-stone-200 space-y-1 hover:border-[#3d5a4c] transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-stone-800 font-sans">
                        {don.isAnonymous ? 'Anonymous Advocate' : don.donorName}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#3d5a4c]">
                        ₹{don.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {don.message && (
                      <p className="text-[11px] text-stone-600 italic leading-relaxed font-serif">
                        “{don.message}”
                      </p>
                    )}
                    <div className="flex justify-between items-center text-[9px] text-stone-400 font-mono pt-1">
                      <span>Verified: {don.date}</span>
                      {don.certificateCode && <span>Code: {don.certificateCode}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-stone-400 py-6">No matching donors yet</p>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
