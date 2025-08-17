import OpenAI from 'openai';
import "dotenv/config";  

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function runInsightQuery(q, data =[]){
    const messages = [
        {role: "system", content: "You are an AI assistant that provides insights based on telemetry data as a brief telemetry analyst."},
        {role: "user", content: q}
    ];
    if(Array.isArray(data) && data.length > 0) {
        const slim = data.slice(-300).map(p => [p.k, p.t, p.v]);
        messages.push({role: "user", content: `Recent points [module,time,value] JSON: ${JSON.stringify(slim)}`});
    }

    const response = await openai.responses.create({model: MODEL, input:messages});
    return { narrative: response.output_text };

}