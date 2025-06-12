import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
// import mcqRoutes from "./routes/mcq.js";
import dbConnect from "./lib/mongoose.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
await dbConnect();

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;

// mongoose
// .connect(process.env.MONGO_URI)
// .then(() => {
//   app.listen(8080, () => {
//     console.log("Server Started on port 8080");
//   });
// })
// .catch((error) => {
//   console.log(error);
// });

app.use("/api/users", userRoutes);
// app.use("/api/mcqs", mcqRoutes);

// app.use("/api/courses", courseRoutes);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
