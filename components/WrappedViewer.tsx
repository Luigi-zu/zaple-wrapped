import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WrappedData } from '../types.ts';
import Slide from './Slide.tsx';
import { G_KEYWORD, G_BODY } from '../constants.tsx';
import { Share2, Pause } from 'lucide-react';

interface WrappedViewerProps {
  data: WrappedData;
  onRestart: () => void;
}

const WrappedViewer: React.FC<WrappedViewerProps> = ({ data, onRestart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 16;
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const firstName = data.influencerName.split(' ')[0];

  useEffect(() => {
    let timer: number;
    if (!isPaused) {
      timer = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentSlide < totalSlides - 1) {
              setCurrentSlide(currentSlide + 1);
              return 0;
            }
            return 100;
          }
          return prev + 1.2; 
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [currentSlide, isPaused]);

  const handleNext = () => {
    if (isPaused) { setIsPaused(false); return; }
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleShare = async () => {
    if (!summaryRef.current) return;
    try {
      // @ts-ignore
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
      });
      
      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) return;
        const file = new File([blob], `zaple-wrapped-${firstName}.png`, { type: 'image/png' });
        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: 'Mi Zaple Wrapped 2025',
            text: '¡Mira mi año como creador en Zaple! 🚀'
          });
        }
      });
    } catch (err) {
      console.error('Error al capturar:', err);
    }
  };

  const formatNum = (n: number) => new Intl.NumberFormat('es-AR').format(n);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-[450px] bg-black overflow-hidden shadow-2xl">
        
        {/* Progress Bars */}
        <div className="absolute top-6 left-4 right-4 z-[130] flex gap-1.5 px-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                animate={{ width: i < currentSlide ? '100%' : i === currentSlide ? `${progress}%` : '0%' }}
                transition={{ duration: 0.1 }}
              />
            </div>
          ))}
        </div>

        {/* Pausa Visual */}
        <AnimatePresence>
            {isPaused && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-black/50 backdrop-blur-xl p-6 rounded-full pointer-events-none"
                >
                    <Pause size={40} className="text-white fill-white" />
                </motion.div>
            )}
        </AnimatePresence>

        {/* Interaction Areas */}
        <div className="absolute inset-0 z-50 flex">
          <div className="w-1/3 h-full" onClick={handlePrev} />
          <div 
            className="w-2/3 h-full" 
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onClick={(e) => {
              if (e.detail === 1) handleNext(); // Single click for desktop navigation
            }}
          />
        </div>

        <div className="relative w-full h-full">
          
          {/* 0: Intro Reveal */}
          <Slide isActive={currentSlide === 0}>
            <div className="relative h-full flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center z-20 overflow-hidden pointer-events-none">
                    <span className="text-[14rem] font-jakarta font-black text-white/10 italic animate-2025">2025</span>
                </div>
                <motion.div 
                    initial={{ y: 300, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 1 }}
                    className="relative z-10 flex flex-col items-center gap-6"
                >
                    <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-[#9A5BFF] shadow-[0_0_60px_rgba(154,91,255,0.4)]">
                        <img src={data.influencerPhoto} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-4xl font-jakarta font-black italic">¡Hola {firstName}!</h2>
                        <p className="text-lg font-urbanist text-[#89D0D4] font-bold mt-1 tracking-tight">Llegó tu Zaple Wrapped 2025</p>
                    </div>
                </motion.div>
            </div>
          </Slide>

          {/* 1: Contexto */}
          <Slide isActive={currentSlide === 1}>
            <div className="text-center space-y-6 px-10">
                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="text-7xl">✨</motion.div>
                <h2 className="text-2xl font-jakarta font-extrabold leading-tight">
                    2025 fue un año <span className={G_KEYWORD}>increíble</span>.
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                    Acá van algunos números de lo que <span className="text-white font-bold underline decoration-[#9A5BFF]">logramos juntos.</span>
                </p>
            </div>
          </Slide>

          {/* 2: Intro Trabajaste Duro */}
          <Slide isActive={currentSlide === 2}>
            <div className="text-center space-y-4">
                <div className="text-8xl mb-2">⚡</div>
                <h2 className="text-4xl font-jakarta font-black italic uppercase">¡TRABAJASTE <br/><span className={G_KEYWORD}>DURO!</span></h2>
            </div>
          </Slide>

          {/* 3: Stats Minutos/Videos */}
          <Slide isActive={currentSlide === 3}>
            <div className="space-y-4 px-6">
              <div className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10">
                <p className="text-[10px] font-bold text-[#89D0D4] uppercase tracking-widest mb-1">Diste todo</p>
                <p className="text-6xl font-jakarta font-black text-white leading-none">{formatNum(data.totalMinutes)}</p>
                <p className="text-lg font-jakarta font-bold text-gray-400 mt-1">minutos de video</p>
              </div>
              <div className="p-8 bg-[#330086]/20 backdrop-blur-md rounded-[2.5rem] border border-[#9A5BFF]/20">
                <p className="text-[10px] font-bold text-[#FF00E5] uppercase tracking-widest mb-1">Contenido Puro</p>
                <p className="text-6xl font-jakarta font-black text-white leading-none">{data.totalVideos}</p>
                <p className="text-lg font-jakarta font-bold text-gray-400 mt-1">videos publicados</p>
              </div>
            </div>
          </Slide>

          {/* 4, 5, 6: Videos (Movidos aquí por pedido) */}
          {[0, 1, 2].map((idx) => (
            <Slide key={idx} isActive={currentSlide === 4 + idx}>
              <div className="flex flex-col h-full pt-20 pb-10 space-y-4 px-4">
                <div className="relative flex-1 bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                   <video src={data.topVideos[idx].videoUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                   <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
                      <h3 className="text-lg font-jakarta font-bold text-white leading-tight">{data.topVideos[idx].title}</h3>
                   </div>
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%]">
                      <div className="grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-2xl p-5 rounded-[2.2rem] border border-white/10">
                        <div className="text-center">
                          <p className="text-[8px] text-gray-400 uppercase font-black mb-1">Vistas</p>
                          <p className="text-xl font-black text-[#46DEFF]">{formatNum(data.topVideos[idx].views)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] text-gray-400 uppercase font-black mb-1">Likes</p>
                          <p className="text-xl font-black text-[#FF00E5]">{formatNum(data.topVideos[idx].likes)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] text-gray-400 uppercase font-black mb-1">Comms</p>
                          <p className="text-xl font-black text-[#89D0D4]">{formatNum(data.topVideos[idx].comments)}</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </Slide>
          ))}

          {/* 7: Intro Llegamos Lejos */}
          <Slide isActive={currentSlide === 7}>
            <div className="text-center space-y-4">
                <div className="text-8xl mb-2">🚀</div>
                <h2 className="text-4xl font-jakarta font-black italic uppercase">¡LLEGAMOS <br/><span className={G_KEYWORD}>LEJOS!</span></h2>
            </div>
          </Slide>

          {/* 8: Stats Views */}
          <Slide isActive={currentSlide === 8}>
            <div className="text-center px-6">
               <p className="text-[12rem] font-jakarta font-black text-[#46DEFF]/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 leading-none pointer-events-none">VIEWS</p>
               <div className="relative z-10 space-y-6">
                  <p className="text-7xl font-jakarta font-black leading-none">{formatNum(data.totalViews)}</p>
                  <p className="text-lg font-urbanist font-bold text-[#46DEFF] tracking-[0.2em] uppercase">Vistas Totales</p>
                  <p className="text-xl font-urbanist italic text-gray-400 max-w-[280px] mx-auto mt-4 leading-tight">
                    <span className={G_BODY}>"{getComparison(data.totalViews)}"</span>
                  </p>
               </div>
            </div>
          </Slide>

          {/* 9: Intro Comentarios */}
          <Slide isActive={currentSlide === 9}>
            <div className="text-center space-y-4">
                <div className="text-8xl mb-2">💬</div>
                <h2 className="text-4xl font-jakarta font-black italic uppercase leading-none">DISTE DE <br/><span className={G_KEYWORD}>QUÉ HABLAR</span></h2>
            </div>
          </Slide>

          {/* 10: Stats Comentarios */}
          <Slide isActive={currentSlide === 10}>
            <div className="text-center space-y-10">
                <p className="text-8xl font-jakarta font-black leading-none">{formatNum(data.totalComments)}</p>
                <p className="text-lg font-urbanist font-bold text-[#FF00E5] uppercase tracking-[0.4em]">Comentarios</p>
                <p className="text-lg text-gray-400 italic px-12">Fue un año de mucha charla y comunidad activa en tus redes.</p>
            </div>
          </Slide>

          {/* 11: Apoyo */}
          <Slide isActive={currentSlide === 11}>
            <div className="space-y-5 px-6">
              <h2 className="text-xl font-jakarta font-black uppercase tracking-tight ml-1">MUCHO <span className={G_KEYWORD}>APOYO ❤️</span></h2>
              <div className="space-y-3">
                {data.supportiveComments.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <img src={c.profilePic} className="w-12 h-12 rounded-full object-cover border-2 border-[#89D0D4]" />
                    <p className="text-xs text-gray-300 italic flex-1">"{c.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </Slide>

          {/* 12: Raros */}
          <Slide isActive={currentSlide === 12}>
            <div className="space-y-5 px-6">
              <h2 className="text-xl font-jakarta font-black uppercase tracking-tight ml-1">Y ALGUNOS <span className={G_KEYWORD}>QUE... 🤌🏻</span></h2>
              <div className="space-y-3">
                {data.weirdComments.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <img src={c.profilePic} className="w-12 h-12 rounded-full object-cover border-2 border-[#FF00E5]" />
                    <p className="text-xs text-gray-300 italic flex-1">"{c.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </Slide>

          {/* 13: Likes */}
          <Slide isActive={currentSlide === 13}>
            <div className="flex flex-col items-center justify-center text-center space-y-6">
               <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-8xl drop-shadow-[0_0_30px_rgba(255,0,229,0.5)]">❤️</motion.div>
               <div>
                  <h2 className="text-7xl font-jakarta font-black leading-none">{formatNum(data.totalLikes)}</h2>
                  <p className="text-md font-urbanist font-bold text-[#9A5BFF] uppercase tracking-[0.2em] mt-2">Corazones</p>
               </div>
               <p className="text-md text-gray-400 font-urbanist max-w-[240px]">Tu contenido le voló la cabeza (y el corazón) a miles.</p>
            </div>
          </Slide>

          {/* 14: Final Intro */}
          <Slide isActive={currentSlide === 14}>
            <div className="text-center space-y-6">
               <div className="text-8xl">🔥</div>
               <h2 className="text-3xl font-jakarta font-extrabold leading-tight">Y esto es solo <br/><span className={G_KEYWORD}>el principio.</span></h2>
            </div>
          </Slide>

          {/* 15: Final Summary */}
          <Slide isActive={currentSlide === 15}>
            <div className="flex flex-col h-full justify-between pt-24 pb-12 px-6">
              
              <div ref={summaryRef} className="relative p-1 bg-gradient-to-tr from-[#FF00E5] to-[#46DEFF] rounded-[3.2rem] shadow-2xl">
                <div className="bg-black rounded-[3.1rem] p-8 flex flex-col items-center">
                  
                  <div className="flex items-center gap-1 mb-6">
                     <div className="w-4 h-4 bg-gradient-to-tr from-[#FF00E5] to-[#46DEFF] rounded-sm rotate-12" />
                     <span className="font-jakarta font-black tracking-tighter text-[10px] uppercase">Zaple Wrapped</span>
                  </div>

                  <img src={data.influencerPhoto} className="w-28 h-28 rounded-full object-cover border-4 border-black -mt-20 shadow-2xl relative z-20 mb-4" />
                  
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-jakarta font-black text-white leading-none">{firstName}</h3>
                    <p className="text-[#89D0D4] font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Tu año en Zaple</p>
                  </div>

                  <div className="w-full space-y-5 py-4 border-y border-white/10">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Views</span>
                      <span className="font-black text-2xl text-[#46DEFF]">{formatNum(data.totalViews)}</span>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Likes</span>
                      <span className="font-black text-2xl text-[#FF00E5]">{formatNum(data.totalLikes)}</span>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Videos</span>
                      <span className="font-black text-2xl text-[#89D0D4]">{data.totalVideos}</span>
                    </div>
                  </div>
                  
                  <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.4em] mt-6">Zaple Creator Network 2025</p>
                </div>
              </div>

              <button onClick={handleShare} className="w-full py-5 bg-white text-black font-jakarta font-black rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl z-[100]">
                <Share2 size={24} /> COMPARTIR
              </button>
            </div>
          </Slide>
        </div>
      </div>
    </div>
  );
};

function getComparison(views: number) {
    if (views > 1000000) return `¡Llenaste ${Math.round(views/80000)} estadios de River! 🏟️`;
    if (views > 50000) return `¡Es como llenar la Bombonera entera! 🏟️`;
    if (views > 10000) return `¡Es una multitud increíble de gente! 🚀`;
    return `¡Una comunidad fiel siguiendo tus pasos! 🚀`;
}

export default WrappedViewer;