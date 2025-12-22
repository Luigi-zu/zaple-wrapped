
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WrappedData } from '../types.ts';
import Slide from './Slide.tsx';
import { G_KEYWORD, G_BODY } from '../constants.tsx';
import { Share2, Sparkles, TrendingUp, MessageCircle, Heart, Play, Award, Clock, Video } from 'lucide-react';

interface WrappedViewerProps {
  data: WrappedData;
  onRestart: () => void;
}

const WrappedViewer: React.FC<WrappedViewerProps> = ({ data, onRestart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Clientes que no deben ver la slide de engagement
  const CLIENTS_WITHOUT_ENGAGEMENT = ['streamsetlatam', 'melinamasnatta', 'carodubi', 'cacique', 'joancwaik'];
  const shouldShowEngagement = !CLIENTS_WITHOUT_ENGAGEMENT.includes((data.clientName || '').toLowerCase());
  
  // Ajustar total de slides según si mostramos engagement
  const totalSlides = shouldShowEngagement ? 17 : 16;
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
    
    if (duration < 250) {
      const { clientX } = e;
      const { innerWidth } = window;
      const threshold = innerWidth * 0.3;

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
    const target = summaryRef.current;
    if (!target) return;
    try {
      // Esperar a que las fuentes se carguen
      await document.fonts.ready;
      
      const imgs = Array.from(target.querySelectorAll('img')) as HTMLImageElement[];
      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                const done = () => resolve();
                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', done, { once: true });
              })
        )
      );

      // Pequeño delay para asegurar que todo esté renderizado
       await new Promise(resolve => setTimeout(resolve, 1000));

      // @ts-ignore
      const canvas = await html2canvas(target, {
        backgroundColor: '#000000',
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        removeContainer: true,
        windowWidth: target.scrollWidth,
        windowHeight: target.scrollHeight,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        onclone: (doc) => {
          const elements = doc.querySelectorAll('p, span, h3');
          elements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.position = 'relative';
              el.style.top = '-6px';
            }
          });
        }
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

  const titleAnim = {
    initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  } as const;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden font-urbanist">
      <div 
        ref={summaryRef}
        className="relative w-full h-full max-w-[450px] bg-black overflow-hidden shadow-2xl touch-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        
        <div className="absolute top-6 left-4 right-4 z-[130] flex gap-1 px-1" data-html2canvas-ignore>
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
          
          {/* 0: Intro Animation 2025 */}
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
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#9A5BFF] to-[#46DEFF] blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative w-64 h-64 rounded-full overflow-hidden border-[6px] border-transparent bg-gradient-to-tr from-[#9A5BFF] to-[#46DEFF] bg-clip-padding p-1">
                            <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                <img src={data.influencerPhoto} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                    <div className="text-center relative z-20">
                        <motion.h2 {...titleAnim} className="text-5xl font-jakarta font-black italic tracking-tight">
                            ¡Hola <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9A5BFF] to-[#46DEFF]">{firstName}!</span>
                        </motion.h2>
                        <p className="text-xl font-urbanist text-white/80 font-medium mt-3 tracking-wide">Llegó tu <span className="font-bold text-white">Zaple Wrapped</span> 2025</p>
                    </div>
                </motion.div>
            </div>
          </Slide>

          {/* 1: Contexto */}
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

          {/* 2: Título Trabajaste Duro */}
          <Slide isActive={currentSlide === 2}>
            <div className="text-center space-y-6">
                <div className="text-9xl mb-4">⚡</div>
                <motion.h2 {...titleAnim} className="text-5xl font-jakarta font-black italic uppercase leading-none">
                    ¡TRABAJASTE <br/><span className={G_KEYWORD}>DURO!</span>
                </motion.h2>
            </div>
          </Slide>

          {/* 3: Stats Trabajaste Duro */}
          <Slide isActive={currentSlide === 3}>
            <div className="space-y-6 px-6 w-full">
              <div className="p-8 bg-gradient-to-br from-[#330086]/40 to-[#330086]/10 backdrop-blur-xl rounded-[2.5rem] border border-[#9A5BFF]/30 shadow-lg relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF00E5]/20 rounded-full blur-3xl -ml-16 -mb-16"></div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Video size={16} className="text-[#FF00E5]" />
                  <p className="text-xs font-bold text-[#FF00E5] uppercase tracking-widest text-center relative z-10">Con Zaple publicaste</p>
                </div>
                <p className="text-7xl font-jakarta font-black text-white leading-none text-center tracking-tighter my-2 relative z-10">{data.totalVideos}</p>
                <p className="text-lg font-urbanist font-medium text-gray-400 text-center relative z-10">videos increíbles</p>
              </div>
              <div className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#89D0D4]/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock size={16} className="text-[#89D0D4]" />
                  <p className="text-xs font-bold text-[#89D0D4] uppercase tracking-widest text-center relative z-10">Contenido Creado</p>
                </div>
                <p className="text-7xl font-jakarta font-black text-white leading-none text-center tracking-tighter my-2 relative z-10">{formatNum(data.totalMinutes * 60)}</p>
                <p className="text-lg font-urbanist font-medium text-gray-400 text-center relative z-10">segundos de contenido</p>
              </div>
            </div>
          </Slide>

          {/* 4: Título Llegamos Lejos */}
          <Slide isActive={currentSlide === 4}>
            <div className="text-center space-y-6">
                <div className="text-9xl mb-4">🚀</div>
                <motion.h2 {...titleAnim} className="text-5xl font-jakarta font-black italic uppercase leading-none">
                    ¡LLEGAMOS <br/><span className={G_KEYWORD}>LEJOS!</span>
                </motion.h2>
            </div>
          </Slide>

          {/* 5: Stats Views (ACHICADO) */}
          <Slide isActive={currentSlide === 5}>
            <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-8">
               <div className="w-full flex flex-col items-center">
                 <p className="text-lg font-urbanist font-bold text-[#46DEFF] tracking-[0.3em] uppercase mt-4">Alcanzaste un total de</p>
                  <motion.p 
                    initial={{ scale: 0.5, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ duration: 0.8 }} 
                    className="text-[clamp(2.5rem,12vw,4rem)] font-jakarta font-black leading-none text-center w-full break-all bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
                  >
                    {formatNum(data.totalViews)}
                  </motion.p>
                  <p className="text-lg font-urbanist font-bold text-[#46DEFF] tracking-[0.3em] uppercase mt-4">Views</p>
               </div>
               <p className="text-xl font-urbanist italic px-10 leading-tight">
                  <span>{data.viewsPhrase}</span>
               </p>
            </div>
          </Slide>

          {/* 6: Título Comentarios */}
          <Slide isActive={currentSlide === 6}>
            <div className="text-center space-y-6">
                <div className="text-9xl mb-4">💬</div>
                <motion.h2 {...titleAnim} className="text-5xl font-jakarta font-black italic uppercase leading-none">
                    DISTE DE <br/><span className={G_KEYWORD}>QUÉ HABLAR</span>
                </motion.h2>
            </div>
          </Slide>

          {/* 7: Stats Comentarios */}
          <Slide isActive={currentSlide === 7}>
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 px-4">
              <div className="w-full flex flex-col items-center">
                <p className="text-lg font-urbanist font-bold text-[#FF00E5] uppercase tracking-[0.4em] mt-4">Tus videos generaron</p>
                <motion.p 
                  initial={{ scale: 0.5, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  transition={{ duration: 0.8 }} 
                  className="text-[clamp(6rem,18vw,8.5rem)] font-jakarta font-black leading-none text-center w-full bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
                >
                  {formatNum(data.totalComments)}
                </motion.p>
                <p className="text-lg font-urbanist font-bold text-[#FF00E5] uppercase tracking-[0.4em] mt-4">Comentarios</p>
              </div>
              <p className="text-xl text-gray-400 italic px-10">¡Qué tertulia! veamos algunos ...</p>
            </div>
          </Slide>

          {/* 8: Apoyo */}
          <Slide isActive={currentSlide === 8}>
            <div className="space-y-6 px-6 w-full">
              <motion.h2 {...titleAnim} className="text-2xl font-jakarta font-black uppercase tracking-tight ml-2">MUCHO <span className={G_KEYWORD}>APOYO ❤️</span></motion.h2>
              <div className="space-y-4">
                {data.supportiveComments.slice(0, 3).map((c, i) => (
                  <motion.div 
                    key={c.id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + (i * 0.2), duration: 0.5 }}
                    className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm"
                  >
                    <img src={c.profilePic} className="w-12 h-12 rounded-full object-cover border-2 border-[#89D0D4]" />
                    <div className="flex-1">
                      <p className="text-md font-bold text-[#89D0D4] mb-1">@{c.username}</p>
                      <p className="text-xl text-gray-300 italic">"{c.text}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Slide>



          {/* 10: Likes */}
          <Slide isActive={currentSlide === 9}>
            <div className="flex flex-col items-center justify-center text-center h-full space-y-10 px-4">
               <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-9xl drop-shadow-[0_0_30px_rgba(255,0,229,0.5)]">❤️</motion.div>
               <div>
                  <p className="text-xl font-urbanist font-bold text-[#9A5BFF] uppercase tracking-[0.2em] mt-2">Recibiste</p>
                  <h2 className="text-7xl font-jakarta font-black leading-none bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">{formatNum(data.totalLikes)}</h2>
                  <p className="text-xl font-urbanist font-bold text-[#9A5BFF] uppercase tracking-[0.2em] mt-2">Likes</p>
               </div>
               <p className="text-lg text-gray-400 font-urbanist max-w-[280px]">La gente señaló con un corazón que les volaste la cabeza.</p>
            </div>
          </Slide>

          {/* 11: Engagement */}
          {shouldShowEngagement && (
            <Slide isActive={currentSlide === 10}>
              <div className="flex flex-col items-center justify-center h-full text-center px-6 space-y-8">
                <div className="text-9xl mb-2">🔥</div>
                <motion.h2 {...titleAnim} className="text-4xl font-jakarta font-black italic uppercase leading-none">
                  TU ENGAGEMENT <br/><span className={G_KEYWORD}>FUE BRUTAL</span>
                </motion.h2>
                <div className="w-full max-w-[350px] space-y-4 mt-6">
                  <div className="relative p-8 bg-gradient-to-br from-[#9A5BFF]/20 to-[#46DEFF]/20 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#46DEFF]/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <p className="text-xs font-bold text-[#46DEFF] uppercase tracking-widest mb-3">Tasa de Engagement</p>
                      <p className="text-7xl font-jakarta font-black text-white leading-none tracking-tighter">
                        {((data.totalLikes + data.totalComments) / data.totalViews * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-400 mt-3 font-urbanist">(Likes + Comentarios) / Views</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="text-lg text-gray-300 italic px-4 leading-tight">
                      El valor de referencia suele ser <span className="text-white font-bold">1%</span>
                    </p>
                    <p>😉</p>
                  </div>
                </div>
              </div>
            </Slide>
          )}

          {/* 12: Top Videos Intro */}
          <Slide isActive={currentSlide === (shouldShowEngagement ? 11 : 10)}>
            <div className="text-center space-y-8">
               <div className="text-9xl">🏆</div>
               <motion.h2 {...titleAnim} className="text-4xl font-jakarta font-black leading-tight uppercase italic text-center px-4">TUS VIDEOS <br/><span className={G_KEYWORD}>MÁS VISTOS</span></motion.h2>
            </div>
          </Slide>

          {/* SLIDES 13, 14, 15: Top Videos Content */}
          {[0, 1, 2].map((idx) => (
            <Slide key={idx} isActive={currentSlide === (shouldShowEngagement ? 12 + idx : 11 + idx)}>
              <div className="flex flex-col h-full pt-20 pb-12 space-y-4 px-4">
                <div className="relative flex-1 bg-black rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl">
                   <video src={data.topVideos[idx].videoUrl} className="w-full h-full object-cover" autoPlay loop playsInline />
                   <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%]">
                      <div className="grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/10">
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Vistas</p>
                          <p className="text-lg font-black text-[#46DEFF]">{formatNum(data.topVideos[idx].views)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Likes</p>
                          <p className="text-lg font-black text-[#FF00E5]">{formatNum(data.topVideos[idx].likes)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Comms</p>
                          <p className="text-lg font-black text-[#89D0D4]">{formatNum(data.topVideos[idx].comments)}</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </Slide>
          ))}

          {/* 15: Agradecimiento */}
          <Slide isActive={currentSlide === (shouldShowEngagement ? 15 : 14)}>
            <div className="flex flex-col items-center justify-center h-full text-center px-6 space-y-10">
              <div className="space-y-6 max-w-sm">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-2xl font-urbanist leading-relaxed"
                >
                  Estos son solo los números pero detrás de eso...
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="py-4"
                >
                  <p className="text-3xl font-jakarta font-black mb-3">
                    <span className="text-3xl">💡</span>
                    <span className="bg-gradient-to-r from-[#46DEFF] to-[#9A5BFF] bg-clip-text text-transparent"> Encendiste ideas</span>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="py-4"
                >
                  <p className="text-3xl font-jakarta font-black mb-3">
                    <span className="text-3xl">💓</span>
                    <span className="bg-gradient-to-r from-[#FF00E5] to-[#46DEFF] bg-clip-text text-transparent"> Despertaste emociones</span>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="py-4"
                >
                  <p className="text-3xl font-jakarta font-black mb-3">
                    <span className="text-3xl">😯</span>
                    <span className="bg-gradient-to-r from-[#9A5BFF] to-[#FF00E5] bg-clip-text text-transparent"> Inspiraste personas</span>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="pt-6 border-t border-white/20"
                >
                  <p className="text-2xl font-urbanist pt-4">
                    ¡¡Brindamos por eso!! 🥂
                  </p>
                
                </motion.div>
              </div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.3 }}
              >
                <p className="text-3xl font-jakarta font-black mb-3 flex flex-col">
                  <span className={`text-4xl font-jakarta font-black italic ${G_KEYWORD}`}>¡Vamos por más!</span>
                  <span className="text-4xl"> 🚀</span>
                </p>
              </motion.p>
            </div>
          </Slide>

          {/* 16: Final Summary */}
          <Slide isActive={currentSlide === (shouldShowEngagement ? 16 : 15)} isLastSlide={true}>
            <div className="flex flex-col h-full items-center justify-center p-4">
              
              <div className="relative aspect-[9/16] h-full max-h-[75vh] w-auto shadow-2xl mx-auto">
                <div className="w-full h-full bg-[#0A0A0A] rounded-[2.5rem] overflow-hidden border border-white/10 flex flex-col relative">
                  
                  {/* Background Gradients */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(154,91,255,0.2)_0%,transparent_70%)] -mr-32 -mt-32 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(70,222,255,0.2)_0%,transparent_70%)] -ml-32 -mb-32 pointer-events-none"></div>

                  <div className="relative h-full p-6 flex flex-col items-center justify-between z-10">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5">
                        <img src="/z-logo.png" alt="Zaple" className="w-9 h-9 object-contain" />
                        <div className="flex flex-col leading-none">
                          <span className="font-jakarta font-black text-white text-sm tracking-wider">ZAPLE</span>
                          <span className="font-jakarta font-black text-[#46DEFF] text-xs tracking-widest">WRAPPED</span>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-gradient-to-r from-[#9A5BFF]/20 to-[#46DEFF]/20 rounded-full border border-white/20">
                        <span className="text-white font-jakarta font-black text-sm">2025</span>
                      </div>
                    </div>

                    {/* Center Content */}
                    <div className="flex flex-col items-center w-full gap-4 flex-1 justify-center">
                        {/* Profile */}
                        <div className="relative mb-2">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#9A5BFF] to-[#46DEFF] rounded-full blur-md opacity-60"></div>
                          <img src={data.influencerPhoto} className="block w-28 h-28 rounded-full object-cover border-4 border-black relative z-10" />
                            <div className="absolute -bottom-2 -right-2 z-20 bg-white text-black p-1.5 rounded-full border-4 border-black">
                                <Award size={16} fill="black" />
                            </div>
                        </div>
                        
                        <div className="text-center mb-4">
                            <h3 className="text-3xl font-jakarta font-black text-white mb-1">{firstName}</h3>
                            <p className="text-[#89D0D4] font-bold text-xs uppercase tracking-[0.2em] mb-1">¡Feliciataciones!</p>
                            <p className="text-[#89D0D8] font-bold text-xs uppercase tracking-[0.2em]">Este fue tu impacto</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <div className="bg-gradient-to-br from-[#46DEFF]/10 to-[#46DEFF]/5 p-4 rounded-2xl border border-[#46DEFF]/30 flex flex-col items-center justify-center gap-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(70,222,255,0.2)_0%,transparent_70%)] -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="flex items-center gap-1.5 text-[#46DEFF] mb-1 relative z-10">
                                <Play size={14} fill="currentColor" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#46DEFF]">Views</span>
                                </div>
                                <span className="font-jakarta font-black text-xl text-white relative z-10">{formatNum(data.totalViews)}</span>
                            </div>
                            
                            <div className="bg-gradient-to-br from-[#FF00E5]/10 to-[#FF00E5]/5 p-4 rounded-2xl border border-[#FF00E5]/30 flex flex-col items-center justify-center gap-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(255,0,229,0.2)_0%,transparent_70%)] -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="flex items-center gap-1.5 text-[#FF00E5] mb-1 relative z-10">
                                <Heart size={14} fill="currentColor" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF00E5]">Likes</span>
                                </div>
                                <span className="font-jakarta font-black text-xl text-white relative z-10">{formatNum(data.totalLikes)}</span>
                            </div>

                            <div className="bg-gradient-to-br from-[#9A5BFF]/10 to-[#9A5BFF]/5 p-4 rounded-2xl border border-[#9A5BFF]/30 flex flex-col items-center justify-center gap-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(154,91,255,0.2)_0%,transparent_70%)] -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="flex items-center gap-1.5 text-[#9A5BFF] mb-1 relative z-10">
                                <Clock size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A5BFF]">Segundos</span>
                                </div>
                                <span className="font-jakarta font-black text-xl text-white relative z-10">{formatNum(data.totalMinutes * 60)}</span>
                            </div>

                            <div className="bg-gradient-to-br from-[#89D0D4]/10 to-[#89D0D4]/5 p-4 rounded-2xl border border-[#89D0D4]/30 flex flex-col items-center justify-center gap-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(137,208,212,0.2)_0%,transparent_70%)] -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="flex items-center gap-1.5 text-[#89D0D4] mb-1 relative z-10">
                                <MessageCircle size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#89D0D4]">Videos</span>
                                </div>
                                <span className="font-jakarta font-black text-xl text-white relative z-10">{data.totalVideos}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="w-full text-center pt-4 border-t border-white/10">
                      <p className="text-[#89D0D4] text-[11px] font-jakarta font-black uppercase tracking-[0.3em]">zaple-tech.com</p>
                    </div>

                  </div>
                </div>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
                className="w-full max-w-[300px] py-4 mt-8 bg-white text-black font-jakarta font-black rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:shadow-[0_0_50px_rgba(154,91,255,0.7),0_0_80px_rgba(70,222,255,0.5)]"
                data-html2canvas-ignore
              >
                <Share2 size={20} /> COMPARTIR
              </button>
            </div>
          </Slide>
        </div>
      </div>
    </div>
  );
};

export default WrappedViewer;
