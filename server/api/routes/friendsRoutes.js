module.exports = function (app) {
  const Friends = require('../models/friends');

  //  List all friends
  app.get('/users/:usersId/friends', async (req, res) => {
    Friends.find()
      .then((friends) => {
        res.send({ friends });
      });
  });

  // List single video info by mongodb ID
  app.get('/users/:usersId/friends/:friendsId', async (req, res) => {
    Friends.find({ "_id": req.params.friendsId })
      .then((friends) => {
        res.send({ friends });
      });
  });

  // Add a nre friend
  app.post('/users/:usersId/friends/', async (req, res) => {
    Friends.create(req.body)
      .then((friends) => {
        res.send(friends);
      });
  });

  // Update user's friends by mongodb ID
  app.put('/users/:usersId/friends/:friendsId', async (req, res) => {
    Friends.findByIdAndUpdate(req.params.friendsId, { $set: req.body })
      .then(() => {
        res.send(req.body);
      });
  });

  // Delete video by mongodb ID
  app.delete('/users/:usersId/friends/:friendsId', async (req, res) => {
    Friends.deleteOne({ _id: req.params.friendsId })
      .then(() => {
        res.send("Friend Deleted");
      });
  });
}
