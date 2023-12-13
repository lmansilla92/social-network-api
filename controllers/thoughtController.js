const { Thought, User } = require('../models');

module.exports = {
  async getThoughts(req, res) {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
  },
  // get single thought by id
  async getSingleThought(req, res) {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId }); // find thought by id in req.params.thoughtId

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
        }

        // respond with the single thought found in json
        res.json(thought);

    } catch (err) {
        res.status(500).json(err)
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
        const thought = await Thought.create(req.body); // create new thought using the req.body input
        // find user by username and update the thought array by adding the thought id using $addToSet
        const user = await User.findOneAndUpdate(
            { username: req.body.username }, // filter to find user by username
            { $addToSet: { thoughts: thought._id } }, // update the thoughts array by adding a thought by its id
            { new: true } // return new updated object
        );

        if (!user) {
            return res
                .status(404)
                .json({ message: 'Thought created, but found no user with that ID' });
        }

        // respond with new thought in json
        res.json(thought);
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
  },
  // update a thought
  async updateThought(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $set: req.body },
            { new: true }
        );
        
        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No thought found with this ID' });
        }

        res.json(thought);

    } catch (err) {
        res.status(500).json(err);
    }
  }
};