
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WrappedData } from '../types.ts';
import Slide from './Slide.tsx';
import { G_KEYWORD, G_BODY } from '../constants.tsx';
import { Share2, Heart, Pause, Play } from 'lucide-react';

interface WrappedViewerProps {
  data: WrappedData;
  onRestart: () => void;
}

const WrappedViewer: React.FC<WrappedViewerProps> = ({ data, onRestart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 16;
  const slideDuration = 6000;
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Solo el primer nombre
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
          return prev + 1.5; // Ajuste de velocidad
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [currentSlide, isPaused]);

  const handleNext = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPaused) {
        setIsPaused(false);
        return;
    }
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
      setProgress(0);
    }
  };

  const handlePrev = (e: React.MouseEvent | React.TouchEvent) => {
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
        } else {
          // Fallback descarga
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `zaple-wrapped-${firstName}.png`;
          a.click();
        }
      });
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  };

  const formatNum = (n: number) => new Intl.NumberFormat('es-AR').format(n);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-[450px] bg-black md:shadow-2xl md:rounded-[3rem] overflow-hidden">
        
        {/* Progress Bars */}
        <div className="absolute top-6 left-4 right-4 z-[100] flex gap-1 px-2">
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

        {/* Overlay de Pausa Visual */}
        <AnimatePresence>
            {isPaused && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[150] bg-black/40 backdrop-blur-md p-4 rounded-full pointer-events-none"
                >
                    <Pause size={48} className="text-white fill-white" />
                </motion.div>
            )}
        </AnimatePresence>

        {/* Interaction Areas */}
        <div className="absolute inset-0 z-50 flex">
          <div 
            className="w-1/3 h-full" 
            onClick={handlePrev}
          />
          <div 
            className="w-2/3 h-full" 
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onClick={(e) => {
                // Si es desktop (mouse), toggle pausa en vez de solo hold
                if (e.nativeEvent instanceof MouseEvent) {
                    // Solo si no fue un "drag" o hold largo
                }
            }}
          >
            <div className="w-full h-full" onClick={handleNext} />
          </div>
        </div>

        <div className="relative w-full h-full">
          
          {/* SLIDE 0: Intro Animation 2025 */}
          <Slide isActive={currentSlide === 0}>
            <div className="relative h-full flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden">
                    <span className="text-[12rem] font-jakarta font-black text-white/10 italic animate-2025">2025</span>
                </div>
                <motion.div 
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="relative z-10 flex flex-col items-center gap-6"
                >
                    <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#9A5BFF] shadow-[0_0_50px_rgba(154,91,255,0.3)]">
                        <img src={data.influencerPhoto} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-4xl font-jakarta font-black italic">¡Hola {firstName}!</h2>
                        <p className="text-xl font-urbanist text-[#89D0D4] font-bold">Llegó tu Zaple Wrapped 2025</p>
                    </div>
                </motion.div>
            </div>
          </Slide>

          {/* SLIDE 1: Contexto */}
          <Slide isActive={currentSlide === 1}>
            <div className="text-center space-y-8 px-6">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="text-8xl">✨</motion.div>
                <h2 className="text-3xl font-jakarta font-extrabold leading-tight">
                    2025 fue un año <span className={G_KEYWORD}>increíble</span>.
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                    Acá van algunos números de lo que <span className="text-white font-bold underline decoration-[#9A5BFF]">logramos juntos.</span>
                </p>
            </div>
          </Slide>

          {/* SLIDE 2: Título Trabajaste Duro */}
          <Slide isActive={currentSlide === 2}>
            <div className="text-center space-y-6">
                <div className="text-9xl mb-4">⚡</div>
                <h2 className="text-5xl font-jakarta font-black italic uppercase leading-none">
                    ¡TRABAJASTE <br/><span className={G_KEYWORD}>DURO!</span>
                </h2>
            </div>
          </Slide>

          {/* SLIDE 3: Stats Trabajaste Duro */}
          <Slide isActive={currentSlide === 3}>
            <div className="space-y-6 px-4">
              <div className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10">
                <p className="text-xs font-bold text-[#89D0D4] uppercase tracking-widest mb-2">Contenido Creado</p>
                <p className="text-7xl font-jakarta font-black text-white leading-none">{formatNum(data.totalMinutes)}</p>
                <p className="text-xl font-jakarta font-bold text-gray-400">minutos de video</p>
              </div>
              <div className="p-8 bg-[#330086]/20 backdrop-blur-md rounded-[2.5rem] border border-[#9A5BFF]/20">
                <p className="text-xs font-bold text-[#FF00E5] uppercase tracking-widest mb-2">Con Zaple publicaste</p>
                <p className="text-7xl font-jakarta font-black text-white leading-none">{formatNum(data.totalVideos)}</p>
                <p className="text-xl font-jakarta font-bold text-gray-400">videos increíbles</p>
              </div>
            </div>
          </Slide>

          {/* SLIDE 4: Título Llegamos Lejos */}
          <Slide isActive={currentSlide === 4}>
            <div className="text-center space-y-6">
                <div className="text-9xl mb-4">🚀</div>
                <h2 className="text-5xl font-jakarta font-black italic uppercase leading-none">
                    ¡LLEGAMOS <br/><span className={G_KEYWORD}>LEJOS!</span>
                </h2>
            </div>
          </Slide>

          {/* SLIDE 5: Stats Views */}
          <Slide isActive={currentSlide === 5}>
            <div className="text-center space-y-10 px-4">
               <div className="relative inline-block">
                  <div className="absolute inset-0 bg-[#46DEFF]/20 blur-3xl rounded-full" />
                  <p className="text-8xl font-jakarta font-black relative z-10 leading-none">{formatNum(data.totalViews)}</p>
                  <p className="text-xl font-urbanist font-bold text-[#46DEFF] tracking-[0.3em] uppercase mt-2">Views Totales</p>
               </div>
               <p className="text-2xl font-urbanist italic px-6 leading-tight text-gray-300">
                  <span className={G_BODY}>"{getComparison(data.totalViews)}"</span>
               </p>
            </div>
          </Slide>

          {/* SLIDE 6: Título Comentarios */}
          <Slide isActive={currentSlide === 6}>
            <div className="text-center space-y-6">
                <div className="text-9xl mb-4">💬</div>
                <h2 className="text-5xl font-jakarta font-black italic uppercase leading-none">
                    DISTE DE <br/><span className={G_KEYWORD}>QUÉ HABLAR</span>
                </h2>
            </div>
          </Slide>

          {/* SLIDE 7: Stats Comentarios */}
          <Slide isActive={currentSlide === 7}>
            <div className="text-center space-y-12">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FF00E5]/10 blur-3xl rounded-full" />
                <p className="text-[10rem] font-jakarta font-black relative z-10 leading-none">{formatNum(data.totalComments)}</p>
                <p className="text-xl font-urbanist font-bold text-[#FF00E5] uppercase tracking-[0.4em] mt-4">Comentarios</p>
              </div>
              <p className="text-xl text-gray-400 italic px-10">¡Qué tertulia! Hubo de todo un poco en tu comunidad...</p>
            </div>
          </Slide>

          {/* SLIDE 8: Apoyo */}
          <Slide isActive={currentSlide === 8}>
            <div className="space-y-6 px-4">
              <h2 className="text-2xl font-jakarta font-black uppercase tracking-tight ml-2">MUCHO <span className={G_KEYWORD}>APOYO ❤️</span></h2>
              <div className="space-y-3">
                {data.supportiveComments.map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <img src={c.profilePic} className="w-12 h-12 rounded-full object-cover border-2 border-[#89D0D4]" />
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-[#89D0D4] text-sm">@{c.username}</p>
                      <p className="text-xs text-gray-300 line-clamp-2 italic">"{c.text}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Slide>

          {/* SLIDE 9: Raros */}
          <Slide isActive={currentSlide === 9}>
            <div className="space-y-6 px-4">
              <h2 className="text-2xl font-jakarta font-black uppercase tracking-tight ml-2">Y ALGUNOS <span className={G_KEYWORD}>QUE... 🤌🏻</span></h2>
              <div className="space-y-3">
                {data.weirdComments.map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <img src={c.profilePic} className="w-12 h-12 rounded-full object-cover border-2 border-[#FF00E5]" />
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-[#FF00E5] text-sm">@{c.username}</p>
                      <p className="text-xs text-gray-300 line-clamp-2 italic">"{c.text}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Slide>

          {/* SLIDE 10: Likes */}
          <Slide isActive={currentSlide === 10}>
            <div className="flex flex-col items-center justify-center text-center h-full space-y-8">
               <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="text-8xl drop-shadow-[0_0_30px_rgba(255,0,229,0.5)]">❤️</motion.div>
               <div>
                  <h2 className="text-8xl font-jakarta font-black leading-none">{formatNum(data.totalLikes)}</h2>
                  <p className="text-lg font-urbanist font-bold text-[#9A5BFF] uppercase tracking-[0.2em] mt-2">Likes</p>
               </div>
               <p className="text-lg text-gray-400 font-urbanist max-w-[280px]">Personas señalaron con un corazón que les volaste la cabeza.</p>
            </div>
          </Slide>

          {/* SLIDE 11: Top Videos Intro */}
          <Slide isActive={currentSlide === 11}>
            <div className="text-center space-y-8">
               <div className="text-9xl">🏆</div>
               <h2 className="text-4xl font-jakarta font-black leading-tight uppercase italic">TUS VIDEOS <br/><span className={G_KEYWORD}>MÁS VISTOS</span></h2>
            </div>
          </Slide>

          {/* SLIDES 12, 13, 14: Top Videos Content */}
          {[0, 1, 2].map((idx) => (
            <Slide key={idx} isActive={currentSlide === 12 + idx}>
              <div className="flex flex-col h-full pt-20 pb-10 space-y-4 px-4">
                <div className="relative flex-1 bg-black rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl">
                   <video src={data.topVideos[idx].videoUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                   <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black via-black/40 to-transparent">
                      <h3 className="text-xl font-jakarta font-bold text-white leading-tight">{data.topVideos[idx].title}</h3>
                   </div>
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%]">
                      <div className="grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10">
                        <div className="text-center">
                          <p className="text-[9px] text-gray-400 uppercase font-black mb-1">Vistas</p>
                          <p className="text-lg font-black text-[#46DEFF]">{formatNum(data.topVideos[idx].views)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] text-gray-400 uppercase font-black mb-1">Likes</p>
                          <p className="text-lg font-black text-[#FF00E5]">{formatNum(data.topVideos[idx].likes)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] text-gray-400 uppercase font-black mb-1">Comms</p>
                          <p className="text-lg font-black text-[#89D0D4]">{formatNum(data.topVideos[idx].comments)}</p>
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
              
              {/* Tarjeta para Capturar */}
              <div ref={summaryRef} className="relative p-1.5 bg-gradient-to-tr from-[#FF00E5] to-[#46DEFF] rounded-[3.5rem] shadow-[0_0_60px_rgba(255,0,229,0.2)] mt-8">
                <div className="bg-black rounded-[3.4rem] p-8 pt-12 space-y-6 flex flex-col items-center">
                  
                  {/* Logo Zaple en la tarjeta */}
                  <div className="flex items-center gap-1 mb-2">
                     <div className="w-4 h-4 bg-gradient-to-tr from-[#FF00E5] to-[#46DEFF] rounded-sm rotate-12" />
                     <span className="font-jakarta font-black tracking-tighter text-sm">Zaple Wrapped</span>
                  </div>

                  <img src={data.influencerPhoto} className="w-32 h-32 rounded-full object-cover border-4 border-black -mt-24 shadow-2xl relative z-20" />
                  
                  <div className="text-center">
                    <h3 className="text-3xl font-jakarta font-black text-white">{firstName}</h3>
                    <p className="text-[#89D0D4] font-bold text-xs uppercase tracking-[0.2em] mt-1">Tu año en Zaple</p>
                  </div>

                  <div className="w-full space-y-4 py-2 border-y border-white/5">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-gray-400 font-medium">Vistas Totales</span>
                      <span className="font-black text-2xl text-[#46DEFF]">{formatNum(data.totalViews)}</span>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <span className="text-gray-400 font-medium">Likes Recibidos</span>
                      <span className="font-black text-2xl text-[#FF00E5]">{formatNum(data.totalLikes)}</span>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <span className="text-gray-400 font-medium">Videos Publicados</span>
                      <span className="font-black text-2xl text-[#89D0D4]">{data.totalVideos}</span>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Zaple Creator Network 2025</p>
                </div>
              </div>

              {/* Botón Compartir */}
              <div className="px-2">
                 <button 
                  onClick={handleShare}
                  className="w-full py-5 bg-white text-black font-jakarta font-extrabold rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
                 >
                    <Share2 size={24} /> COMPARTIR EN INSTAGRAM
                 </button>
              </div>
            </div>
          </Slide>
        </div>
      </div>
    </div>
  );
};

function getComparison(views: number) {
    if (views > 1000000) return `¡Es como llenar ${Math.round(views/80000)} veces el Monumental! 🏟️`;
    if (views > 50000) return `¡Es como llenar la Bombonera entera! 🏟️`;
    if (views > 10000) return `¡Es como si todo un estadio de básquet te aplaudiera! 🏀`;
    return `¡Una multitud increíble siguiendo tus pasos! 🚀`;
}

export default WrappedViewer;
