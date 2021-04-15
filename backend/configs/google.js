const { OAuth2Client } = require("google-auth-library");
const Google = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = Google;
