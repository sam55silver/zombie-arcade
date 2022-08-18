const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore().collection("high_scores");
const app = express();

app.use(cors({ origin: true }));

app.get("/", async (req, res) => {
  const snapshot = await db.orderBy("score", "desc").limit(10).get();

  let scores = [];
  snapshot.forEach((score) => {
    let id = score.id;
    let data = score.data();

    scores.push({ id, ...data });
  });

  res.status(200).send(JSON.stringify(scores));
});

app.post("/", async (req, res) => {
  const score = req.body;

  await db.add(score);

  res.status(201).send();
});

exports.high_scores = functions.https.onRequest(app);
