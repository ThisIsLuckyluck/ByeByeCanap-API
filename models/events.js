const mongoose = require("mongoose");

// -------------------- start of the embedded documents zone --------------------
const preferenceSchema = mongoose.Schema({
  minAgeRange: Number,
  maxAgeRange: Number,
  everyAge: Boolean,

  gender: String,
  other: String,
});

const locationSchema = mongoose.Schema({
  adress: String,
  latitude: Number,
  longitude: Number,
});
// -------------------- end of the embedded documents zone --------------------

// -------------------- start of the Schema's zone --------------------
const eventsSchema = new mongoose.Schema({
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  title: String,
  theme: String,
  category: String,
  reference: String,
  image: String,
  eventDate: Date,
  minSizeGroup: Number,
  maxSizeGroup: Number,
  preferences: preferenceSchema,
  location: locationSchema,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  isFinished: Boolean,
});
// -------------------- end of the Schema's zone --------------------

const events = mongoose.model("events", eventsSchema);

module.exports = events;
