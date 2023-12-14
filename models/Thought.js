// import Schema, mode, Types by requiring mongoose
const { Schema, model, Types } = require('mongoose');
// import moment to format timestamps
const moment = require('moment');

// reaction schema
const reactionSchema = new Schema(
  {
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // user getter to format timestamp using moment
        get: (date) => moment(date).format("MMM DD, YYYY [at] hh:mm a")
    }
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// thought schema
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
        // user getter to format timestamp using moment
        get: (date) => moment(date).format("MMM DD, YYYY [at] hh:mm a")
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
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
})

// store Thought model in a const
const Thought = model('thought', thoughtSchema);

// export Thought model
module.exports = Thought;