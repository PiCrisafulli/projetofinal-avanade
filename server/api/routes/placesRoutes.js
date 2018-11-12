module.exports = function (app) {
  const Places = require('../models/places');

  //  List all images
  app.get('/users/:usersId/places', async (req, res) => {
    Places.find()
      .then((images) => {
        res.send({ images });
      });
  });

  // List single image info by mongodb ID
  app.get('/users/:usersId/places/:placesId', async (req, res) => {
    Places.find({ "_id": req.params.placesId })
      .then((images) => {
        res.send({ images });
      });
  });

  // Create a new image
  app.post('/users/:usersId/places', async (req, res) => {
    Places.create(req.body)
      .then((user) => {
        res.send(user);
      });
  });

  // Update user's images by mongodb ID
  app.put('/users/:usersId/places/:placesId', async (req, res) => {
    Places.findByIdAndUpdate(req.params.placesId, { $set: req.body })
      .then(() => {
        res.send(req.body);
      });
  });

  // Delete image by mongodb ID
  app.delete('/users/:usersId/places/:placesId', async (req, res) => {
    Places.deleteOne({ _id: req.params.placesId })
      .then(() => {
        res.send("Place Deleted");
      });
  });
}
