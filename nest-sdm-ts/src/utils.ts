import * as fs from 'fs'
import { Token, Config, Device } from './types'
import fetch, { RequestInfo, Response, Headers } from 'node-fetch';

const readCachedToken = (): Token | null => {
  let token = null;
  try {
    let tokenData = JSON.parse(fs.readFileSync('token.json').toString());
    token = new Token(tokenData.access_token, tokenData.token_expiry)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.log(error);
    }
  }
  return token;
}

const readConfig = (): Config | null => {
  let config = null;
  try {
    let configData = JSON.parse(fs.readFileSync('config.json').toString());
    config = new Config(configData.client_id, configData.client_secret, configData.refresh_token, configData.sdm_client_id)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.log(error);
    }
  }
  return config;
}

const refreshAccessToken = async (config: Config): Promise<Token> => {
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
  const json : any = await response.json();

  let sessionData = new Token(json.access_token, new Date(Date.now() + (json.expires_in - 60) * 1000));
  fs.writeFileSync('token.json', JSON.stringify(sessionData));
  return sessionData
};


const findDevice = (devices: Device[], deviceRef: string | null) => {
  if (deviceRef === undefined || deviceRef === "") {
      throw Error("Device required.");
  }

  // See if we have a valid device ID
  let idMatch = devices.find(d => d.id == deviceRef);
  if (idMatch) {
      return idMatch;
  } else {
      // See if we have a valid device name
      let nameMatch = devices.find(d => d.displayname == deviceRef);
      if (nameMatch) {
          return nameMatch;
      } else {
          throw Error("Device " + deviceRef + " not found.");
      }
  }
};

const checkDeviceTrait = (device : Device, trait : string) => {
  let traitSearchString = "sdm.devices.traits." + trait;
  let traitMatch = device.traits.find(t => t == traitSearchString);

  if (!traitMatch) {
      throw Error("Trait " + traitSearchString + " not valid for device " + device.displayname);
  }
};

export default { readCachedToken, refreshAccessToken, readConfig, checkDeviceTrait, findDevice }
