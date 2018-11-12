module.exports = function (app) {
  const Users = require('../models/users');

  //  List all Users
  app.get('/users', async (req, res) => {
    Users.find()
      .then((users) => {
        res.send({ users });
      });
  });

  // List single user info by mongodb ID
  app.get('/users/:usersid', async (req, res) => {
    Users.find({ "_id": req.params.usersid })
      .then((users) => {
        res.send({ users });
      });
  });

  // Create a new user + info 
  app.post('/users', async (req, res) => {
    Users.create(req.body)
      .then((user) => {
        res.send(user);
      });
  });

  // Update user's info by mongodb ID
  app.put('/users/:usersid', async (req, res) => {
    Users.findByIdAndUpdate(req.params.usersid, { $set: req.body })
      .then(() => {
        res.send(req.body);
      });
  });

  // Delete user by mongodb ID
  app.delete('/users/:usersid', async (req, res) => {
    Users.deleteOne({ _id: req.params.usersid })
      .then(() => {
        res.send("User Deleted");
      });
  });
}
