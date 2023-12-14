const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // use regex to validate e-mail
        validate: {
            validator: function (email) {
                return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email);
            },
            // message to display if validation failed
            message: props => `${props.value} is not a valid email!`
        }
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    ]
  },
  // add virtuals to populate during GET method
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// virtual to get the friend count of a specific user using this keyword
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
})

// store User model in a const
const User = model('user', userSchema);

// export User model
module.exports = User;