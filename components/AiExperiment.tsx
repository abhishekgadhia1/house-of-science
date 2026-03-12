import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Terminal, Cpu, ChevronRight, Activity } from 'lucide-react';

const AiExperiment: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [experiment, setExperiment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setIsLoading(true);
    setError(null);
    setExperiment('');

    try {
      const apiKey = process.env.API_KEY || '';
      if (!apiKey) {
        throw new Error("API Key Missing");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Role: Advanced Science Officer at House of Science.
        Input: "${ingredients}".
        Task: Create a rigorous but safe experiment protocol.
        Format: Markdown. 
        Sections: OBJECTIVE, THEORY, METHODOLOGY, HAZARD CONTROL.
        Style: Minimalist, technical, precise.
      `;

      const streamResult = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      for await (const chunk of streamResult) {
          const chunkText = chunk.text;
          if (chunkText) {
              setExperiment(prev => prev + chunkText);
          }
      }

    } catch (err: any) {
      console.error(err);
      setError("NEURAL LINK SEVERED. RETRY.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 py-12 min-h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
         <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl w-full mx-auto px-6 lg:px-12 animate-slide-up relative z-10">
        <div className="flex items-center mb-10 space-x-3">
             <div className="p-2 bg-indigo-100 rounded-lg">
                <Activity className="text-indigo-600 w-6 h-6" />
             </div>
             <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
                AI Research <span className="text-slate-400">Console</span>
             </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-0 border border-slate-200 shadow-2xl rounded-xl overflow-hidden h-[600px] bg-white">
            {/* Input Section - Light Grey */}
            <div className="lg:col-span-5 p-8 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
                <form onSubmit={handleGenerate} className="h-full flex flex-col">
                    <label className="text-xs font-mono text-indigo-600 mb-4 block tracking-widest font-bold">
                        // INPUT PARAMETERS
                    </label>
                    <textarea
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        className="flex-grow bg-white border border-slate-200 p-4 text-slate-900 font-mono text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 transition-all resize-none mb-6 placeholder-slate-400 outline-none rounded-md"
                        placeholder="ENTER AVAILABLE MATERIEL..."
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !ingredients}
                        className="w-full bg-indigo-600 text-white font-bold uppercase tracking-widest py-4 text-xs hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center group shadow-md rounded-md"
                    >
                        {isLoading ? 'CALCULATING...' : 'INITIATE SEQUENCE'}
                        {!isLoading && <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>
            </div>

            {/* Output Section - Dark Contrast */}
            <div className="lg:col-span-7 p-8 relative bg-slate-900 text-slate-300">
                <div className="absolute top-4 right-4 flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-slate-700 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-slate-700 rounded-full"></div>
                </div>
                
                <div className="h-full overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed">
                    {!experiment && !isLoading && !error && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600">
                            <Cpu className="w-12 h-12 mb-4 opacity-50" />
                            <p className="tracking-widest text-xs">AWAITING DATA STREAM</p>
                        </div>
                    )}
                    
                    {error && <p className="text-red-400">{">>"} ERROR: {error}</p>}
                    
                    {experiment && (
                        <div className="prose prose-invert prose-p:text-slate-400 prose-headings:text-indigo-400 prose-strong:text-white max-w-none">
                            <div className="whitespace-pre-wrap">{experiment}</div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="space-y-3 pt-4">
                            <div className="h-2 bg-slate-800 w-3/4 animate-pulse rounded"></div>
                            <div className="h-2 bg-slate-800 w-1/2 animate-pulse rounded"></div>
                            <div className="h-2 bg-slate-800 w-5/6 animate-pulse rounded"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AiExperiment;