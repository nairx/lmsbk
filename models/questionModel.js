import mongoose from "mongoose";
const questionSchema = mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    question: { type: String, required: true },
    options: { type: String },
    answer: { type: String, required: true },
    level: { type: Number, default: 3 },
    type: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

questionSchema.index({ question: "text", options: "text", answer: "text" });

export default mongoose.model("Question", questionSchema);
