module.exports = function (app) {
  const Images = require('../models/images');

  //  List all images
  app.get('/users/:usersId/posts/images', async (req, res) => {
    Images.find()
      .then((images) => {
        res.send({ images });
      });
  });

  // List single image info by mongodb ID
  app.get('/users/:usersId/posts/:postsId/images/:imagesId', async (req, res) => {
    Images.find({ "_id": req.params.imagesId })
      .then((images) => {
        res.send({ images });
      });
  });

  // Create a new image
  app.post('/users/:usersId/posts/:postsId/images', async (req, res) => {
    Images.create(req.body)
      .then((user) => {
        res.send(user);
      });
  });

  // Update user's images by mongodb ID
  app.put('/users/:usersId/posts/:postsId/images/:imagesId', async (req, res) => {
    Images.findByIdAndUpdate(req.params.imagesId, { $set: req.body })
      .then(() => {
        res.send(req.body);
      });
  });

  // Delete image by mongodb ID
  app.delete('/users/:usersId/posts/:postsId/images/:imagesId', async (req, res) => {
    Images.deleteOne({ _id: req.params.imagesId })
      .then(() => {
        res.send("Image Deleted");
      });
  });
}
