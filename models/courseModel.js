import mongoose from 'mongoose'
const courseSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    imgUrl: { type: String, required: true },
    active: { type: Boolean, default: true },
    videoUrl :{type: String}
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);