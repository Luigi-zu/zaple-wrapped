
import React, { useState, useEffect } from 'react';
import { CLIENTS_DATA } from './data/clients';
import WrappedViewer from './components/WrappedViewer';
import ClientSelector from './components/ClientSelector';

const App: React.FC = () => {
  const [currentClient, setCurrentClient] = useState<string | null>(null);

  useEffect(() => {
    // Leer el parámetro 'u' de la URL (ej: ?u=Bilinkis)
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('u');
    
    if (userParam && CLIENTS_DATA[userParam]) {
      setCurrentClient(userParam);
    }
  }, []);

  const handleRestart = () => {
    // Al reiniciar, quitamos el parámetro de la URL y volvemos al selector
    window.history.pushState({}, '', window.location.pathname);
    setCurrentClient(null);
  };

  return (
    <div className="min-h-screen bg-black text-white font-urbanist selection:bg-[#9A5BFF] selection:text-white">
      {/* Background decorativo base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#33008615_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,#24004020_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {currentClient && CLIENTS_DATA[currentClient] ? (
          <WrappedViewer 
            data={CLIENTS_DATA[currentClient]} 
            onRestart={handleRestart} 
          />
        ) : (
          <ClientSelector />
        )}
      </div>
    </div>
  );
};

export default App;
