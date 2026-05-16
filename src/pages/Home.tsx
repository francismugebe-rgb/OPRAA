import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Profile } from '../types';
import { ProfileCard } from '../components/ProfileCard';
import { Newspaper, TrendingUp, AlertCircle, Filter, Heart } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    let q = query(
      collection(db, 'profiles'),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    if (categoryFilter) {
      q = query(
        collection(db, 'profiles'),
        where('status', '==', 'approved'),
        where('interests', 'array-contains', categoryFilter),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile));
      setProfiles(docs);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError("Failed to load the morning edition. Please check your connection.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin text-news-accent">
          <Newspaper size={48} />
        </div>
        <p className="font-serif italic text-xl animate-pulse">Printing the Latest Edition...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 border-4 border-news-accent bg-news-accent/5 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-news-accent" />
        <h2 className="text-3xl mb-2">EXTRA! EXTRA!</h2>
        <p className="font-serif italic text-lg opacity-80">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 newspaper-grid min-h-screen">
      {categoryFilter && (
        <div className="flex justify-between items-end border-b-4 border-ink pb-4 mb-12">
          <div>
            <span className="text-news-accent font-mono text-xs uppercase tracking-widest font-bold">Special Edition</span>
            <h2 className="text-5xl md:text-7xl font-serif italic">{categoryFilter}</h2>
          </div>
          <button 
            onClick={() => setSearchParams({})} 
            className="text-xs font-mono uppercase tracking-[0.3em] bg-ink text-paper px-4 py-2 hover:bg-news-accent transition-colors"
          >
            Clear Filter [X]
          </button>
        </div>
      )}

      {profiles.length > 0 ? (
        <div className="space-y-16">
          {/* 1. HERO SECTION (Lead Story) */}
          {!categoryFilter && (
            <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 border-b-2 lg:border-b-0 lg:border-r-2 border-ink/10 pb-8 lg:pb-0 lg:pr-8">
                <ProfileCard profile={profiles[0]} variant="hero" />
              </div>
              <div className="lg:col-span-1 space-y-8">
                <div className="sidebar-heading">Trending Stories</div>
                {profiles.slice(1, 4).map((p) => (
                  <ProfileCard key={p.id} profile={p} variant="mini" />
                ))}
              </div>
            </section>
          )}

          {/* 2. TRENDING GRID (Secondary News) */}
          <section className="border-y-4 border-double border-ink/30 py-12">
            <div className="sidebar-heading mb-8">Special Features</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {profiles.slice(categoryFilter ? 0 : 4, categoryFilter ? 3 : 7).map((p) => (
                <ProfileCard key={p.id} profile={p} variant="standard" />
              ))}
            </div>
          </section>

          {/* 3. MAIN WIRE + SIDEBAR */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <div className="sidebar-heading">The Gazette Wire</div>
              <div className="space-y-12">
                {profiles.slice(categoryFilter ? 3 : 7).map((p, index) => (
                  <React.Fragment key={p.id}>
                    <ProfileCard profile={p} variant="list" />
                    {index % 3 === 2 && (
                      <div className="bg-news-accent/5 p-8 border-4 border-news-accent text-center space-y-4">
                         <Newspaper className="mx-auto text-news-accent" size={32} />
                         <h4 className="text-2xl font-serif italic uppercase tracking-tighter">Support Independent Journalism</h4>
                         <p className="text-sm font-serif italic max-w-md mx-auto opacity-70">
                           "Your contribution keeps the truth about love alive. Support the Gazette today."
                         </p>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="lg:col-span-4 space-y-12">
              <div className="bg-ink text-paper p-8 space-y-6">
                <h3 className="text-2xl font-serif italic border-b border-paper/20 pb-4">Gazette Extra</h3>
                <p className="text-sm font-serif leading-relaxed italic opacity-80">
                  "Subscribe to our weekly romantic digest and never miss a heart-beat from across the Limpopo."
                </p>
                <div className="space-y-4">
                  <input 
                    type="email" 
                    placeholder="ENTER EMAIL..." 
                    className="w-full bg-paper/10 border border-paper/20 px-4 py-2 text-xs font-mono focus:outline-none focus:border-news-accent"
                  />
                  <button className="w-full bg-news-accent py-3 text-xs font-mono font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                    SUBSCRIBE
                  </button>
                </div>
              </div>

              <div className="border-4 border-news-accent p-6 text-center space-y-4 relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 opacity-10 group-hover:rotate-12 transition-transform">
                  <Heart size={80} fill="currentColor" className="text-news-accent" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40">Classifieds</span>
                <h4 className="text-xl font-serif font-bold italic">Premium Editorial Placements Available</h4>
                <p className="text-xs font-mono opacity-60">Reach 50,000+ active readers in SA & Zim.</p>
                <button className="text-xs font-mono font-bold uppercase tracking-widest text-news-accent hover:underline">
                  Contact Advertising &rarr;
                </button>
              </div>

              <div className="space-y-6 sticky top-24">
                <div className="sidebar-heading">Archives</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest border-b border-ink/5 pb-2">
                    <span className="hover:text-news-accent cursor-pointer">Cape Town Diaries</span>
                    <span className="opacity-40">(12)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest border-b border-ink/5 pb-2">
                    <span className="hover:text-news-accent cursor-pointer">Harare Romance</span>
                    <span className="opacity-40">(08)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest border-b border-ink/5 pb-2">
                    <span className="hover:text-news-accent cursor-pointer">Single Mum Stories</span>
                    <span className="opacity-40">(44)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest border-b border-ink/5 pb-2">
                    <span className="hover:text-news-accent cursor-pointer">The Golden Gate</span>
                    <span className="opacity-40">(19)</span>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </div>
      ) : (
        <div className="text-center py-20 border-4 border-dashed border-ink/10">
          <Heart className="mx-auto mb-6 opacity-10" size={64} />
          <h3 className="text-4xl mb-4 font-serif italic text-ink/30">Slow News Day</h3>
          <p className="font-mono text-xs uppercase tracking-widest text-ink/50">Be the first to feature in our next edition</p>
        </div>
      )}
    </div>
  );
}
