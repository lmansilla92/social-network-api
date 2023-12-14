const { User, Thought } = require('../models');

module.exports = {
  // Get all users and return data in json
  async getUsers(req, res) {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
  },
  // Get single user using _id and return data in json
  async getSingleUser(req, res) {
    try {
        const user = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('friends'); // populate friends subdocument

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
  },
  // create a new user by using the req.body and respond with data in json
  async createUser(req, res) {
    try {
        const dbUserData = await User.create(req.body);
        res.json(dbUserData);
    } catch (err) {
        res.status(500).json(err);
    }
  },
  // update a new user by using _id
  async updateUser(req, res) {
    try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId }, // find user by id
          { $set: req.body }, // update user with req.body input
          { new: true }, // return new updated object
        );

        if (!user) {
          return res
            .status(404)
            .json({ message: 'No user found with that ID' });
        }
        res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
   // find user by _id and delete it
  async deleteUser(req, res) {
    try {
      // delete user by _id by using req.params.userId
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      console.log('user.thoughts', user.thoughts);
      // delete user's associated thoughts using $in operator
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.status(200).json({ message: `Deleted '${user.username}' user and associated thoughts!` });
    } catch (err) {
      res.status(500).json({ message: 'No user found with that ID to delete'});
    }
  },
  // add friend
  async addFriend(req, res) {
    try {
      // find user by _id and add friend 
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId }, // filter to find user by _id
        { $addToSet: { friends: req.params.friendId } }, // add new friend to friends array using req.params.friendId
        { new: true } // return updated user object to include new friend
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with this ID' });
      }

      // respond with new updated user object in json
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'No user found with that ID' });
    }
  },
  // remove friend
  async removeFriend(req, res) {
    try {
      // find user by _id using req.params.userId
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        // remove friend using req.params.friendId from friends array
        { $pull: { friends: req.params.friendId } },
        // return new updated user object
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with this ID' });
      }
      
      // respond with updated user object in json
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'No user found with that ID' });
    }
  }
};