const router = require('express').Router();
const {
  getSingleThought,
  getThoughts,
  createThought,
} = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(createThought);

router.route('/:postId').get(getSinglePost);

module.exports = router;