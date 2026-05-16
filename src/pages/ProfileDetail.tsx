import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Profile } from '../types';
import { MapPin, Calendar, MessageSquare, Share2, Bookmark, ArrowLeft, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

export function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      const docRef = doc(db, 'profiles', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() } as Profile);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen font-serif italic text-2xl animate-pulse">
      Reviewing the Archives...
    </div>
  );

  if (!profile) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-6xl mb-4">404: MISSING PERSON</h2>
      <p className="text-xl font-serif italic mb-8">This story has been pulled from circulation.</p>
      <Link to="/" className="text-news-accent hover:underline flex items-center justify-center gap-2">
        <ArrowLeft size={16} /> Return to Home
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity mb-10">
        <ArrowLeft size={14} /> Back to Front Page
      </Link>

      <header className="mb-12 border-b-4 border-ink pb-8">
        <div className="flex items-center gap-2 text-news-accent font-bold uppercase tracking-[0.2em] text-xs mb-4">
          <span className="w-12 h-[2px] bg-news-accent"></span> Exclusive Feature
        </div>
        <h1 className="text-6xl md:text-8xl lg:text-9xl mb-6 leading-none">
          {profile.name}, {profile.age}
        </h1>
        <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-sm font-mono uppercase tracking-wider opacity-60">
          <span className="flex items-center gap-2"><MapPin size={16} /> {profile.city}</span>
          <span className="flex items-center gap-2"><Calendar size={16} /> Member since {format(profile.createdAt.toDate(), 'MMMM yyyy')}</span>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button className="hover:text-news-accent transition-colors"><MessageSquare size={18} /></button>
            <button className="hover:text-news-accent transition-colors"><Share2 size={18} /></button>
            <button className="hover:text-news-accent transition-colors"><Bookmark size={18} /></button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-12">
          {profile.photoUrl && (
            <div className="mb-10 border-8 border-ink bg-ink/5 p-2">
              <img 
                src={profile.photoUrl} 
                alt={profile.name} 
                className="w-full h-auto grayscale-[0.5] hover:grayscale-0 transition-all duration-1000"
              />
              <div className="mt-2 text-[10px] font-mono italic opacity-50 px-2 italic">
                Fig. 1: A recent photograph of the subject in their natural habitat.
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-8">
          <div className="markdown-body text-xl lg:text-2xl leading-relaxed first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:font-serif">
            <ReactMarkdown>{profile.bio}</ReactMarkdown>
          </div>
        </div>

        <aside className="md:col-span-4 border-l border-ink/10 pl-10 space-y-10">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest mb-4 opacity-50">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map(interest => (
                <span key={interest} className="px-3 py-1 bg-ink text-paper text-[10px] font-mono uppercase tracking-widest">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 border-2 border-ink space-y-4">
            <h4 className="text-lg italic leading-tight">Request a Correspondence</h4>
            <p className="text-xs font-serif opacity-70">
              Letters sent via our internal courier service are usually delivered within 24 hours.
            </p>
            <button className="w-full flex items-center justify-center gap-2 bg-news-accent text-paper py-3 font-bold uppercase tracking-widest text-xs hover:bg-news-accent/90 transition-all">
              <Send size={14} /> Send Letter
            </button>
          </div>
        </aside>
      </div>

      <section className="mt-20 border-t-4 border-ink pt-10">
        <h3 className="text-3xl font-serif italic mb-8">Related Editions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-ink/10 p-4 hover:bg-ink/5 transition-colors cursor-pointer group">
            <div className="aspect-video bg-ink/5 mb-4 overflow-hidden">
               <div className="w-full h-full flex items-center justify-center text-ink/20 font-serif italic">Archive Image</div>
            </div>
            <h4 className="text-xl group-hover:underline">The Secret to Long Distance Success in Zimbabwe</h4>
            <p className="text-xs font-mono opacity-50 uppercase mt-2">Special Report • 2 min read</p>
          </div>
          <div className="border border-ink/10 p-4 hover:bg-ink/5 transition-colors cursor-pointer group">
            <div className="aspect-video bg-ink/5 mb-4 overflow-hidden">
               <div className="w-full h-full flex items-center justify-center text-ink/20 font-serif italic">Archive Image</div>
            </div>
            <h4 className="text-xl group-hover:underline">Top 10 Meeting Spots in Johannesburg</h4>
            <p className="text-xs font-mono opacity-50 uppercase mt-2">Lifestyle • 5 min read</p>
          </div>
        </div>
      </section>

      <footer className="mt-20 pt-10 border-t border-ink/10 flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.3em] opacity-30">
        <span>© 2026 THE DATING GAZETTE</span>
        <span>ALL RIGHTS RESERVED</span>
        <span>ISSN 1052-124X</span>
      </footer>
    </div>
  );
}
