import React, { useState } from 'react';
import { Anchor, ShieldCheck, HeartHandshake, Eye, BookOpen, UserCheck, EyeOff, Sparkles, Menu, X } from 'lucide-react';

interface NavigationProps {
  activeTab: 'overview' | 'donations' | 'volunteer' | 'impact';
  setActiveTab: (tab: 'overview' | 'donations' | 'volunteer' | 'impact') => void;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  isAdminMode,
  setIsAdminMode
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleTabClick = (tab: 'overview' | 'donations' | 'volunteer' | 'impact') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#f9f7f2] border-b border-[#1a1a1a]/15">
      {/* Top Banner with Registration/Compliance Info */}
      <div className="bg-[#3d5a4c] text-[#f9f7f2] text-xs px-4 py-2 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block bg-[#1a1a1a] text-[10px] font-mono px-2 py-0.5 text-white uppercase tracking-wider font-bold">Kerala, India</span>
          <span className="font-mono hover:underline text-[10px] sm:text-xs">Registered Section 8 (Company Act 2013)</span>
          <span className="hidden lg:inline font-mono opacity-80">| CIN: U88900KL2026NPL100608</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-serif italic text-[11px] tracking-wide flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-200 inline shrink-0" />
            <span className="hidden sm:inline">100% applied solely toward charitable objects</span>
            <span className="sm:hidden text-[10px]">100% Direct Impact Trust</span>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex justify-between items-center">
          
          {/* Logo & Slogan Column */}
          <div className="flex items-center gap-3 sm:gap-4 select-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1a1a1a] flex items-center justify-center shrink-0">
              <Anchor className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-xl sm:text-2xl font-black tracking-tight text-[#1a1a1a] leading-none">
                  Two-Thirds <span className="text-[#3d5a4c] font-light italic">Community Foundation</span>
                </h1>
                <span className="hidden sm:inline-block border border-[#1a1a1a] text-[#1a1a1a] text-[8px] uppercase tracking-widest font-mono font-bold px-1.5 py-0.5 bg-transparent">
                  Kerala Base
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-600 font-serif italic mt-0.5 leading-tight">
                “For the two-thirds who deserve better” • Coastal Empowerment Act
              </p>
            </div>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden xl:flex items-center gap-4">
            <nav className="flex items-center gap-1 p-1 bg-transparent">
              <button
                id="nav-tab-overview"
                onClick={() => handleTabClick('overview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer rounded-none border ${
                  activeTab === 'overview'
                    ? 'bg-[#1a1a1a] text-[#f9f7f2] border-[#1a1a1a]'
                    : 'text-stone-700 hover:text-[#1a1a1a] border-transparent hover:border-[#1a1a1a]/40'
                }`}
              >
                <span>Our Vision</span>
              </button>

              <button
                id="nav-tab-donations"
                onClick={() => handleTabClick('donations')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer rounded-none border ${
                  activeTab === 'donations'
                    ? 'bg-[#1a1a1a] text-[#f9f7f2] border-[#1a1a1a]'
                    : 'text-stone-700 hover:text-[#1a1a1a] border-transparent hover:border-[#1a1a1a]/40'
                }`}
              >
                <span>Donations</span>
              </button>

              <button
                id="nav-tab-volunteer"
                onClick={() => handleTabClick('volunteer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer rounded-none border ${
                  activeTab === 'volunteer'
                    ? 'bg-[#1a1a1a] text-[#f9f7f2] border-[#1a1a1a]'
                    : 'text-stone-700 hover:text-[#1a1a1a] border-transparent hover:border-[#1a1a1a]/40'
                }`}
              >
                <span>Volunteer Positions</span>
              </button>

              <button
                id="nav-tab-impact"
                onClick={() => handleTabClick('impact')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer rounded-none border ${
                  activeTab === 'impact'
                    ? 'bg-[#1a1a1a] text-[#f9f7f2] border-[#1a1a1a]'
                    : 'text-stone-700 hover:text-[#1a1a1a] border-transparent hover:border-[#1a1a1a]/40'
                }`}
              >
                <span>Impact Stories</span>
              </button>
            </nav>

            <button
              id="admin-mode-toggle"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border cursor-pointer transition-all rounded-none ${
                isAdminMode
                  ? 'bg-[#3d5a4c] text-white border-[#3d5a4c]'
                  : 'bg-transparent text-stone-600 border-[#1a1a1a]/20 hover:border-[#1a1a1a]'
              }`}
              title="Toggle to post opportunities, review volunteer applications and publish impact stories"
            >
              {isAdminMode ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Admin Mode [ON]</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Staff Portal</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Hamburguer Trigger */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              id="admin-mode-toggle-mobile-fast"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border cursor-pointer transition-all rounded-none ${
                isAdminMode
                  ? 'bg-[#3d5a4c] text-white border-[#3d5a4c]'
                  : 'bg-transparent text-stone-600 border-[#1a1a1a]/25'
              }`}
            >
              {isAdminMode ? "Admin: On" : "Staff"}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-900 border border-[#1a1a1a]/15 focus:outline-hidden hover:bg-stone-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel Expansion */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#FAF5EB] border-t border-[#1a1a1a]/15 px-4 py-4 space-y-3 shadow-lg animate-fadeIn">
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => handleTabClick('overview')}
              className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-mono font-bold border transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
            >
              Our Vision & Mission
            </button>

            <button
              onClick={() => handleTabClick('donations')}
              className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-mono font-bold border transition-all ${
                activeTab === 'donations'
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
            >
              Donation Campaigns (₹)
            </button>

            <button
              onClick={() => handleTabClick('volunteer')}
              className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-mono font-bold border transition-all ${
                activeTab === 'volunteer'
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
            >
              Volunteer Opportunities
            </button>

            <button
              onClick={() => handleTabClick('impact')}
              className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-mono font-bold border transition-all ${
                activeTab === 'impact'
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
            >
              Kerala Impact Stories
            </button>
          </nav>

          <div className="pt-2 border-t border-stone-200/60 flex justify-between items-center text-[10px] text-stone-400 font-mono">
            <span>CIN: U88900KL2026NPL100608</span>
            <span>Registered Sec 8 NGO</span>
          </div>
        </div>
      )}
    </header>
  );
}
