// import {OpenAI} from 'openai'
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export async function generateMCQs({ topic, difficulty, count }) {
//   const prompt = `Generate ${count} multiple choice questions on the topic "${topic}" with ${difficulty} difficulty. Each question should have 4 options and one correct answer. Return in JSON format with keys: question, options, answer.`;

//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o", // You can use "gpt-3.5-turbo" if needed
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.7
//   });

//   const text = completion.choices[0].message.content;

//   try {
//     return JSON.parse(text);
//   } catch (err) {
//     throw new Error("Failed to parse ChatGPT response as JSON:\n" + text);
//   }
// }


