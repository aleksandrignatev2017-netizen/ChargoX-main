import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Tag, 
  Zap, 
  Gamepad2, 
  Layers, 
  Kanban, 
  Music, 
  ShoppingBag, 
  Orbit 
} from 'lucide-react';
import { AppProject } from '../types';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: AppProject[];
  onSelectProject: (project: AppProject) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Game', 'Productivity', 'SaaS', 'Audio/3D', 'E-commerce'];

  const filtered = projects.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case 'Game': return <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Productivity': return <Kanban className="w-3.5 h-3.5 text-indigo-400" />;
      case 'SaaS': return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Audio/3D': return <Orbit className="w-3.5 h-3.5 text-purple-400" />;
      case 'E-commerce': return <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#11141c] border border-[#232838] rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-[#1f2434] flex items-center justify-between shrink-0 bg-[#131722]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-black text-sm shadow-md shadow-cyan-500/20">
              CX
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                ChargoX App Gallery & Templates
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-mono">
                  {projects.length} Templates
                </span>
              </h2>
              <p className="text-xs text-[#8c92a2]">Explore interactive web apps ready to launch, remix, and inspect.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7c8294] hover:text-white hover:bg-[#1f2434] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-[#1f2434] bg-[#0e1118] flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#717686] absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search apps, tags, genres..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#171b26] border border-[#262c3e] text-xs text-white placeholder-[#636878] focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-[#8b91a0] hover:text-white hover:bg-[#1a1f2c]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Apps */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectProject(item);
                onClose();
              }}
              className="group bg-[#141824] hover:bg-[#191e2e] border border-[#22283a] hover:border-cyan-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-lg hover:shadow-cyan-500/5"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1b2132] text-slate-300 border border-[#2a334e]">
                    {getCategoryIcon(item.category)}
                    <span>{item.category || 'General'}</span>
                  </span>
                  <span className="text-[10px] text-[#6b7182] font-mono">{item.createdAt}</span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition mb-1.5">
                  {item.name}
                </h3>
                <p className="text-xs text-[#8e94a6] leading-relaxed line-clamp-2 mb-3">
                  {item.summary}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1f2538] text-xs">
                <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                  <Zap className="w-3 h-3" /> Live Sandbox Ready
                </span>
                <span className="text-white group-hover:text-cyan-300 font-bold flex items-center gap-1 text-xs">
                  Run & Edit <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-16 text-[#717686] text-xs">
              No apps found matching your query. Try a different search term or category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
