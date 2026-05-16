import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, orderBy, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Profile } from '../types';
import { Check, X, Edit2, Eye, Trash2, Shield, AlertCircle, TrendingUp, Sparkles, Loader2, PlusCircle, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(
      collection(db, 'profiles'),
      orderBy('status', 'asc'), // Pending first
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile));
      setProfiles(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const claimAdminStatus = async () => {
    if (!user) return;
    setClaiming(true);
    try {
      await setDoc(doc(db, 'admins', user.uid), { role: 'admin' });
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Bureaucratic error. Please check your Firestore rules.");
    } finally {
      setClaiming(false);
    }
  };

  const seedDemoData = async () => {
    if (!user || !isAdmin) return;
    setSeeding(true);
    try {
      const demoProfiles = [
        {
          name: "Sarah M.",
          age: 32,
          gender: "Female",
          city: "Cape Town, SA",
          bio: "# Looking for a Sincere Connection\n\nI'm a hard-working single mum originally from the coast. I love morning walks on the beach and exploring historical architecture. I'm looking for someone who values family and has a good sense of humor.",
          interests: ["South Africa", "Single Mums", "Photography"],
          photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
          status: "approved",
          authorId: user.uid,
          createdAt: new Date()
        },
        {
          name: "Tendai K.",
          age: 28,
          gender: "Female",
          city: "Harare, Zimbabwe",
          bio: "## The Heart of Zim\n\nIndependent woman working in finance. I'm passionate about traditional music and modern art. I believe in honest communication and building a future together. Let's see where this journey takes us.",
          interests: ["Zimbabwe", "Single Ladies", "Jazz"],
          photoUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400",
          status: "approved",
          authorId: user.uid,
          createdAt: new Date()
        },
        {
          name: "Lerato N.",
          age: 35,
          gender: "Female",
          city: "Johannesburg, SA",
          bio: "### Mature and Real\n\nLooking for mature conversation and genuine connection in the city of gold. I lead a busy life but always make time for the right person. I'm into fine dining and investigative journalism.",
          interests: ["South Africa", "Adult Dating", "Politics"],
          photoUrl: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?auto=format&fit=crop&q=80&w=400",
          status: "approved",
          authorId: user.uid,
          createdAt: new Date()
        },
        {
          name: "Blessing C.",
          age: 29,
          gender: "Female",
          city: "Bulawayo, Zimbabwe",
          bio: "#### Adventure Awaits\n\nSingle mum of one beautiful girl. I'm a teacher with a love for the outdoors. Looking for a partner who is kind, stable, and ready for a long-term commitment.",
          interests: ["Zimbabwe", "Single Mums", "Education"],
          photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
          status: "approved",
          authorId: user.uid,
          createdAt: new Date()
        }
      ];

      for (const p of demoProfiles) {
        await addDoc(collection(db, 'profiles'), {
          ...p,
          createdAt: serverTimestamp()
        });
      }
      alert("Demo Data Seeded Successfully!");
    } catch (err) {
      console.error(err);
      alert("Seeding failed. Check console.");
    } finally {
      setSeeding(false);
    }
  };

  const handleApprove = async (id: string) => {
    const docRef = doc(db, 'profiles', id);
    await updateDoc(docRef, { 
      status: 'approved',
      updatedAt: new Date()
    });
  };

  const handleReject = async (id: string) => {
    if (window.confirm("Are you sure you want to pull this story?")) {
      await deleteDoc(doc(db, 'profiles', id));
    }
  };

  if (authLoading) return null;

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-10 border-4 border-news-accent bg-paper shadow-[20px_20px_0px_0px_rgba(208,0,0,0.05)] text-center space-y-6">
        <Shield size={64} className="mx-auto text-news-accent" />
        <h2 className="text-4xl text-news-accent">Editorial Clearances Required</h2>
        <p className="font-serif italic text-lg opacity-60">
          You are currently a guest in the Gazette's central desk. If you are the owner of this press, you may activate your credentials below.
        </p>
        <button 
          onClick={claimAdminStatus}
          disabled={claiming || !user}
          className="w-full bg-news-accent text-paper py-4 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          {claiming ? <Loader2 className="animate-spin" size={18} /> : <Heart size={18} />}
          {claiming ? 'Verifying Identity...' : 'Register as Chief Editor'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <header className="mb-12 border-b-8 border-ink pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="flex items-start gap-4">
          <Heart className="text-news-accent shrink-0 mt-2 animate-bounce" size={40} />
          <div>
            <h1 className="text-7xl uppercase italic tracking-tighter">Editor's Desk</h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40">Reviewing the news that's fit to date</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-4">
          <Link 
            to="/submit"
            className="flex items-center gap-2 bg-ink text-paper px-6 py-3 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all"
          >
            <PlusCircle size={16} /> New Editorial Post
          </Link>
          <button 
            onClick={seedDemoData}
            disabled={seeding}
            className="flex items-center gap-2 bg-paper border-2 border-ink px-4 py-2 font-bold uppercase tracking-widest text-[10px] hover:bg-ink hover:text-paper transition-all"
          >
            {seeding ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            Seed Demo Data
          </button>
          <div className="bg-ink text-paper px-6 py-3 flex items-center gap-6 font-mono text-xs uppercase tracking-widest">
            <div className="flex flex-col">
              <span className="opacity-50">Pending</span>
              <span className="text-xl font-bold">{profiles.filter(p => p.status === 'pending').length}</span>
            </div>
            <div className="flex flex-col">
              <span className="opacity-50">Approved</span>
              <span className="text-xl font-bold">{profiles.filter(p => p.status === 'approved').length}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          <div className="text-center py-20 font-serif italic text-2xl animate-pulse">Scanning the wire...</div>
        ) : (
          <div className="overflow-x-auto border-2 border-ink">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ink text-paper font-mono text-[10px] uppercase tracking-widest">
                  <th className="px-6 py-4 border-r border-paper/20">Subject</th>
                  <th className="px-6 py-4 border-r border-paper/20">Status</th>
                  <th className="px-6 py-4 border-r border-paper/20">Filed Date</th>
                  <th className="px-6 py-4 border-r border-paper/20">Author ID</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="font-serif">
                {profiles.map(profile => (
                  <tr key={profile.id} className="border-b border-ink hover:bg-ink/5 transition-colors group">
                    <td className="px-6 py-6 border-r border-ink/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-ink/5 border border-ink/10 shrink-0 overflow-hidden">
                          {profile.photoUrl && <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="font-bold text-lg">{profile.name}, {profile.age}</div>
                          <div className="text-xs font-mono opacity-40 uppercase tracking-tighter">{profile.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 border-r border-ink/10">
                      <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                        profile.status === 'approved' ? 'bg-green-100 border-green-600 text-green-700' : 'bg-news-accent/5 border-news-accent text-news-accent animate-pulse'
                      }`}>
                        {profile.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 border-r border-ink/10 text-sm italic opacity-60">
                      {format(profile.createdAt.toDate(), 'MMM dd, HH:mm')}
                    </td>
                    <td className="px-6 py-6 border-r border-ink/10 font-mono text-[10px] opacity-40">
                      {profile.authorId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        {profile.status === 'pending' && (
                          <button 
                            onClick={() => handleApprove(profile.id)}
                            title="Approve Story"
                            className="p-2 border border-green-600 text-green-600 hover:bg-green-600 hover:text-paper transition-all"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => window.open(`/profile/${profile.id}`, '_blank')}
                          title="Preview"
                          className="p-2 border border-ink text-ink hover:bg-ink hover:text-paper transition-all"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleReject(profile.id)}
                          title="Pull Story"
                          className="p-2 border border-news-accent text-news-accent hover:bg-news-accent hover:text-paper transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="mt-20 border-t-2 border-ink pt-8 flex items-center justify-between opacity-50">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em]">
          <AlertCircle size={14} /> Editorial Standards Handbook (2026 Edition)
        </div>
        <div className="text-[10px] font-serif italic">
          Admin UID: {user?.uid}
        </div>
      </footer>
    </div>
  );
}
