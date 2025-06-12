// import express from 'express'
// import { generateMCQs } from '../services/openaiService.js';

// const router = express.Router();
// router.post("/", async (req, res) => {
//   const { topic, difficulty, count } = req.body;

//   if (!topic || !difficulty || !count) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   try {
//     const mcqs = await generateMCQs({ topic, difficulty, count });
//     res.json({ success: true, data: mcqs });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// export default router;