import express, { application } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
// const SECRET_KEY = "helloworld";
import ObjectId from "mongoose";
import mongoose from "mongoose";
import { authenticate, authorize } from "../middleware/auth.js";
const router = express.Router();

dotenv.config();
//authenticate, authorize("admin"),
const SECRET_KEY = process.env.JWT_SECRET;
router.get("/", authenticate, authorize("admin"), async (req, res) => {
  const users = await userModel
    .find({ role: { $not: { $eq: "user" } } })
    .sort({ updatedAt: -1 });
  return res.json(users);
});

router.delete("/:id",authenticate, authorize("admin"), async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findByIdAndDelete(id);
  return res.json(user);
});

router.post("/register", async (req, res) => {
  // const body = req.body;
  const { name, email, pass } = req.body;
  try {
    const found = await userModel.findOne({ email });
    if (found) {
      return res.json({ message: "User already exists." }, { status: 401 });
    }
    const hashedPassword = await bcrypt.hash(pass, 10);
    // pass = hashedPassword;
    const user = await userModel.create({ name, email, pass: hashedPassword });
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
        batch: user.batch,
      },
      SECRET_KEY
    );
    return res.json({ status: 201 });
    // return res.json({ token }, { status: 201 });
  } catch (err) {
    console.log(err);
    return res.json({ error: err.message }, { status: 400 });
  }
});

router.post("/login", async (req, res) => {
  const body = await req.body;
  try {
    const found = await userModel.findOne({
      email: body.email,
    });
    if (!found) {
      return res.json({ message: "User not found" });
    }
    //testing
    if (!found.active) {
      return res.json({ message: "Activation Pending" });
    }
    const matchPassword = await bcrypt.compare(body.pass, found.pass);
    if (!matchPassword) {
      return res.json({ message: "Invalid Password" });
    }
    const token = jwt.sign(
      {
        id: found._id,
        name: found.name,
        email: found.email,
        role: found.role,
        level: found.level,
        batch: found.batch,
      },
      SECRET_KEY
    );
    const data = {
      id: found._id,
      name: found.name,
      email: found.email,
      role: found.role,
      level: found.level,
      batch: found.batch,
      token: token,
      // message: "ok",
    };
    return res.json(data);
  } catch (err) {
    return res
      .status(400)
      .json({ error: err.message }, { message: "Something went wrong" });
  }
});

router.get("/batch/:id", authenticate, async (req, res) => {
  try {
    // const batchId = req.params.id;
    // let filterObj;
    // if (batchId === "") {
    //   filterObj = { role: { $not: { $eq: "user" } }, active: true };
    // } else {
    //   filterObj = { batch: batchId, role: "user", active: true };
    // }
    // const students = await userModel
    //   .find(filterObj)
    //   .sort({ score: -1, lastGraded: -1 });

    const students = await userModel
      .find({ batch: req.params.id, role: "user" })
      .sort({ score: -1, lastGraded: -1 });
    return res.json(students);
  } catch (err) {
    return res.json({ message: "something went wrong" });
  }
});

router.post("/", async (req, res) => {
  const body = await req.body;

  try {
    const found = await userModel.findOne({ email: body.email });
    if (found) {
      return res.json({ message: "User already exists." }, { status: 401 });
    }
    const hashedPassword = await bcrypt.hash(body.pass, 10);
    body.pass = hashedPassword;
    const user = await userModel.create(body);
    // console.log("user");
    // const token = signToken({
    //   name: user.name,
    //   email: user.email,
    //   role: user.role,
    //   level: user.level,
    //   batch: user.batch,
    // });
    // return res.json({ token }, { status: 201 });
    return res.json({ status: 201 });
  } catch (err) {
    console.log(err);
    return res.json({ error: err.message }, { status: 400 });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  const users = await userModel.findOne({ _id: req.params.id });
  // console.log(users);
  return res.json(users);
});

router.patch("/:id", authenticate, async (req, res) => {
  const body = await req.body;
  // const id = new ObjectId(req.params.id);
  if (body.pass) {
    const hashedPassword = await bcrypt.hash(body.pass, 10);
    body.pass = hashedPassword;
  }
  const users = await userModel.findByIdAndUpdate(req.params.id, body);

  return res.json(users);
});

router.patch(
  "/grade/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    console.log("inside grade block");
    const chkUser = await userModel.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          lastGraded: 1,
          updatedAt: 1,
          daysBetween: {
            $dateDiff: {
              startDate: "$lastGraded",
              endDate: "$$NOW",
              unit: "minute",
            },
          },
        },
      },
      // { $match: { daysBetween: { $gte: 1 }, _id: id } },
      {
        $match: {
          daysBetween: { $lte: 14 },
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
    ]);
    // console.log("chkuser", chkUser);
    if (chkUser.length > 0) return res.json({ message: "Already Graded" });
    const student = await userModel.updateOne(
      { _id: req.params.id },
      {
        $inc: { score: 1 },
        $set: { lastGraded: new Date(), message: "Reviewed" },
      }
    );
    return res.json(student);
  }
);

export default router;
