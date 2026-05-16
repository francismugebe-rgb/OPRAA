import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Newspaper, Mail, LogIn, ChevronRight, Lock, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError("Failed to verify credentials with the central bureau.");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError("Invalid credentials. If this is a new admin account, try the 'Register' option below.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("This email is already in circulation. Please login instead.");
      } else if (err.code === 'auth/weak-password') {
        setError("The passphrase must be at least 6 characters long for the Gazette's security.");
      } else {
        setError("Connection to the central bureau lost. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full border-4 border-news-accent p-10 bg-paper shadow-[24px_24px_0px_0px_rgba(208,0,0,0.05)] relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
          <Heart size={200} fill="currentColor" className="text-news-accent" />
        </div>

        <div className="text-center mb-10 relative z-10">
          <div className="inline-block p-4 border-2 border-news-accent rounded-full mb-6 bg-paper">
            <Newspaper size={40} className="text-news-accent" />
          </div>
          <h1 className="text-4xl font-serif mb-2 text-ink uppercase tracking-tighter">Member Access</h1>
          <p className="font-serif italic text-lg text-ink/60">Authentication required for full access</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-4 bg-news-accent text-paper text-sm font-serif italic border-l-4 border-love-deep shadow-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4">
          {!showEmailLogin ? (
            <>
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-between border-2 border-ink bg-paper px-6 py-4 hover:bg-ink hover:text-paper transition-all group shadow-sm"
              >
                <span className="flex items-center gap-3 font-bold uppercase tracking-widest text-xs">
                  <Mail size={18} className="text-news-accent" /> Google Login
                </span>
                <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => setShowEmailLogin(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-ink bg-ink text-paper py-4 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-md mt-4"
              >
                <Lock size={16} /> Admin/Email Login
              </button>
            </>
          ) : (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleEmailAuth} 
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="font-serif italic text-sm border-b border-ink/10 pb-2">
                  {isSignUp ? "Register Private Account" : "Access Editorial Records"}
                </h2>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Email Address</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@bluesate.com"
                    className="w-full border-2 border-ink bg-paper/50 pl-10 pr-4 py-3 font-serif focus:outline-none focus:border-news-accent focus:bg-paper transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Passphrase</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border-2 border-ink bg-paper/50 pl-10 pr-4 py-3 font-serif focus:outline-none focus:border-news-accent focus:bg-paper transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-news-accent text-paper py-4 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <div className="animate-spin border-2 border-paper/30 border-t-paper rounded-full w-4 h-4" /> : <LogIn size={16} />}
                {isSignUp ? 'Create Credentials' : 'Authenticate Account'}
              </button>

              <div className="flex flex-col gap-4 text-center">
                <button 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[10px] font-bold uppercase tracking-widest text-news-accent hover:underline hover:opacity-100 transition-opacity"
                >
                  {isSignUp ? 'Already a member? Login here' : 'New here? Register credentials'}
                </button>

                <button 
                  type="button"
                  onClick={() => {
                    setShowEmailLogin(false);
                    setIsSignUp(false);
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity border-t border-ink/5 pt-4"
                >
                  Return to GUEST Options
                </button>
              </div>
            </motion.form>
          )}
          
          <p className="text-center text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 leading-relaxed pt-6">
            By proceeding, you agree to the journalistic integrity standards of the Gazette.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-ink/10 text-center">
          <p className="font-serif italic text-sm opacity-60">
            "Your story matters, but security matters more."
          </p>
        </div>
      </motion.div>
    </div>
  );
}
