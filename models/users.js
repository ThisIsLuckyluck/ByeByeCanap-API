const mongoose = require("mongoose");

// -------------------- start of the embedded documents part --------------------
const aspirationsSchema = mongoose.Schema({
  themesInterest: { type: [String], default: [] },
  categoriesInterest: { type: [String], default: [] },
  themesSkill: { type: [String], default: [] },
  categoriesSkill: { type: [String], default: [] },
});

const availabilitySchema = mongoose.Schema({
  availability: { type: [String], default: [] },
  locationPreference: { type: String, default: null },
});

const valuesSchema = mongoose.Schema({
  preferredPeople: { type: [String], default: [] },
  preferredGroupType: { type: [String], default: [] },
  personalValues: { type: [String], default: [] },
  causes: { type: [String], default: [] },
});
// -------------------- end of embedded documents part --------------------

// -------------------- start of the Schema's Zone --------------------
const usersSchema = new mongoose.Schema({
  // Personnal Informations
  username: String,
  email: String,
  password: String,
  token: String,
  userType: String,

  // Public Information
  lastname: String,
  firstname: String,
  age: Number,
  birthDate: Date,
  gender: String,
  avatar: String,
  descriptionProfile: String,
  isProfileChecked: Boolean,
  inscriptionDate: Date,

  // Embedded document import
  aspirations: { type: aspirationsSchema, default: {} },
  availability: { type: availabilitySchema, default: {} },
  values: { type: valuesSchema, default: {} },
});
// -------------------- end of the Schema's Zone --------------------

const users = mongoose.model("users", usersSchema);
module.exports = users;
