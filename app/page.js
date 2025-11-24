"use client";

import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

export default function Calculadora() {
  const [modeloActual, setModeloActual] = useState(null);
  const [operacion, setOperacion] = useState("suma");
  const [valA, setValA] = useState("");
  const [valB, setValB] = useState("");
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    async function cambiarModelo() {
      setModeloActual(null);
      setResultado(null);

      const path =
        operacion === "suma"
          ? "/modelo_suma/model.json"
          : "/modelo_resta/model.json";

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
    if (!modeloActual || valA === "" || valB === "") return;

    const input = tf.tensor2d([[parseFloat(valA), parseFloat(valB)]]);
    const prediccion = modeloActual.predict(input);
    const data = await prediccion.data();
    setResultado(data[0].toFixed(2));

    input.dispose();
    prediccion.dispose();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-green-50 p-6">

      {/* Tarjeta principal */}
      <div className="w-full max-w-lg bg-white shadow-2xl border border-gray-300 rounded-2xl p-8">

        <h1 className="text-4xl font-extrabold text-center mb-6 text-purple-700">
          🤖 Calculadora Neuronal
        </h1>

        {/* Selector de operación */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setOperacion("suma")}
            className={`px-6 py-3 rounded-xl font-bold transition-colors duration-300 ${
              operacion === "suma"
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-gray-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            ➕ Suma
          </button>

          <button
            onClick={() => setOperacion("resta")}
            className={`px-6 py-3 rounded-xl font-bold transition-colors duration-300 ${
              operacion === "resta"
                ? "bg-red-600 text-white shadow-lg scale-105"
                : "bg-gray-100 text-red-700 hover:bg-red-200"
            }`}
          >
            ➖ Resta
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-blue-800 text-lg">
              Número A
            </label>
            <input
              type="number"
              value={valA}
              onChange={(e) => setValA(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-gray-900"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-red-800 text-lg">
              Número B
            </label>
            <input
              type="number"
              value={valB}
              onChange={(e) => setValB(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-lg text-gray-900"
            />
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={calcular}
          disabled={!modeloActual}
          className={`w-full py-3 mt-8 rounded-xl text-lg font-extrabold transition-colors duration-300 ${
            modeloActual
              ? "bg-green-600 text-white hover:bg-green-700 shadow-lg"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {modeloActual ? "Calcular con IA 🤖" : "Cargando Modelo..."}
        </button>

        {/* Resultado */}
        {resultado !== null && (
          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 border rounded-xl text-center shadow-inner">
            <p className="text-xl font-semibold text-purple-800 mb-2">
              Resultado Predicho:
            </p>
            <p className="text-5xl font-extrabold text-green-700">
              {resultado}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
