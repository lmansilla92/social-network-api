// import Thought and User models
const { Thought, User } = require('../models');

// export all thought controllers
module.exports = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
        // find all thoughts
        const thoughts = await Thought.find();
        res.json(thoughts); // respond with array of thought objects in json
    } catch (err) {
        res.status(500).json(err);
    };
  },
  // get single thought by id
  async getSingleThought(req, res) {
    try {
        // find thought by id in req.params.thoughtId
        const thought = await Thought.findOne({ _id: req.params.thoughtId });

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
        };

        // respond with the single thought found in json
        res.json(thought);

    } catch (err) {
        res.status(500).json(err);
    };
  },
  // create a new thought
  async createThought(req, res) {
    try {
        const thought = await Thought.create(req.body); // create new thought using req.body
        // find user by username and update the thought array by adding the new thought id using $addToSet
        const user = await User.findOneAndUpdate(
            { username: req.body.username }, // filter to find user by username in the req.body
            { $addToSet: { thoughts: thought._id } }, // update the thoughts array by adding the newly created thought by its id
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
    };
  },
  // update a thought
  async updateThought(req, res) {
    try {
        // find thought by _id and update it using the req.body data
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId}, // filter to find thought by _id
            { $set: req.body }, // updating the thought using req.body data
            { new: true } // return new updated thought object in json
        );
        
        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No thought found with this ID' });
        };

        // respond with updated thought object
        res.json(thought);

    } catch (err) {
        res.status(500).json(err);
    };
  },
  // delete thought
  async deleteThought(req, res) {
    try {
        // find thought by _id and delete it
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        // respond with 200 status and json messsage
        res.status(200).json({ message: 'Thought successfully deleted!' });
        console.log('Thought deleted!');
    } catch (err) {
        res.status(500).json(err);
    };
  },
  // create reaction
  async createReaction(req, res) {
    try {
            // find thought by _id and add the reaction in the req.body to the reactions array using $addToSet
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId }, // filter to find thought by _id using req.params.thoughtId
                { $addToSet: { reactions: req.body } }, // add reaction in req.body to the reactions array 
                { new: true } // return new updated thought object
            );
            // If no thought was found respond with 404 and json message
            if (!thought) {
                res.status(404).json({ message: 'No thought found with this ID'});
            };

            // respond with the new thought object in json
            res.json(thought);
            
    } catch (err) {
        res.status(500).json(err);
    };
  },
  // delete reaction
  async deleteReaction(req, res) {
    try {
        // Find thought by _id and remove reaction by reactionId
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId }, // filter to find thought by _id using req.params.thoughtId
            { $pull: { reactions: { reactionId: req.params.reactionId } } }, // remove reaction from reactions array
            { new: true } // return updated thought object
        );

        if (!thought) {
            res.status(404).json({ message: 'No thought found with this ID' });
        };

        // respond with new updated thought object in json
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    };
  }
};