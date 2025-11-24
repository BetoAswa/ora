"use client";

import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

export default function Calculadora() {
  const [modeloActual, setModeloActual] = useState(null);
  const [operacion, setOperacion] = useState('suma'); // 'suma' o 'resta'
  const [valA, setValA] = useState('');
  const [valB, setValB] = useState('');
  const [resultado, setResultado] = useState(null);

  // Cargar el modelo cuando cambia la operación
  useEffect(() => {
    async function cambiarModelo() {
      setModeloActual(null); // Resetear mientras carga
      setResultado(null);

      const path = operacion === 'suma'
        ? '/modelo_suma/model.json'
        : '/modelo_resta/model.json';

      try {
        const m = await tf.loadLayersModel(path);
        setModeloActual(m);
        console.log(`Modelo de ${operacion} cargado`);
      } catch (err) {
        console.error(err);
      }
    }
    cambiarModelo();
  }, [operacion]);

  const calcular = async () => {
    if (!modeloActual || valA === '' || valB === '') return;

    const input = tf.tensor2d([[parseFloat(valA), parseFloat(valB)]]);
    const prediccion = modeloActual.predict(input);
    const data = await prediccion.data();

    setResultado(data[0].toFixed(2));

    input.dispose();
    prediccion.dispose();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">

      <h1 className="text-2xl font-bold mb-4 text-center">
        Calculadora Neuronal
      </h1>

      {/* Selector de Operación */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setOperacion('suma')}
          className={`px-4 py-2 rounded ${
            operacion === 'suma'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Suma (+)
        </button>

        <button
          onClick={() => setOperacion('resta')}
          className={`px-4 py-2 rounded ${
            operacion === 'resta'
              ? 'bg-red-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Resta (-)
        </button>
      </div>

      {/* Inputs */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Número A</label>
        <input
          type="number"
          value={valA}
          onChange={(e) => setValA(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Número B</label>
        <input
          type="number"
          value={valB}
          onChange={(e) => setValB(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={calcular}
        disabled={!modeloActual}
        className={`w-full py-2 rounded mb-4 ${
          modeloActual
            ? 'bg-green-500 text-white'
            : 'bg-gray-400 text-gray-200'
        }`}
      >
        {modeloActual ? 'Calcular con IA' : 'Cargando Modelo...'}
      </button>

      {/* Resultado */}
      {resultado !== null && (
        <div className="mt-4 bg-gray-100 p-4 rounded text-center">
          <p className="font-medium text-lg">Resultado Predicho:</p>
          <p className="text-2xl font-bold">{resultado}</p>
        </div>
      )}
    </div>
  );
}
