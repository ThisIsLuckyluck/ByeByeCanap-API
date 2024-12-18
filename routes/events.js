// -------------------- start of the Import Zone --------------------
const express = require("express");
const router = express.Router();
const moment = require("moment");
require("../models/connection");
const { CheckBody } = require("../modules/checkBody");
const Users = require("../models/users");
const events = require("../models/events");
// -------------------- end of the Import Zone --------------------

// -------------------- start of the events routes zone --------------------

// Routes for create an event ----------------------------------------------
router.post("/createEvent", async (req, res) => {
  // token verification in the header
  const token = req.headers.authorization;
  // conditions for verify if those field are present in the request
  if (
    !CheckBody(req.body, [
      "title",
      "theme",
      "category",
      "reference",
      "eventDate",
      "adress",
    ])
    // if not, return this error
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  // search the corresponding users with the token insert
  try {
    const userData = await Users.findOne({ token: token });
    // if no user has been found, return this error
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const profileinfosId = userData._id;

    const {
      title,
      theme,
      category,
      reference,
      image,
      eventDate,
      sizeGroup,
      description,
      adress,
      minAgeRange,
      maxAgeRange,
      everyAge,
      gender,
      other,
    } = req.body;

    // fetching French API to get Long & Lat by entering the city name
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${adress}&limit=1`
    );
    // store the response in data
    const data = await response.json();

    // if data is empty then it returns this response
    if (!data.features.length) {
      return res.status(404).json({ error: "Nothing found" });
    }

    // Path of the coords in the API response
    const longitude = data.features[0].geometry.coordinates[0];
    const latitude = data.features[0].geometry.coordinates[1];

    // formate Date to be in this format : DD/MM/YYYY
    const formattedeventDate = moment(eventDate, "DD/MM/YYYY").toDate();
    console.log(userData._id);
    console.log("Longitude :", longitude);
    console.log("Latitude :", latitude);

    // create the events with the previous informations
    const newEvent = new events({
      organizer: profileinfosId, // doesnt work
      title,
      theme,
      category,
      reference,
      image,
      formattedeventDate,
      location: {
        adress: adress,
        latitude: latitude,
        longitude: longitude,
      },
      sizeGroup,
      description,
      preferences: {
        minAgeRange: minAgeRange,
        maxAgeRange: maxAgeRange,
        everyAge: everyAge,
        gender: gender,
        other: other,
      },
      participants: [],
      isFinished: false,
    });

    await newEvent.save();
    console.log("New Event", newEvent);

    // if the event has been succesfully created :
    res.status(201).json({ message: "Event created succesfully", newEvent });
    // if the server get an error while fetching the data
  } catch (error) {
    console.error("Couldn't create an event :", error);
    res.status(500).json({
      message: "Server error, please try later.",
      error: error.message,
    });
  }
});

// Routes for get all the events ----------------------------------------------
router.get("/GetAllEvent", async (req, res) => {
  // token verification in the header
  const token = req.headers.authorization;

  // Trying to find an user with the corresponding token
  try {
    const userData = await Users.findOne({ token: token });

    // if no user has been found :
    if (!userData) {
      return res.status(401).json({ error: "Unauthorized acces" });
    }

    const data = await events.find();

    if (data.length === 0) {
      return res.json({
        message: "Event not found",
      });
    }
    // Allow to filter the response, if the event is finished
    const finishedEvents = data.filter((event) => event.isFinished);
    const ongoingEvents = data.filter((event) => !event.isFinished);

    // If event is finished return that it's done
    if (finishedEvents.length > 0) {
      return res.json({
        message: "Event done",
        result: finishedEvents,
      });
    }

    res.json({
      message: "Here's the list of the events 👇",
      result: ongoingEvents,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      message: "Server error, please try later.",
      error: error.message,
    });
  }
});
// -------------------- end of the events routes zone --------------------

module.exports = router;
