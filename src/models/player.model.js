const mongoose = require("mongoose");
const { Schema } = mongoose;

// --- Country Subdocument ---
const CountrySchema = new Schema(
  {
    picture: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
      trim: true,
    },
  },
  { _id: false } // no separate _id for embedded subdocument
);

// --- Data Subdocument ---
const DataSchema = new Schema(
  {
    rank: {
      type: Number,
      required: true,
      min: 1,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    height: {
      type: Number,
      required: true,
      min: 0,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    last: {
      type: [Number],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 5,
        message: "Last must be an array of 5 numeric values (0 or 1)",
      },
      required: true,
    },
  },
  { _id: false }
);

// --- Main Player Schema ---
const PlayerSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
      index: true,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    shortname: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    sex: {
      type: String,
      required: true,
      enum: ["M", "F"],
    },
    country: {
      type: CountrySchema,
      required: true,
    },
    picture: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: DataSchema,
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt / updatedAt
    versionKey: false,
  }
);

const Player = mongoose.model("Player", PlayerSchema, "Players");

module.exports = Player;