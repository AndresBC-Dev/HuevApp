import React, { useState } from 'react';
import {
  AlertTriangle,
  Trash2,
  Diamond,
  Star,
  Sparkles,
  Sun,
  Package
} from 'lucide-react';

import basculaSprite from '../src/assets/img/bascula.png';

const Egg = ({ size = 'w-20 h-24', draggable = false, onDragStart }) => {
  return (
    <div draggable={draggable} onDragStart={onDragStart} className="cursor-grab active:cursor-grabbing select-none">
      <div className={`${size} relative`}>
        <div className="w-full h-full bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-200 rounded-full shadow-2xl border-4 border-amber-300/60 overflow-hidden">
          <div className="absolute top-4 left-5 w-10 h-14 bg-white/70 rounded-full blur-xl"></div>
          <div className="absolute top-6 left-7 w-6 h-12 bg-white/50 rounded-full blur-lg"></div>
          <div className="absolute top-5 right-6 w-5 h-5 bg-white rounded-full blur-sm"></div>
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-5 bg-black/20 rounded-full blur-md"></div>
      </div>
    </div>
  );
};

const EggClassifierGame = () => {
  const [eggs, setEggs] = useState([
    { id: 1, weight: 0 }, { id: 2, weight: 0 }, { id: 3, weight: 0 },
    { id: 4, weight: 0 }, { id: 5, weight: 0 }, { id: 6, weight: 0 },
  ]);
  const [nextId, setNextId] = useState(7);

  const [draggedEgg, setDraggedEgg] = useState(null);
  const [scaleEgg, setScaleEgg] = useState(null);
  const [showWeight, setShowWeight] = useState(false);
  const [defectiveEgg, setDefectiveEgg] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [bowlDrop, setBowlDrop] = useState(false);

  const [counts, setCounts] = useState({
    jumbo: 0, aaa: 0, aa: 0, a: 0, bc: 0, defective: 0
  });

  const getCategory = (weight) => {
    if (weight < 35) return { name: 'DEFECTUOSO', key: 'defective', color: '#ef4444' };
    if (weight < 43) return { name: 'B/C', key: 'bc', color: '#f59e0b' };
    if (weight < 53) return { name: 'A', key: 'a', color: '#eab308' };
    if (weight < 63) return { name: 'AA', key: 'aa', color: '#84cc16' };
    if (weight < 73) return { name: 'AAA', key: 'aaa', color: '#22c55e' };
    return { name: 'JUMBO', key: 'jumbo', color: '#3b82f6' };
  };

  const handleDragStart = (egg) => {
    if (egg.weight === 0) {
      const randomWeight = Math.floor(Math.random() * 50) + 30;
      setDraggedEgg({ ...egg, weight: randomWeight });
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDropOnScale = (e) => {
    e.preventDefault();
    if (draggedEgg && !scaleEgg) {
      setScaleEgg(draggedEgg);
      setShowWeight(true);
      setBowlDrop(true);
      setTimeout(() => setBowlDrop(false), 600);

      const category = getCategory(draggedEgg.weight);
      if (category.key === 'defective') {
        setDefectiveEgg(draggedEgg);
      } else {
        setTimeout(() => {
          setCounts(prev => ({ ...prev, [category.key]: prev[category.key] + 1 }));
          setEggs(prev => prev.filter(e => e.id !== draggedEgg.id));
          setScaleEgg(null);
          setShowWeight(false);
          setDraggedEgg(null);
        }, 1500);
      }
    }
  };

  const handleDefectiveAction = () => {
    setCounts(prev => ({ ...prev, defective: prev.defective + 1 }));
    setEggs(prev => prev.filter(e => e.id !== defectiveEgg.id));
    setDefectiveEgg(null);
    setScaleEgg(null);
    setShowWeight(false);
    setDraggedEgg(null);
  };

  const handleNewBasket = () => {
    const numEggs = Math.floor(Math.random() * 6) + 7; // 7-12 huevos
    const newEggs = Array.from({ length: numEggs }, (_, i) => ({
      id: nextId + i,
      weight: 0
    }));
    setEggs(newEggs);
    setNextId(nextId + numEggs);
  };

  const handleFinishCount = () => setShowSummary(true);

  const handleRestart = () => {
    setEggs([
      { id: 1, weight: 0 }, { id: 2, weight: 0 }, { id: 3, weight: 0 },
      { id: 4, weight: 0 }, { id: 5, weight: 0 }, { id: 6, weight: 0 },
    ]);
    setNextId(7);
    setCounts({ jumbo: 0, aaa: 0, aa: 0, a: 0, bc: 0, defective: 0 });
    setShowSummary(false);
    setScaleEgg(null);
    setShowWeight(false);
    setDefectiveEgg(null);
  };

  const totalEggs = Object.values(counts).reduce((a, b) => a + b, 0) - counts.defective;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-6">
      <div className="w-full max-w-7xl flex gap-12 items-start">

        {/* CANASTA */}
        <div className="flex-shrink-0">
          <div className="bg-amber-800 rounded-t-full rounded-b-3xl p-6 shadow-2xl border-8 border-amber-900 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-amber-700 rounded-full border-8 border-amber-900"></div>
            <div className="bg-gradient-to-b from-amber-600 to-amber-700 rounded-3xl p-8 min-h-96">
              <h3 className="text-white text-center font-bold text-2xl mb-8">CANASTA</h3>
              <div className="grid grid-cols-3 gap-6">
                {eggs.map((egg) => (
                  <Egg key={egg.id} draggable onDragStart={() => handleDragStart(egg)} />
                ))}
              </div>
            </div>
          </div>

          {/* BOTÓN OTRA CANASTA: Aparece cuando no hay huevos */}
          {eggs.length === 0 && (
            <button
              onClick={handleNewBasket}
              className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl text-2xl font-bold shadow-lg hover:scale-105 transition"
            >
              Otra Canasta
            </button>
          )}
        </div>

        {/* BÁSCULA CENTRAL */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative">
            <div 
              onDragOver={handleDragOver} 
              onDrop={handleDropOnScale} 
              className="relative w-96 h-96 origin-center scale-150"
            >
              {/* BASE */}
              <img
                src={basculaSprite}
                alt="base"
                className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none z-10"
                style={{
                  clipPath: 'polygon(0% 45%, 100% 45%, 100% 100%, 0% 100%)',
                  imageRendering: 'crisp-edges'
                }}
              />

              {/* BOWL: Ajustar top-44 para bajar/subir el bowl */}
              <div className={`absolute top-44 left-1/2 -translate-x-1/2 z-30 transition-all duration-700 ease-out ${bowlDrop ? 'scale-138' : 'scale-140'}`}>
                <img
                  src={basculaSprite}
                  alt="bowl"
                  className="w-full select-none pointer-events-none origin-bottom"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 43%, 0% 43%)',
                    imageRendering: 'crisp-edges'
                  }}
                />
              </div>

              {/* PANTALLA DIGITAL: Ajustar px-X py-X y text-Xxl para cambiar tamaño */}
              <div className="absolute bottom-22 left-1/2 -translate-x-1/2 z-40 origin-bottom">
                <div className="bg-black rounded-lg px-6 py-1 border-2 border-gray-800 shadow-2xl">
                  <div className="text-right text-white">
                    {showWeight && scaleEgg ? (
                      <>
                        <div className="text-green-400 text-2xl font-bold leading-none">
                          {scaleEgg.weight}<span className="text-lg">g</span>
                        </div>
                        <div className="text-sm font-bold mt-1" style={{ color: getCategory(scaleEgg.weight).color }}>
                          {getCategory(scaleEgg.weight).name}
                        </div>
                      </>
                    ) : (
                      <div className="text-green-400 text-2xl font-bold">0.0g</div>
                    )}
                  </div>
                </div>
              </div>

              {/* HUEVO EN EL BOWL */}
              {scaleEgg && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                  <Egg size="w-22 h-30" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-24 bg-white/90 backdrop-blur-lg rounded-3xl px-12 py-6 shadow-2xl">
            <p className="text-4xl font-bold text-gray-800">
              Huevos restantes: <span className="text-orange-600">{eggs.length}</span>
            </p>
          </div>
        </div>

        {/* CELULAR */}
        <div className="flex-shrink-0 w-96">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-[3.5rem] p-3 shadow-2xl border-[12px] border-gray-900 relative">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-full z-10"></div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-[3rem] h-[680px] flex flex-col overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 pt-10 text-white text-center">
                <div className="text-2xl font-bold mb-1">HuevApp</div>
                <p className="text-amber-100 text-xs">Clasificación Profesional</p>
              </div>

              <div className="flex-1 p-3 flex flex-col justify-between">
                <div className="bg-white/95 backdrop-blur rounded-2xl p-3 text-center shadow-lg mb-2">
                  <p className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    {totalEggs}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Clasificados</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 mb-2">
                  {[
                    { label: 'JUMBO', key: 'jumbo', color: '#3b82f6', icon: Diamond, desc: '>73g' },
                    { label: 'AAA', key: 'aaa', color: '#22c55e', icon: Star, desc: '63-73g' },
                    { label: 'AA', key: 'aa', color: '#84cc16', icon: Sparkles, desc: '53-63g' },
                    { label: 'A', key: 'a', color: '#eab308', icon: Sun, desc: '43-53g' },
                    { label: 'B/C', key: 'bc', color: '#f59e0b', icon: Package, desc: '35-43g' },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <div key={cat.key} className="bg-white rounded-xl p-2 shadow-md border-2" style={{ borderColor: cat.color }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon size={20} style={{ color: cat.color }} />
                            <div>
                              <p className="text-xs font-bold">{cat.label}</p>
                              <p className="text-[10px] text-gray-500">{cat.desc}</p>
                            </div>
                          </div>
                          <span className="text-xl font-bold" style={{ color: cat.color }}>{counts[cat.key]}</span>
                        </div>
                      </div>
                    );
                  })}

                  {counts.defective > 0 && (
                    <div className="bg-red-50 rounded-xl p-2 shadow-md border-2 border-red-500">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trash2 size={20} className="text-red-600" />
                          <div>
                            <p className="text-xs font-bold text-red-700">DESCARTADOS</p>
                            <p className="text-[10px] text-red-600">&lt;35g</p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-red-600">{counts.defective}</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleFinishCount}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl text-base font-bold shadow-lg hover:scale-105 transition"
                >
                  Terminar Conteo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALES */}
      {defectiveEgg && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-10 max-w-md shadow-2xl text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-6" size={80} />
            <h3 className="text-3xl font-bold mb-4">Huevo Defectuoso</h3>
            <div className="bg-red-50 rounded-xl p-4 border-2 border-red-300 mb-6">
              <p className="text-xl text-red-700 font-bold">{defectiveEgg.weight}g</p>
              <p className="text-red-600 text-sm mt-2">Por debajo del peso mínimo (&lt;35g)</p>
            </div>
            <p className="text-gray-700 mb-6">Este huevo será descartado</p>
            <button onClick={handleDefectiveAction} className="bg-green-600 text-white px-12 py-4 rounded-xl text-xl font-bold hover:bg-green-700 transition">
              Entendido
            </button>
          </div>
        </div>
      )}

      {showSummary && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-6">
          <div className="bg-white rounded-3xl p-10 max-w-4xl w-full shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">📊</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Reporte de Clasificación</h2>
              <p className="text-gray-600">Conteo completado el 28/11/2025</p>
            </div>

            {/* Stats principales */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border-2 border-green-200">
                <p className="text-5xl font-bold text-green-600 mb-2">{totalEggs}</p>
                <p className="text-sm font-semibold text-gray-700">Huevos Clasificados</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center border-2 border-blue-200">
                <p className="text-5xl font-bold text-blue-600 mb-2">{Math.round((totalEggs / (totalEggs + counts.defective)) * 100)}%</p>
                <p className="text-sm font-semibold text-gray-700">Tasa de Calidad</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 text-center border-2 border-amber-200">
                <p className="text-5xl font-bold text-amber-600 mb-2">+{Math.floor(Math.random() * 8) + 5}%</p>
                <p className="text-sm font-semibold text-gray-700">Incremento Producción</p>
              </div>
            </div>

            {/* Desglose por categoría */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Desglose por Categoría</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'JUMBO', key: 'jumbo', color: '#3b82f6', icon: '💎' },
                  { label: 'AAA', key: 'aaa', color: '#22c55e', icon: '⭐' },
                  { label: 'AA', key: 'aa', color: '#84cc16', icon: '✨' },
                  { label: 'A', key: 'a', color: '#eab308', icon: '☀️' },
                  { label: 'B/C', key: 'bc', color: '#f59e0b', icon: '📦' },
                ].map((cat) => (
                  <div key={cat.key} className="bg-white rounded-xl p-4 shadow-md border-2 flex items-center justify-between" style={{ borderColor: cat.color }}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <p className="text-lg font-bold" style={{ color: cat.color }}>{cat.label}</p>
                        <p className="text-xs text-gray-500">{totalEggs > 0 ? Math.round((counts[cat.key] / totalEggs) * 100) : 0}% del total</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold" style={{ color: cat.color }}>{counts[cat.key]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Defectuosos si hay */}
            {counts.defective > 0 && (
              <div className="bg-red-50 rounded-2xl p-4 mb-6 border-2 border-red-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trash2 size={32} className="text-red-600" />
                    <div>
                      <p className="text-lg font-bold text-red-700">Huevos Descartados</p>
                      <p className="text-sm text-red-600">Por debajo del peso mínimo (&lt;35g)</p>
                    </div>
                  </div>
                  <span className="text-4xl font-bold text-red-600">{counts.defective}</span>
                </div>
              </div>
            )}

            {/* Botón reiniciar */}
            <button 
              onClick={handleRestart} 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-5 rounded-2xl text-2xl font-bold hover:from-amber-600 hover:to-orange-600 transition shadow-lg"
            >
              Iniciar Nuevo Conteo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EggClassifierGame;