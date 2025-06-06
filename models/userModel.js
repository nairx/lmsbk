import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: { type: String },
    pass: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, default: "user" },
    ghUser: { type: String },
    orgName: { type: String, default: "NA" },
    active: { type: Boolean, default: false },
    enable: { type: Boolean },
    courses: { type: [mongoose.Schema.Types.ObjectId] },
    students: [mongoose.Schema.Types.Mixed],
    batch: { type: String, default: "new" },
    message: { type: String },
    updatedBy: { type: String, default: null },
    score: { type: Number, default: 0 },
    lastGraded: { type: Date },
    level: { type: Number, default: 1 },
    visibility: { type: String, default:"private" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
// export default mongoose.models.User || mongoose.model("User", userSchema);
