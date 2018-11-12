// [ ROUTES /// POSTS ] //
const appPosts = require('./api/routes/postsRoutes');
// [ ROUTES /// POSTS ] //
const appComments = require('./api/routes/postsRoutes');
// [ ROUTES /// POSTS ] //
const appFriends = require('./api/routes/postsRoutes');
// [ ROUTES /// POSTS ] //
const appPlaces = require('./api/routes/postsRoutes');
// [ ROUTES /// POSTS ] //
const appUsers = require('./api/routes/postsRoutes');

module.exports = appPosts()
module.exports = appComments()
module.exports = appFriends()
module.exports = appPlaces()
module.exports = appUsers()



