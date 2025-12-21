
import React from 'react';
import { CLIENTS_DATA } from '../data/clients.ts';
import { G_KEYWORD } from '../constants.tsx';
import { ChevronRight, Users } from 'lucide-react';

const ClientSelector: React.FC = () => {
  const clients = Object.keys(CLIENTS_DATA);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-jakarta font-black tracking-tighter">
          Zaple <span className={G_KEYWORD}>Wrapped</span>
        </h1>
        <p className="text-gray-400 font-urbanist text-xl flex items-center justify-center gap-2">
          <Users className="text-[#9A5BFF]" size={20} /> Directorio de Talentos 2025
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {clients.map((id) => (
          <a
            key={id}
            href={`?u=${id}`}
            className="group relative bg-[#240040]/20 hover:bg-[#330086]/40 p-6 rounded-[2rem] border border-[#330086]/50 transition-all duration-300 flex items-center justify-between overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF00E5]/10 to-[#46DEFF]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-4 relative z-10">
              <img 
                src={CLIENTS_DATA[id].influencerPhoto} 
                className="w-16 h-16 rounded-full object-cover border-2 border-[#9A5BFF]" 
                alt={id} 
              />
              <div>
                <h3 className="text-xl font-jakarta font-bold text-white">{CLIENTS_DATA[id].influencerName}</h3>
                <p className="text-sm text-[#89D0D4] font-medium tracking-wider uppercase">{id}</p>
              </div>
            </div>
            <ChevronRight className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ClientSelector;
