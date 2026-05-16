import { Newspaper, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-ink text-paper mt-20 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-paper/10 pb-16">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-serif italic border-b border-paper/20 pb-4">OPRA MIXES</h2>
            <p className="font-serif italic text-sm opacity-60 leading-relaxed">
              "Chronicling heartbeats from Johannesburg to Harare. Our mission is the journalistic pursuit of sincere connection."
            </p>
            <div className="flex gap-4">
              <div className="p-2 border border-paper/20 hover:bg-news-accent transition-colors cursor-pointer group">
                <Heart size={18} className="group-hover:fill-current" />
              </div>
              <div className="p-2 border border-paper/20 hover:bg-news-accent transition-colors cursor-pointer">
                <Mail size={18} />
              </div>
              <div className="p-2 border border-paper/20 hover:bg-news-accent transition-colors cursor-pointer">
                <Newspaper size={18} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.3em] mb-6 border-b border-paper/20 pb-2">Regional Editions</h3>
            <ul className="space-y-3 font-serif italic text-sm opacity-70">
              <li className="hover:text-news-accent cursor-pointer transition-colors">Cape Town Chronicle</li>
              <li className="hover:text-news-accent cursor-pointer transition-colors">Harare Daily Times</li>
              <li className="hover:text-news-accent cursor-pointer transition-colors">Joburg Evening Star</li>
              <li className="hover:text-news-accent cursor-pointer transition-colors">Bulawayo Sun</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.3em] mb-6 border-b border-paper/20 pb-2">Editorial</h3>
            <ul className="space-y-3 font-serif italic text-sm opacity-70">
              <li><Link to="/submit" className="hover:text-news-accent transition-colors">Submit a Story</Link></li>
              <li className="hover:text-news-accent cursor-pointer transition-colors">Ethics & Standards</li>
              <li className="hover:text-news-accent cursor-pointer transition-colors">Letter to the Editor</li>
              <li className="hover:text-news-accent cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.3em] mb-6 border-b border-paper/20 pb-2">Newsletter</h3>
            <p className="text-xs font-mono uppercase tracking-widest opacity-40 mb-4 font-bold">The Morning Digest</p>
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS..." 
                className="w-full bg-paper/5 border border-paper/20 px-4 py-2 text-xs font-mono focus:outline-none focus:border-news-accent"
              />
              <button className="w-full bg-news-accent text-paper py-3 font-mono font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity">
                JOIN THE WIRE
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-[0.4em] opacity-40 font-bold">
          <span>&copy; 2026 THE DATING GAZETTE PUBLISHING LTD.</span>
          <span className="flex items-center gap-2 italic">ESTABLISHED IN LOVE • PRINTED IN TRUTH <Newspaper size={12} /></span>
          <div className="flex gap-6">
            <span className="hover:text-news-accent cursor-pointer">TERMS</span>
            <span className="hover:text-news-accent cursor-pointer">PRIVACY</span>
            <span className="hover:text-news-accent cursor-pointer">COOKIES</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
