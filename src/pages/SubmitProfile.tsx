import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Send, Image, Tag, MapPin, Loader2, AlertCircle, Sparkles, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SubmitProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    gender: 'Other',
    city: '',
    bio: '',
    interests: '',
    photoUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, 'profiles'), {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        city: formData.city,
        bio: formData.bio,
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i !== ''),
        photoUrl: formData.photoUrl,
        status: 'pending',
        createdAt: serverTimestamp(),
        authorId: user.uid
      });
      setStep(3); // Success step
    } catch (err) {
      console.error(err);
      setError("The printing press jammed. Please check your data and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-10 border-4 border-ink text-center space-y-6">
        <h2 className="text-4xl">Press Credentials Required</h2>
        <p className="font-serif italic text-lg opacity-60">
          You must be a registered member to submit your story to the Gazette.
        </p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-ink text-paper px-8 py-3 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all"
        >
          Identify Yourself
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl mb-4 uppercase tracking-tighter italic">"Features Section" Submission</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-40">All submissions are subject to editorial review</p>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="bg-news-accent/5 p-4 border-l-4 border-news-accent italic font-serif text-sm">
              "Every heart has a story. Tell yours with the integrity it deserves."
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-news-accent rounded-full"></span> Full Name
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  required
                  placeholder="e.g. Johnathan Doe"
                  className="w-full border-b-2 border-ink py-2 font-serif text-xl focus:outline-none focus:border-news-accent transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Age</label>
                  <input 
                    type="number" 
                    name="age" 
                    value={formData.age} 
                    onChange={handleChange}
                    required
                    min="18"
                    max="100"
                    className="w-full border-b-2 border-ink py-2 font-serif text-xl focus:outline-none focus:border-news-accent transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    required
                    placeholder="e.g. London"
                    className="w-full border-b-2 border-ink py-2 font-serif text-xl focus:outline-none focus:border-news-accent transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Interest Tags</label>
              <div className="flex items-center gap-2 border-b-2 border-ink py-2">
                <Tag size={16} className="opacity-30" />
                <input 
                  type="text" 
                  name="interests" 
                  value={formData.interests} 
                  onChange={handleChange}
                  placeholder="Photography, Hiking, Jazz (comma separated)"
                  className="w-full font-serif text-lg focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Photo URL</label>
              <div className="flex items-center gap-2 border-b-2 border-ink py-2">
                <Image size={16} className="opacity-30" />
                <input 
                  type="url" 
                  name="photoUrl" 
                  value={formData.photoUrl} 
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full font-serif text-lg focus:outline-none"
                />
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.city}
              className="w-full border-2 border-ink bg-paper py-4 font-bold uppercase tracking-widest hover:bg-ink hover:text-paper transition-all disabled:opacity-30 flex items-center justify-center gap-3"
            >
              Compose Biography <Sparkles size={18} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="space-y-2 relative">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center justify-between">
                <span>The Story of Your Life (Markdown Supported)</span>
                <span className="text-[9px] opacity-40">{formData.bio.length} / 5000</span>
              </label>
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange}
                required
                rows={12}
                placeholder="Write your story here... Be bold, be true."
                className="w-full border-4 border-ink p-6 font-serif text-xl leading-relaxed focus:outline-none bg-paper/50"
              />
              <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                <Newspaper size={120} />
              </div>
            </div>

            {error && (
              <div className="p-4 border-2 border-news-accent text-news-accent flex items-center gap-3 bg-news-accent/5 font-serif italic">
                <AlertCircle size={20} /> {error}
              </div>
            )}

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="w-1/3 border-2 border-ink/20 py-4 font-bold uppercase tracking-widest text-xs hover:border-ink transition-all"
              >
                Go Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading || formData.bio.length < 50}
                className="w-2/3 border-2 border-ink bg-ink text-paper py-4 font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                {loading ? 'Submitting Article...' : 'Submit to Editor'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 px-10 border-8 border-double border-ink space-y-8"
          >
            <div className="inline-block p-6 bg-green-500/10 border-2 border-green-600 rounded-full mb-4">
              <Newspaper size={64} className="text-green-700" />
            </div>
            <h2 className="text-6xl font-serif italic">Article Filed!</h2>
            <div className="max-w-md mx-auto space-y-4">
              <p className="text-xl font-serif leading-relaxed opacity-80">
                Your profile has been sent to the editor-in-chief. You will be notified via carrier pigeon (or status check) once your story is approved for the front page.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button 
                onClick={() => navigate('/')}
                className="bg-ink text-paper px-8 py-4 font-bold uppercase tracking-widest text-xs hover:opacity-90"
              >
                Return to Circulation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
