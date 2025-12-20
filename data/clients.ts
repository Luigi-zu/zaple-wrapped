
import { WrappedData } from '../types';

export const CLIENTS_DATA: Record<string, WrappedData> = {
  "Bilinkis": {
    influencerName: "Santi Bilinkis",
    influencerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop", // Reemplazar con foto real
    totalViews: 4500000,
    totalLikes: 320000,
    totalComments: 12500,
    totalMinutes: 1450,
    totalVideos: 84,
    supportiveComments: [
      { id: "s1", username: "tecnofilo_ar", text: "El mejor análisis tecnológico de Argentina siempre.", profilePic: "https://i.pravatar.cc/150?u=s1" },
      { id: "s2", username: "mariana_tech", text: "Santi, tus hilos de IA me cambiaron la forma de laburar.", profilePic: "https://i.pravatar.cc/150?u=s2" },
      { id: "s3", username: "futuro_hoy", text: "Gracias Zaple por traer este contenido.", profilePic: "https://i.pravatar.cc/150?u=s3" }
    ],
    weirdComments: [
      { id: "w1", username: "bot_992", text: "Santi, ¿eres un holograma creado por una IA?", profilePic: "https://i.pravatar.cc/150?u=w1" },
      { id: "w2", username: "pedro_magu", text: "Vendo heladeras usadas en el Obelisco.", profilePic: "https://i.pravatar.cc/150?u=w2" },
      { id: "w3", username: "desconocido", text: "Me gusta el color de tu pared, ¿es gris espacial?", profilePic: "https://i.pravatar.cc/150?u=w3" }
    ],
    topVideos: [
      { id: "v1", title: "El futuro de la IA en 2025", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-circuit-board-1051-large.mp4", views: 1200000, likes: 95000, comments: 4500 },
      { id: "v2", title: "¿Cómo hackear tu productividad?", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-at-night-4151-large.mp4", views: 800000, likes: 62000, comments: 3100 },
      { id: "v3", title: "Biohacking: Mitos y Verdades", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4", views: 540000, likes: 41000, comments: 2200 }
    ]
  },
  "Masnatta": {
    influencerName: "Meli Masnatta",
    influencerPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop", // Reemplazar con foto real
    totalViews: 2800000,
    totalLikes: 195000,
    totalComments: 8900,
    totalMinutes: 980,
    totalVideos: 62,
    supportiveComments: [
      { id: "s1", username: "educa_innovar", text: "Referente total en educación y género.", profilePic: "https://i.pravatar.cc/150?u=m1" },
      { id: "s2", username: "chicas_it", text: "Inspiración pura para todas las que empezamos.", profilePic: "https://i.pravatar.cc/150?u=m2" },
      { id: "s3", username: "juan_prog", text: "Excelente perspectiva sobre el futuro del aprendizaje.", profilePic: "https://i.pravatar.cc/150?u=m3" }
    ],
    weirdComments: [
      { id: "w1", username: "hater_404", text: "Prefiero aprender con un libro de 1980.", profilePic: "https://i.pravatar.cc/150?u=mw1" },
      { id: "w2", username: "random_user", text: "¿Alguien sabe donde comprar alfajores de maicena?", profilePic: "https://i.pravatar.cc/150?u=mw2" },
      { id: "w3", username: "lost_in_space", text: "Meli, ¿qué opinas de los gatos que no maúllan?", profilePic: "https://i.pravatar.cc/150?u=mw3" }
    ],
    topVideos: [
      { id: "v1", title: "Cerrando la brecha digital", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-graphic-lines-in-motion-1162-large.mp4", views: 950000, likes: 78000, comments: 2900 },
      { id: "v2", title: "Educación 3.0: Lo que viene", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-1166-large.mp4", views: 720000, likes: 54000, comments: 1800 },
      { id: "v3", title: "Liderazgo en la era tech", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-1168-large.mp4", views: 400000, likes: 23000, comments: 950 }
    ]
  }
};
