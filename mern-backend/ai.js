import OpenAI from 'openai';
import "dotenv/config";  

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';


export function detectAnomalies(points){
    if (!Array.isArray(points) || points.length < 5) {
        return [];
    }

    const values = points.map(p => p.v);

    // find average
    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    // find variance
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    
    // find standard deviation
    const std = Math.sqrt(variance);

    return points.filter(p => Math.abs(p.v - mean) > 3 * std);
}


export async function runInsightQuery(q, data =[]){
    const messages = [
        {role: "system", content: "You are an AI assistant that provides insights based on telemetry data as a brief telemetry analyst."},
        {role: "user", content: q}
    ];
    if(data.length){
        const slim = data.slice(-300).map(p => [p.k, p.t, p.v]);
        messages.push({ role: "user", content: "Recent points [module,time,value] JSON:\n" + JSON.stringify(slim) });
    }

    const response = await openai.responses.create({model: MODEL, input:messages});
    return { narrative: response.output_text };

}