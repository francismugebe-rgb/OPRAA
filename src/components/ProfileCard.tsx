import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Profile } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ProfileCardProps {
  profile: Profile;
  variant?: 'hero' | 'standard' | 'mini' | 'list';
}

export function ProfileCard({ profile, variant = 'standard' }: ProfileCardProps) {
  const isHero = variant === 'hero';
  const isMini = variant === 'mini';
  const isList = variant === 'list';

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group ${
        isHero ? 'pb-10 border-b-8 border-ink' : 
        isList ? 'border-b border-ink/10 pb-10 flex flex-col md:flex-row gap-8' : 
        isMini ? 'border-b border-ink/10 pb-4 mb-4 flex gap-4' : 
        'pb-8 border-b-2 border-ink/10'
      }`}
    >
      <Link 
        to={`/profile/${profile.id}`} 
        className={`flex ${isHero ? 'flex-col gap-6' : isList ? 'w-full flex-col md:flex-row' : isMini ? 'w-full' : 'flex-col gap-4'}`}
      >
        <div className={`relative overflow-hidden bg-ink/5 flex-shrink-0 ${
          isHero ? 'w-full aspect-[21/9]' : 
          isList ? 'w-full md:w-80 aspect-video' : 
          isMini ? 'w-24 h-24' : 
          'w-full aspect-video'
        }`}>
          {profile.photoUrl ? (
            <img 
              src={profile.photoUrl} 
              alt={profile.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/20 font-serif italic">
              Sketch
            </div>
          )}
          {!isMini && (
            <div className="absolute top-4 left-4 bg-news-accent text-paper px-2 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm">
              {profile.interests[0] || 'Special Report'}
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h2 className={`${
              isHero ? 'text-5xl md:text-8xl' : 
              isMini ? 'text-lg' : 
              isList ? 'text-3xl' : 
              'text-2xl'
            } group-hover:underline leading-[1.1] font-serif font-black uppercase italic tracking-tighter`}>
              {profile.name}, {profile.age}
            </h2>
            <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] mt-2 opacity-50">
              <span className="flex items-center gap-1"><MapPin size={10} /> {profile.city}</span>
              <span className="flex items-center gap-1"><Clock size={10} /> {formatDistanceToNow(profile.createdAt.toDate())} AGO</span>
            </div>
          </div>

          {!isMini && (
            <p className={`font-serif leading-relaxed text-ink/80 ${isHero ? 'text-2xl line-clamp-4 max-w-4xl' : 'text-base line-clamp-3'}`}>
              {profile.bio.length > 250 ? profile.bio.substring(0, 250) + '...' : profile.bio}
            </p>
          )}

          {!isMini && (
            <div className="pt-4 flex gap-2 flex-wrap border-t border-ink/5">
              {profile.interests.slice(0, 3).map(interest => (
                <span key={interest} className="text-[9px] border border-ink/20 px-2 py-0.5 uppercase tracking-widest font-mono italic">
                  {interest}
                </span>
              ))}
              <span className="text-[9px] font-mono uppercase tracking-widest text-news-accent font-bold ml-auto group-hover:translate-x-1 transition-transform">
                Read Edition &rarr;
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
