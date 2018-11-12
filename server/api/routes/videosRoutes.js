module.exports = function (app) {
  const Videos = require('../models/videos');

  //  List all videos
  app.get('/users/:id/posts/videos', async (req, res) => {
    Videos.find()
      .then((videos) => {
        res.send({ videos });
      });
  });

  // List single video info by mongodb ID
  app.get('/users/:id/posts/:postId/videos/:videosId', async (req, res) => {
    Videos.find({ "_id": req.params.videosId })
      .then((videos) => {
        res.send({ videos });
      });
  });

  // Create a new video
  app.post('/users/:id/posts/videos', async (req, res) => {
    Videos.create(req.body)
      .then((user) => {
        res.send(user);
      });
  });

  // Update user's videos by mongodb ID
  app.put('/users/:id/posts/:postId/videos/:videosId', async (req, res) => {
    Videos.findByIdAndUpdate(req.params.videosId, { $set: req.body })
      .then(() => {
        res.send(req.body);
      });
  });

  // Delete video by mongodb ID
  app.delete('/users/:id/posts/:postId/videos/:videosId', async (req, res) => {
    Videos.deleteOne({ _id: req.params.videosId })
      .then(() => {
        res.send("video Deleted");
      });
  });
}
