const express = require('express');
const router = express.Router();
const {MongoClient} = require("mongodb");

router.get('/', async (req, res) => {
  let client = new MongoClient(mongoUrl)
  try {
    let database = client.db("jokeapi");
    let collection = database.collection('jokes')
    const jokes = await collection.findOne();
    res.status(200).json(jokes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jokes' });
  } finally {
    client.close()
  }
});
// GET a joke by ID
router.get('/:id', async (req, res) => {
  const jokeId = req.params.id;
  let client = new MongoClient(mongoUrl)
  try {
    let db = client.db("jokeapi");
    const joke = await db.collection('jokes').findOne({ _id: ObjectId(jokeId) });
    if (joke) {
      res.status(200).json(joke);
    } else {
      res.status(404).json({ message: 'Joke not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the joke' });
  }
});

const newJoke = {
  joke: "Why did the chicken cross the road?",
  category: "Animal",
  answer: "To get to the other side"
};

// POST create a new joke
router.post('/', async (req, res) => {
  const newJoke = req.body;
  let client = new MongoClient(mongoUrl)
  try {
    let db = client.db("jokeapi");
    const result = await db.collection('jokes').insertOne(newJoke);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a joke' });
  } finally {
    client.close()
  }
});

// PUT update a joke by ID
router.put('/:id', async (req, res) => {
  const jokeId = req.params.id;
  const updatedJoke = req.body;
  let client = new MongoClient(mongoUrl)
  try {
    let db = client.db("jokeapi");
    const result = await db.collection('jokes').updateOne(
      { id: jokeId},
      { $set: updatedJoke }
    );
    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Joke not found' });
    } else {
      res.status(200).json({ message: 'Joke updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the joke' });
  }
});

// DELETE a joke by ID
router.delete('/:id', async (req, res) => {
  const jokeId = req.params.id;
  let client = new MongoClient(mongoUrl)
  try {
    let db = client.db("jokeapi");
    const result = await db.collection('jokes').deleteOne({ id: jokeId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Joke not found' });
    } else {
      res.status(200).json({ message: 'Joke deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the joke' });
  }
});
const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'joke_db';

module.exports = router;
