// -------------------- start of the Import's Zone --------------------
const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const moment = require("moment");
require("../models/connection");
const { CheckBody } = require("../modules/checkBody");
const User = require("../models/users");
// -------------------- end of the Import's Zone --------------------

// -------------------- start of the routes Zone --------------------

// SignUp request ---------------------------------------------------------
router.post("/signup", (req, res) => {
  // Conditions to check if all those fields are in the body
  if (
    !CheckBody(req.body, [
      "username",
      "email",
      "password",
      "lastname",
      "firstname",
      "age",
      "birthDate",
      "gender",
    ])
    // if not return this response
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  console.log("debug body", req.body);
  // Trying to find an User with the email and username corresponding to the request
  User.findOne({
    email: req.body.email,
    username: req.body.username,
  }).then((data) => {
    // if data return nothing then it creates an user
    if (data === null) {
      // usage of uid2 to hash the password
      const hash = bcrypt.hashSync(req.body.password, 10);

      // allow the user to enter his birthDate in the body under the format of : DD/MM/YYYY
      const formattedBirthDate = moment(
        req.body.birthDate,
        "DD/MM/YYYY"
      ).toDate();
      const inscriptionDate = moment().toDate();

      // create an user with the following fields...
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        userType: "individual",
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        age: req.body.age,
        birthDate: formattedBirthDate,
        gender: req.body.gender,
        inscriptionDate: inscriptionDate,
        aspirations: {
          themesInterest: req.body.themesInterest,
          categoriesInterest: req.body.categoriesInterest,
          themeSkill: req.body.themeSkill,
          categoriesSkill: req.body.categoriesSkill
        },
        availability: {
          availability: req.body.availability,
          locationPreference: req.body.locationPreference
        },
        values: {
          preferredPeople: req.body.preferredPeople,
          preferredGroupType: req.body.preferredGroupType,
          personalValues: req.body.personalValues,
          causes: req.body.causes
        },
        avatar: req.body.avatar,
        descriptionProfile: req.body.descriptionProfile
      });
      newUser
        .save()
        .then((data) => {
          // if everything works fine you will get this response
          res.json({
            result: "User has been successfully been created",
            id: data._id,
            token: data.token,
          });
        })
        .catch((error) => {
          // if there was an interruption or an error from the server, you will get this response
          res.json({
            result: "An error occured while creating an user please try later",
            error: error.message,
          });
        });
    } else {
      // otherwise the client has tried to create an user with the same email or/and password than someone else
      res.json({
        result: false,
        error: "User with the same email or/and username already exist",
      });
    }
  });
});

// SignIn request ---------------------------------------------------------
router.post("/signin", (req, res) => {
  // Trying to find an User with the email and password corresponding to the request
  if (!CheckBody(req.body, ["email", "password"])) {
    // if there is an empty fields this is what the response will looks like...
    res.json({ result: "Connection failed", error: "Missing or empty fields" });
    return;
  }
  // Trying to find an user with the email of the body
  User.findOne({ email: req.body.email })
    .then((data) => {
      // if data returns something, check that the hashed possword (stored in the database) and that the hashed password in the body match
      if (data && bcrypt.compareSync(req.body.password, data.password)) {

        data
          .save()
          .then((data) => {
            // if everything was fine, then it returns this
            res.json({
              result: "User has successfully logged",
              token: data.token,
            });
          })
          .catch((error) => {
            // if an server error has occured while loging the user, you will get this type of response
            res.json({
              result:
                "An error occurred while updating the token, please try later",
              error: error.message,
            });
          });
      } else {
        // if the request didn't find anything it will return this response
        res.json({
          result: "Connection failed",
          error: "User not found or wrong password",
        });
      }
    })
    .catch((error) => {
      // if an server error has occured while trying to find the user, you will get this type of response
      res.json({
        result:
          "An error occurred while logging your account, please try later",
        error: error.message,
      });
    });
});

// GetInfosByToken request ---------------------------------------------------------
router.get("/GetInfos/:token", (req, res) => {
  // Trying to find an user with the token on the params
  User.findOne({ token: req.params.token })
    .then((data) => {
      // if an user has been found with this token it return every informations the user needs
      if (data) {
        res.json({
          username: data.username,
          email: data.email,
          lastname: data.lastname,
          firstname: data.firstname,
          age: data.age,
          birthDate: moment(data.birthDate).format("DD/MM/YYYY"),
          gender: data.gender,
          inscriptionDate: moment(data.inscriptionDate).format("DD/MM/YYYY"),
        });
        // if nothing has been found it return this type of response
      } else {
        res.json({
          result: "User not found",
          error: "If the error persist please try later",
        });
      }
    })
    // if an error occured while trying to fetch all the data, return this error...
    .catch((error) => {
      res.json({
        result: "Error while fetching your data",
        error: error.message,
      });
    });
});

// updateUserByToken request ---------------------------------------------------------
router.put("/updateUser/:token", (req, res) => {
  const updateFields = {};

  // List of fields that can be updated
  const updatableFields = [
    "username",
    "email",
    "password",
    "lastname",
    "firstname",
    "age",
    "birthDate",
    "gender",
    "avatar",
    "descriptionProfile",

    // aspirations embedded document ------
    "themesInterest",
    "categoriesInterest",
    "themeSkill",
    "categoriesSkill",

    // availability ------
    "availability",
    "locationPreference",

    // values ------
    "preferredPeople",
    "preferredGroupType",
    "personalValues",
    "causes",
  ];

  // Iterate over the updatable fields and add them to the updateFields object if they are present in the body
  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      // Check if the field is an object for embedded documents
        updateFields[field] = req.body[field];
      }
  });
  // If password is being updated, hash it again
  if (updateFields.password) {
    updateFields.password = bcrypt.hashSync(updateFields.password, 10);
  }

  // If birthDate is being updated, format will be DD/MM/YYYY
  if (updateFields.birthDate) {
    updateFields.birthDate = moment(
      updateFields.birthDate,
      "DD/MM/YYYY"
    ).toDate();
  }

  User.findOneAndUpdate(
    { token: req.params.token },
    { $set: updateFields },
    { new: true }
  )
    .then((updatedUser) => {
      if (updatedUser) {
        res.json({
          result: "User has successfully updated his data",
          data: updatedUser,
        });
      } else {
        res.json({
          result: "User has failed to update his data",
          error: "User not found",
        });
      }
    })
    .catch((error) => {
      res.json({
        result: "An error occurred while updating the User's data",
        error: error.message,
      });
    });
});

// deleteUserByToken request ---------------------------------------------------------
router.delete("/deleteUser/:token", (req, res) => {
  // trying to find an user using the token
  User.deleteOne({ token: req.params.token }).then((data) => {
    // if an user has been found, the user related to the token is deleted
    if (data) {
      res
        .json({
          result: "Your user has been succesfully deleted",
          message: "We hope to see you back soon !",
        })
        // if an error occured while trying to delete the user this will return this error...
        .catch((error) => {
          res.json({
            result: "Error while deleting your account",
            error: error.message,
          });
        });
    }
  });
});
// -------------------- end of the routes Zone --------------------

module.exports = router;
