import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WrappedData } from '../types.ts';
import Slide from './Slide.tsx';
import { G_KEYWORD, G_BODY } from '../constants.tsx';
import { Share2 } from 'lucide-react';

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
  const pressStartTimeRef = useRef<number>(0);

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

  const handlePointerDown = (e: React.PointerEvent) => {
    pressStartTimeRef.current = Date.now();
    setIsPaused(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsPaused(false);
    const duration = Date.now() - pressStartTimeRef.current;
    
    // Si fue un toque corto (menos de 250ms), navegamos
    if (duration < 250) {
      const { clientX } = e;
      const { innerWidth } = window;
      const threshold = innerWidth * 0.3; // 30% izquierdo para retroceder

      if (clientX < threshold) {
        if (currentSlide > 0) {
          setCurrentSlide(prev => prev - 1);
          setProgress(0);
        }
      } else {
        if (currentSlide < totalSlides - 1) {
          setCurrentSlide(prev => prev + 1);
          setProgress(0);
        }
      }
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
        logging: false
      });
      
      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) return;
        const file = new File([blob], `zaple-wrapped-${firstName}.png`, { type: 'image/png' });
        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: 'Mi Zaple Wrapped 2025',
            text: '¡Mira mi año en Zaple! 🚀'
          });
        }
      });
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  };

  const formatNum = (n: number) => new Intl.NumberFormat('es-AR').format(n);

  // Animación común para todos los títulos
  const titleAnim = {
    initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  } as const;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden font-urbanist">
      <div 
        className="relative w-full h-full max-w-[450px] bg-black overflow-hidden shadow-2xl touch-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        
        {/* Progress Bars */}
        <div className="absolute top-6 left-4 right-4 z-[130] flex gap-1 px-1">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                animate={{ 
                  width: i < currentSlide ? '100%' : i === currentSlide ? `${progress}%` : '0%',
                  opacity: isPaused && i === currentSlide ? 0.4 : 1
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          ))}
        </div>

        <div className="relative w-full h-full">
          
          {/* SLIDE 0: Intro Animation 2025 */}
          <Slide isActive={currentSlide === 0}>
            <div className="relative h-full flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden pointer-events-none">
                    <span className="text-[25rem] font-jakarta font-black text-white/5 italic animate-2025">2025</span>
                </div>
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1.2 }}
                    className="relative z-20 flex flex-col items-center gap-8"
                >
                    <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#9A5BFF] shadow-[0_0_80px_rgba(154,91,255,0.3)]">
                        <img src={data.influencerPhoto} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                        <motion.h2 {...titleAnim} className="text-4xl font-jakarta font-black italic">¡Hola {firstName}!</motion.h2>
                        <p className="text-xl font-urbanist text-[#89D0D4] font-bold mt-2">Llegó tu Zaple Wrapped 2025</p>
                    </div>
                </motion.div>
            </div>
          </Slide>

          {/* SLIDE 1: Contexto */}
          <Slide isActive={currentSlide === 1}>
            <div className="text-center space-y-8 px-8">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="text-8xl">✨</motion.div>
                <motion.h2 {...titleAnim} className="text-3xl font-jakarta font-extrabold leading-tight">
                    2025 fue un año <span className={G_KEYWORD}>increíble</span>.
                </motion.h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                    Acá van algunos números de lo que <span className="text-white font-bold underline decoration-[#9A5BFF]">logramos juntos.</span>
                </p>
            </div>
          </Slide>

          {/* SLIDE 2: Título Trabajaste Duro */}
          <Slide isActive={currentSlide === 2}>
            <div className="text-center space-y-6">
                <div className="text-9xl mb-4">⚡</div>
                <motion.h2 {...titleAnim} className="text-5xl font-jakarta font-black italic uppercase leading-none">
                    ¡TRABAJASTE <br/><span className={G_KEYWORD}>DURO!</span>
                </motion.h2>
            </div>
          </Slide>

          {/* SLIDE 3: Stats Trabajaste Duro */}
          <Slide isActive={currentSlide === 3}>
            <div className="space-y-6 px-6">
              <div className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10">
                <p className="text-xs font-bold text-[#89D0D4] uppercase tracking-widest mb-2 text-center">Contenido Creado</p>
                <p className="text-6xl font-jakarta font-black text-white leading-none text-center">{formatNum(data.totalMinutes)}</p>
                <p className="text-xl font-jakarta font-bold text-gray-400 text-center">minutos de video</p>
              </div>
              <div className="p-8 bg-[#330086]/20 backdrop-blur-md rounded-[2.5rem] border border-[#9A5BFF]/20">
                <p className="text-xs font-bold text-[#FF00E5] uppercase tracking-widest mb-2 text-center">Con Zaple publicaste</p>
                <p className="text-6xl font-jakarta font-black text-white leading-none text-center">{data.totalVideos}</p>
                <p className="text-xl font-jakarta font-bold text-gray-400 text-center">videos increíbles</p>
              </div>
            </div>
          </Slide>

          {/* SLIDE 4: Título Llegamos Lejos */}
          <Slide isActive={currentSlide === 4}>
            <div className="text-center space-y-6">
                <div className="text-9xl mb-4">🚀</div>
                <motion.h2 {...titleAnim} className="text-5xl font-jakarta font-black italic uppercase leading-none">
                    ¡LLEGAMOS <br/><span className={G_KEYWORD}>LEJOS!</span>
                </motion.h2>
            </div>
          </Slide>

          {/* SLIDE 5: Stats Views */}
          <Slide isActive={currentSlide === 5}>
            <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-8">
               <div className="w-full flex flex-col items-center">
                  <motion.p 
                    initial={{ scale: 0.5, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ duration: 0.8 }} 
                    className="text-[clamp(4.5rem,14vw,6rem)] font-jakarta font-black leading-none text-center w-full break-all"
                  >
                    {formatNum(data.totalViews)}
                  </motion.p>
                  <p className="text-lg font-urbanist font-bold text-[#46DEFF] tracking-[0.3em] uppercase mt-4">Views Totales</p>
               </div>
               <p className="text-xl font-urbanist italic px-10 leading-tight text-gray-400">
                  <span className={G_BODY}>"{getComparison(data.totalViews)}"</span>
               </p>
            </div>
          </Slide>

          {/* SLIDE 6: Título Comentarios */}
          <Slide isActive={currentSlide === 6}>
            <div className="text-center space-y-6">
                <div className="text-9xl mb-4">💬</div>
                <motion.h2 {...titleAnim} className="text-5xl font-jakarta font-black italic uppercase leading-none">
                    DISTE DE <br/><span className={G_KEYWORD}>QUÉ HABLAR</span>
                </motion.h2>
            </div>
          </Slide>

          {/* SLIDE 7: Stats Comentarios */}
          <Slide isActive={currentSlide === 7}>
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 px-4">
              <div className="w-full flex flex-col items-center">
                <motion.p 
                  initial={{ scale: 0.5, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  transition={{ duration: 0.8 }} 
                  className="text-[clamp(6rem,18vw,8.5rem)] font-jakarta font-black leading-none text-center w-full"
                >
                  {formatNum(data.totalComments)}
                </motion.p>
                <p className="text-lg font-urbanist font-bold text-[#FF00E5] uppercase tracking-[0.4em] mt-4">Comentarios</p>
              </div>
              <p className="text-xl text-gray-400 italic px-10">¡Qué tertulia! Hubo de todo un poco...</p>
            </div>
          </Slide>

          {/* SLIDE 8: Apoyo */}
          <Slide isActive={currentSlide === 8}>
            <div className="space-y-6 px-6">
              <motion.h2 {...titleAnim} className="text-2xl font-jakarta font-black uppercase tracking-tight ml-2">MUCHO <span className={G_KEYWORD}>APOYO ❤️</span></motion.h2>
              <div className="space-y-4">
                {data.supportiveComments.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <img src={c.profilePic} className="w-12 h-12 rounded-full object-cover border-2 border-[#89D0D4]" />
                    <p className="text-sm text-gray-300 italic flex-1">"{c.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </Slide>

          {/* SLIDE 9: Raros */}
          <Slide isActive={currentSlide === 9}>
            <div className="space-y-6 px-6">
              <motion.h2 {...titleAnim} className="text-2xl font-jakarta font-black uppercase tracking-tight ml-2">Y ALGUNOS <span className={G_KEYWORD}>QUE... 🤌🏻</span></motion.h2>
              <div className="space-y-4">
                {data.weirdComments.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <img src={c.profilePic} className="w-12 h-12 rounded-full object-cover border-2 border-[#FF00E5]" />
                    <p className="text-sm text-gray-300 italic flex-1">"{c.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </Slide>

          {/* SLIDE 10: Likes */}
          <Slide isActive={currentSlide === 10}>
            <div className="flex flex-col items-center justify-center text-center h-full space-y-10 px-4">
               <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-9xl drop-shadow-[0_0_30px_rgba(255,0,229,0.5)]">❤️</motion.div>
               <div>
                  <h2 className="text-7xl font-jakarta font-black leading-none">{formatNum(data.totalLikes)}</h2>
                  <p className="text-xl font-urbanist font-bold text-[#9A5BFF] uppercase tracking-[0.2em] mt-2">Corazones</p>
               </div>
               <p className="text-lg text-gray-400 font-urbanist max-w-[280px]">La gente señaló con un corazón que les volaste la cabeza.</p>
            </div>
          </Slide>

          {/* SLIDE 11: Top Videos Intro */}
          <Slide isActive={currentSlide === 11}>
            <div className="text-center space-y-8">
               <div className="text-9xl">🏆</div>
               <motion.h2 {...titleAnim} className="text-4xl font-jakarta font-black leading-tight uppercase italic text-center px-4">TUS VIDEOS <br/><span className={G_KEYWORD}>MÁS VISTOS</span></motion.h2>
            </div>
          </Slide>

          {/* SLIDES 12, 13, 14: Top Videos Content */}
          {[0, 1, 2].map((idx) => (
            <Slide key={idx} isActive={currentSlide === 12 + idx}>
              <div className="flex flex-col h-full pt-20 pb-12 space-y-4 px-4">
                <div className="relative flex-1 bg-black rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl">
                   <video src={data.topVideos[idx].videoUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                   <div className="absolute top-0 left-0 w-full p-8 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
                      <h3 className="text-xl font-jakarta font-bold text-white leading-tight">{data.topVideos[idx].title}</h3>
                   </div>
                   <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%]">
                      <div className="grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10">
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Vistas</p>
                          <p className="text-xl font-black text-[#46DEFF]">{formatNum(data.topVideos[idx].views)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Likes</p>
                          <p className="text-xl font-black text-[#FF00E5]">{formatNum(data.topVideos[idx].likes)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Comms</p>
                          <p className="text-xl font-black text-[#89D0D4]">{formatNum(data.topVideos[idx].comments)}</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </Slide>
          ))}

          {/* SLIDE 15: Final Summary */}
          <Slide isActive={currentSlide === 15}>
            <div className="flex flex-col h-full justify-between py-12 px-6">
              
              <div ref={summaryRef} className="relative p-1 bg-gradient-to-tr from-[#FF00E5] to-[#46DEFF] rounded-[3.5rem] shadow-2xl mt-12">
                <div className="bg-black rounded-[3.4rem] p-8 pt-10 flex flex-col items-center">
                  
                  <div className="flex items-center gap-1 mb-8">
                     <div className="w-4 h-4 bg-gradient-to-tr from-[#FF00E5] to-[#46DEFF] rounded-sm rotate-12" />
                     <span className="font-jakarta font-black tracking-tighter text-xs uppercase">Zaple Wrapped</span>
                  </div>

                  <img src={data.influencerPhoto} className="w-32 h-32 rounded-full object-cover border-4 border-black -mt-24 shadow-2xl relative z-20 mb-4" />
                  
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-jakarta font-black text-white">{firstName}</h3>
                    <p className="text-[#89D0D4] font-bold text-xs uppercase tracking-[0.2em] mt-1">Tu año en Zaple</p>
                  </div>

                  <div className="w-full space-y-4 py-4 border-y border-white/10">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Views</span>
                      <span className="font-black text-2xl text-[#46DEFF]">{formatNum(data.totalViews)}</span>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Likes</span>
                      <span className="font-black text-2xl text-[#FF00E5]">{formatNum(data.totalLikes)}</span>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Minutos</span>
                      <span className="font-black text-2xl text-[#9A5BFF]">{formatNum(data.totalMinutes)}</span>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Videos</span>
                      <span className="font-black text-2xl text-[#89D0D4]">{data.totalVideos}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
                className="w-full py-5 bg-white text-black font-jakarta font-black rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
              >
                <Share2 size={24} /> COMPARTIR MI WRAPPED
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