const _ = require("lodash");
const router = require("express").Router();
const objectID = require("mongoose").Types.ObjectId;

const { User, validate } = require("../models/users");

router.get("/", async (req, res) => {
  const { gender, age, name } = req.query;

  if (!_.isUndefined(gender) && !_.isUndefined(age)) {
    usersFromDB = await User.find({ gender: gender, age: age });
    return res.json(usersFromDB);
  } else if (!_.isUndefined(gender)) {
    usersFromDB = await User.find({ gender: gender });
    return res.json(usersFromDB);
  } else if (!_.isUndefined(age)) {
    usersFromDB = await User.find({ age: age });
    return res.json(usersFromDB);
  } else if (!_.isUndefined(name)) {
    usersFromDB = await User.find({ name: name });
    return res.json(usersFromDB);
  }

  const users = await User.find();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  userID = req.params["id"];
  if (!objectID.isValid(userID)) {
    return res.status(404).send();
  }

  userFromDB = await User.findById(userID);
  if (_.isNull(userFromDB)) {
    return res.status(404).send();
  }
  res.json(userFromDB);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send({ validation: error.details[0].message });
  }
  const { name, gender, age } = _.pick(req.body, ["name", "gender", "age"]);

  await User.create({ gender, age, name });

  res.status(201).send();
});

router.put("/:id", async (req, res) => {
  userID = req.params["id"];
  if (!objectID.isValid(userID)) {
    return res.status(404).send();
  }

  const { error } = validate(req.body);
  if (error) {
    res.status(404).send({ validation: error.details[0].message });
  }

  const { name, gender, age } = _.pick(req.body, ["name", "gender", "age"]);

  const userFromDB = await User.findByIdAndUpdate(userID, {
    name,
    gender,
    age
  });
  if (userFromDB) {
    return res.status(204).send();
  }
});

router.delete("/:id", async (req, res) => {
  userID = req.params["id"];

  if (!objectID.isValid(userID)) {
    return res.status(404).send({ error: "invalid ID" });
  }

  const userFromDB = await User.findByIdAndRemove(userID);
  if (!userFromDB) {
    return res.status(404).send();
  }

  res.status(204).send();
});

module.exports = router;
