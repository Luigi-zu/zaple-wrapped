
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WrappedData } from '../types.ts';
import Slide from './Slide.tsx';
import { G_KEYWORD, G_BODY } from '../constants.tsx';
import { Share2, Download, RefreshCcw, Heart, MessageCircle, Play, Home } from 'lucide-react';

interface WrappedViewerProps {
  data: WrappedData;
  onRestart: () => void;
}

const WrappedViewer: React.FC<WrappedViewerProps> = ({ data, onRestart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 12;
  const slideDuration = 8000;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentSlide < totalSlides - 1) {
            setCurrentSlide(currentSlide + 1);
            return 0;
          }
          return 100;
        }
        return prev + 1;
      });
    }, slideDuration / 100);

    return () => clearInterval(timer);
  }, [currentSlide, totalSlides]);

  const handleNext = () => {
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

  const formatNum = (n: number) => new Intl.NumberFormat('es-AR').format(n);

  const getComparison = (views: number) => {
    if (views > 1000000) return `¡Es como llenar ${Math.round(views/80000)} veces el Monumental! 🏟️`;
    if (views > 50000) return `¡Es como llenar la Bombonera entera! 🏟️`;
    if (views > 10000) return `¡Es como si todo un estadio de básquet te aplaudiera! 🏀`;
    return `¡Una multitud increíble siguiendo tus pasos! 🚀`;
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center p-0 md:p-4">
      <div className="relative w-full h-full max-w-[450px] max-h-[800px] aspect-[9/16] bg-black shadow-2xl md:rounded-[3rem] overflow-hidden">
        <div className="absolute top-6 left-4 right-4 z-[100] flex gap-1.5 px-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: i < currentSlide ? '100%' : i === currentSlide ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        <button 
          onClick={onRestart}
          className="absolute top-10 right-6 z-[110] p-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 text-white/50 hover:text-white transition-colors"
        >
          <Home size={18} />
        </button>

        <div className="absolute inset-0 z-50 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        <div className="relative w-full h-full">
          <Slide isActive={currentSlide === 0}>
            <div className="text-center space-y-8 px-4">
              <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#89D0D4] font-jakarta font-bold tracking-[0.2em] uppercase text-sm">
                Zaple Wrapped 2025
              </motion.h2>
              <motion.div 
                initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                className="relative mx-auto w-56 h-56 group"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF00E5] to-[#46DEFF] rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <img src={data.influencerPhoto} className="w-full h-full object-cover rounded-full border-4 border-black relative z-10" />
              </motion.div>
              <div className="space-y-4">
                <h1 className="text-5xl font-jakarta font-extrabold leading-tight">
                  ¡Hola, <br/><span className={G_KEYWORD}>{data.influencerName}</span>!
                </h1>
                <p className="text-xl text-gray-300 font-urbanist leading-relaxed">
                  2025 fue un año increíble. <br/>Acá van algunos números de lo que <span className="text-[#9A5BFF] font-bold">logramos juntos.</span>
                </p>
              </div>
            </div>
          </Slide>

          <Slide isActive={currentSlide === 1}>
            <div className="space-y-10 px-4">
              <motion.h2 initial={{ x: -50 }} animate={{ x: 0 }} className="text-5xl font-jakarta font-black leading-tight italic">
                ¡TRABAJASTE <br/><span className={G_KEYWORD}>DURO</span>!
              </motion.h2>
              <div className="p-8 bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-white/5 text-9xl font-black italic">MIN</div>
                <p className="text-xl font-urbanist text-gray-400 mb-2 uppercase tracking-widest">Cargaste</p>
                <p className="text-7xl font-jakarta font-black text-white">{formatNum(data.totalMinutes)}</p>
                <p className="text-2xl font-jakarta font-bold text-[#89D0D4]">minutos de video</p>
              </div>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-2xl font-urbanist text-gray-300">
                ¡Son <span className="text-white font-bold">{Math.round(data.totalMinutes / 1440)} días</span> seguidos <br/>hablando a cámara! 📸
              </motion.p>
            </div>
          </Slide>

          <Slide isActive={currentSlide === 2}>
            <div className="space-y-8 px-4 text-center">
              <h2 className="text-5xl font-jakarta font-black leading-tight">¡LLEGAMOS <br/><span className={G_KEYWORD}>LEJOS</span>!</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 bg-[#330086]/30 rounded-3xl border border-[#9A5BFF]/30">
                  <p className="text-6xl font-black">{formatNum(data.totalVideos)}</p>
                  <p className="text-lg font-urbanist text-[#89D0D4] font-bold uppercase">Videos con Zaple</p>
                </div>
                <div className="p-6 bg-[#240040]/30 rounded-3xl border border-[#9A5BFF]/30">
                  <p className="text-6xl font-black">{formatNum(data.totalViews)}</p>
                  <p className="text-lg font-urbanist text-[#FF00E5] font-bold uppercase">Views Totales</p>
                </div>
              </div>
              <p className="text-2xl font-urbanist italic px-4 leading-snug">
                <span className={G_BODY}>"{getComparison(data.totalViews)}"</span>
              </p>
            </div>
          </Slide>

          <Slide isActive={currentSlide === 3}>
            <div className="text-center space-y-12 px-4">
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-8xl">💬</motion.div>
              <h2 className="text-5xl font-jakarta font-black leading-tight">DISTE DE <br/><span className={G_KEYWORD}>QUÉ HABLAR</span></h2>
              <div className="relative">
                <div className="absolute inset-0 bg-[#FF00E5]/20 blur-3xl rounded-full" />
                <p className="text-8xl font-black relative z-10">{formatNum(data.totalComments)}</p>
                <p className="text-xl font-urbanist font-bold text-[#46DEFF] relative z-10 uppercase tracking-[0.3em]">Comentarios</p>
              </div>
              <p className="text-2xl font-urbanist text-gray-400 italic">¡Qué tertulia! Hubo de todo un poco...</p>
            </div>
          </Slide>

          <Slide isActive={currentSlide === 4}>
            <div className="space-y-8 px-4">
              <h2 className="text-4xl font-jakarta font-black uppercase tracking-tight">MUCHO <br/><span className={G_KEYWORD}>APOYO ❤️</span></h2>
              <div className="space-y-4">
                {data.supportiveComments.map((c, i) => (
                  <motion.div key={c.id} initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.2 }} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                    <img src={c.profilePic} className="w-14 h-14 rounded-full object-cover border-2 border-[#89D0D4]" />
                    <div className="flex-1">
                      <p className="font-bold text-[#89D0D4]">@{c.username}</p>
                      <p className="text-sm text-gray-200 line-clamp-2">{c.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Slide>

          <Slide isActive={currentSlide === 5}>
            <div className="space-y-8 px-4">
              <h2 className="text-3xl font-jakarta font-black uppercase">Y TAMBIÉN ALGUNOS <br/><span className={G_KEYWORD}>QUE... 🤌🏻🤌🏻🤌🏻</span></h2>
              <div className="space-y-4">
                {data.weirdComments.map((c, i) => (
                  <motion.div key={c.id} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.2 }} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                    <img src={c.profilePic} className="w-14 h-14 rounded-full object-cover border-2 border-[#FF00E5]" />
                    <div className="flex-1">
                      <p className="font-bold text-[#FF00E5]">@{c.username}</p>
                      <p className="text-sm text-gray-200 italic">"{c.text}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Slide>

          <Slide isActive={currentSlide === 6}>
            <div className="flex flex-col items-center justify-center text-center h-full space-y-12">
               <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-9xl drop-shadow-[0_0_40px_rgba(255,0,229,0.6)]">❤️</motion.div>
               <div>
                  <h2 className="text-8xl font-black">{formatNum(data.totalLikes)}</h2>
                  <p className="text-2xl font-urbanist font-bold text-[#9A5BFF] uppercase tracking-[0.2em]">Personas amaron tus videos</p>
               </div>
               <p className="text-xl text-gray-400 font-urbanist max-w-[250px]">Lo señalaron con un corazón porque les volaste la cabeza.</p>
            </div>
          </Slide>

          <Slide isActive={currentSlide === 7}>
            <div className="text-center space-y-10">
               <motion.div initial={{ scale: 3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-9xl">🏆</motion.div>
               <h2 className="text-6xl font-jakarta font-black leading-tight">TUS VIDEOS <br/><span className={G_KEYWORD}>MÁS VISTOS</span></h2>
               <p className="text-2xl font-urbanist text-gray-300">Este año la rompiste con estos tres contenidos...</p>
            </div>
          </Slide>

          {[0, 1, 2].map((idx) => (
            <Slide key={idx} isActive={currentSlide === 8 + idx}>
              <div className="flex flex-col h-full pt-10 pb-6 space-y-4 px-4">
                <div className="relative flex-1 bg-black rounded-[2.5rem] overflow-hidden border-2 border-white/20 shadow-2xl">
                   <video src={data.topVideos[idx].videoUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                   <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/80 via-black/20 to-transparent">
                      <h3 className="text-2xl font-jakarta font-extrabold text-white leading-tight drop-shadow-lg">{data.topVideos[idx].title}</h3>
                   </div>
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%]">
                      <div className="grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-xl p-4 rounded-3xl border border-white/10">
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Vistas</p>
                          <p className="text-sm font-bold text-[#46DEFF]">{formatNum(data.topVideos[idx].views)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Likes</p>
                          <p className="text-sm font-bold text-[#FF00E5]">{formatNum(data.topVideos[idx].likes)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Comms</p>
                          <p className="text-sm font-bold text-[#89D0D4]">{formatNum(data.topVideos[idx].comments)}</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </Slide>
          ))}

          <Slide isActive={currentSlide === 11}>
            <div className="flex flex-col h-full justify-between py-12 px-6">
              <div className="text-center space-y-2">
                 <h2 className="text-3xl font-jakarta font-black italic">RESUMEN 2025</h2>
                 <p className="text-[#89D0D4] tracking-[0.3em] font-bold text-xs uppercase">Zaple Creator Network</p>
              </div>

              <div className="relative p-1 bg-gradient-to-tr from-[#FF00E5] to-[#46DEFF] rounded-[3rem]">
                <div className="bg-black rounded-[2.9rem] p-8 space-y-6 flex flex-col items-center">
                  <img src={data.influencerPhoto} className="w-32 h-32 rounded-full object-cover border-4 border-black -mt-20 shadow-2xl" />
                  <h3 className="text-3xl font-jakarta font-black text-white">{data.influencerName}</h3>
                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-400">Vistas</span>
                      <span className="font-black text-[#46DEFF]">{formatNum(data.totalViews)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-400">Likes</span>
                      <span className="font-black text-[#FF00E5]">{formatNum(data.totalLikes)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-400">Videos</span>
                      <span className="font-black text-[#89D0D4]">{data.totalVideos}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-400">Contenido</span>
                      <span className="font-black text-[#9A5BFF]">{formatNum(data.totalMinutes)} min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                 <button onClick={onRestart} className="w-full py-4 bg-white text-black font-jakarta font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                    <RefreshCcw size={20} /> VER OTROS
                 </button>
              </div>
            </div>
          </Slide>
        </div>
      </div>
    </div>
  );
};

export default WrappedViewer;
