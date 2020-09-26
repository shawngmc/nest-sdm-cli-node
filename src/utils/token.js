
const fetch = require('node-fetch');
const fs = require('fs');
const configUtils = require('./config');

const readTokenCache = () => {
  try {
    return token = JSON.parse(fs.readFileSync('token.json').toString());
  } catch (error) {
    throw Error ("Could not read token file?");
  }
}

const writeTokenCache = (token) => {
  fs.writeFileSync('token.json', JSON.stringify(token, null, 4));
}

const refreshAccessToken = async () => {
  let config = configUtils.getConfig();
  const params = new URLSearchParams();
  params.append('client_id', config.client_id);
  params.append('client_secret', config.client_secret);
  params.append('refresh_token', config.refresh_token);
  params.append('grant_type', "refresh_token");

  const url = "https://www.googleapis.com/oauth2/v4/token?" + params.toString();
  const opts = {
    method: "POST"
  };
  const response = await fetch(url, opts);
  const json = await response.json();

  return {
    access_token: json.access_token,
    token_expiry: new Date(Date.now() + (json.expires_in - 60) * 1000)
  };
};

const isTokenValid = (token) => {
  if (token == null) {
    return false;
  }

  if (token.access_token == null) {
    return false;
  }

  if (!(token.token_expiry instanceof Date) || isNaN(token.token_expiry)) {
    return false;
  }

  if (new Date() >= new Date(token.token_expiry)) {
    return false;
  }

  return true;
};

const getToken = async () => {
  let token = null;

  try {
    token = readTokenCache();
  } catch (error) {
    console.log("Could not find or read cached token due to: " + error);
  }

  if (token == null || !isTokenValid(token)) {
    try {
      token = await refreshAccessToken();
      writeTokenCache(token);
    } catch (error) {
      console.log("Could not retrieve a new token due to: " + error);
    }
  }

  return token;
}

module.exports = { getToken, isTokenValid }
