
import { GoogleGenAI } from "@google/genai";
import { AppData } from "../types";

export const getAIInsights = async (data: AppData) => {
  // Always use process.env.API_KEY directly as per SDK guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    En tant qu'expert en logistique agricole pour la plateforme ORSRE, analyse les données suivantes et fournis un résumé concis (max 150 mots) en français sur l'état des stocks, les mouvements récents et les points d'attention :
    
    Données :
    - Nombre d'entrepôts : ${data.warehouses.length}
    - Mouvements totaux : ${data.movements.length}
    - Stocks par entrepôt : ${data.warehouses.map(w => `${w.name}: ${JSON.stringify(w.stock)}`).join('; ')}
    - Mouvements en attente : ${data.movements.filter(m => m.status === 'PENDING').length}
    
    Donne des recommandations stratégiques.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "L'assistant IA est temporairement indisponible.";
  }
};
