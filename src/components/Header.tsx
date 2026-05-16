import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, User, Newspaper, PlusSquare, LogOut, ShieldCheck, Heart } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <div className="ticker-wrap border-b border-paper/10">
        <div className="ticker-move">
          <span className="text-news-accent font-bold">Breaking Hearts:</span> 
          <span className="mx-8">New single mum featured in Cape Town Edition ...</span>
          <span className="text-news-accent font-bold">Trending:</span> 
          <span className="mx-8">Harare's Most Eligible Bachelors - Investigative Report ...</span>
          <span className="text-news-accent font-bold">Latest:</span> 
          <span className="mx-8">Top 10 Romantic Getaways in South Africa ...</span>
        </div>
      </div>
      
      <header className="w-full border-b-4 border-ink bg-paper pt-6 pb-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center border-b border-ink/20 pb-2 mb-4 text-xs font-mono uppercase tracking-widest">
            <div className="flex gap-4">
              <span>Vol. LXXIV ... No. 25,938</span>
              <span className="hidden md:inline">{today}</span>
            </div>
            <div className="flex gap-4 items-center">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline italic">Welcome, {user.email?.split('@')[0]}</span>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center gap-1.5 text-news-accent font-black animate-pulse hover:scale-105 transition-transform bg-news-accent/10 px-3 py-1 border border-news-accent">
                      <ShieldCheck size={18} /> ADMIN BACKEND
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="bg-ink text-paper px-3 py-1 font-bold text-[10px] uppercase tracking-widest hover:bg-news-accent transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut size={14} /> LOGOUT
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hover:underline flex items-center gap-1 font-bold text-news-accent">
                  <User size={14} /> GUEST LOGIN
                </Link>
              )}
              <span className="hidden sm:inline">Price: Free for All</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-center py-4 md:py-6 gap-6 lg:gap-8">
            <Link to="/" className="inline-block relative shrink-0">
              <div className="absolute -top-3 -right-3 text-news-accent opacity-20 rotate-12">
                <Heart size={24} fill="currentColor" />
              </div>
              <h1 className="text-3xl md:text-4xl border-y-2 border-ink inline-block px-3 py-1 hover:opacity-80 transition-opacity whitespace-nowrap text-ink">
                OPRA MIXES
              </h1>
              <p className="mt-1 font-serif italic text-[10px] md:text-xs opacity-70 text-ink text-center lg:text-left">
                "SA & Zim's Dating Chronicle"
              </p>
            </Link>

            <div className="w-full lg:w-[728px] h-[60px] lg:h-[90px] bg-ink/5 border border-ink/10 flex items-center justify-center relative group cursor-help overflow-hidden">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-30 px-4 text-center">Editorial Sponsorship • 728x90</span>
              <div className="absolute inset-0 border-2 border-dashed border-ink/5 group-hover:border-news-accent/20 transition-colors" />
            </div>
          </div>

          <nav className="border-y border-ink py-2 md:py-3 flex flex-wrap justify-center items-center gap-3 md:gap-10 font-serif font-bold uppercase tracking-wider text-[10px] md:text-sm sticky top-0 bg-paper z-40">
            <Link to="/" className="hover:text-news-accent transition-colors border-b-2 border-transparent hover:border-news-accent pb-1">HOME</Link>
            <Link to="/?category=South Africa" className="hover:text-news-accent transition-colors border-b-2 border-transparent hover:border-news-accent pb-1">South Africa</Link>
            <Link to="/?category=Zimbabwe" className="hover:text-news-accent transition-colors border-b-2 border-transparent hover:border-news-accent pb-1">Zimbabwe</Link>
            <Link to="/?category=Single Mums" className="hover:text-news-accent transition-colors border-b-2 border-transparent hover:border-news-accent pb-1">Single Mums</Link>
            <Link to="/categories" className="hover:text-news-accent transition-colors border-b-2 border-transparent hover:border-news-accent pb-1">Featured</Link>
            <Link to="/submit" className="flex items-center gap-1 md:gap-2 text-news-accent border border-news-accent px-2 md:px-3 py-1 hover:bg-news-accent hover:text-paper transition-all">
              <PlusSquare size={14} className="md:w-4 md:h-4" /> <span className="hidden xs:inline">Submit Story</span><span className="xs:hidden">Submit</span>
            </Link>
            <div className="flex-1 md:flex-none" />
            <div className="relative group">
              <Search size={18} className="cursor-pointer group-hover:text-news-accent" />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
