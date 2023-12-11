const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
  {
    thoughtText: {
        type: String,
        required: true,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    username: {
        type: String,
        required: true,
    },
    // array of nested documents created with the reactionSchema
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

// Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.

const Thought = model('thought', thoughtSchema);

module.exports = Thought;