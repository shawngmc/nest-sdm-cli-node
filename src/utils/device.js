const fetch = require('node-fetch');
const fs = require('fs');
const configUtils = require('./config');
const tokenUtils = require('./token');

const findDevice = (devices, deviceRef) => {
  if (deviceRef === undefined || deviceRef === "") {
    throw Error("Device required.");
  }

  // See if we have a valid device ID
  let idMatch = devices.find(d => d.id == deviceRef);
  if (idMatch) {
    return idMatch;
  } else {
    // See if we have a valid device name
    let nameMatch = devices.find(d => d.displayName == deviceRef);
    if (nameMatch) {
      return nameMatch;
    } else {
      throw Error("Device " + deviceRef + " not found.");
    }
  }
};


const getSDMDeviceList = async () => {
  let config = configUtils.getConfig();
  let token = await tokenUtils.getToken();
  try {
    const url = "https://smartdevicemanagement.googleapis.com/v1/enterprises/" + config.sdm_client_id + "/devices";
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token.access_token
      },
      method: "GET"
    });
    const json = await response.json();
    let deviceList = [];
    json.devices.forEach((device) => {
      deviceList.push({
        name: device.name,
        id: device.name.substring(device.name.lastIndexOf("/") + 1),
        displayName: device.parentRelations[0].displayName,
        type: device.type,
        traits: Object.getOwnPropertyNames(device.traits)
      });
    })
    return json;
  } catch (error) {
    console.log(error);
  }
};

const writeDeviceCache = (deviceList) => {
  fs.writeFileSync('devices.json', JSON.stringify(deviceList, null, 4));
};

const readDeviceCache = () => {
  return JSON.parse(fs.readFileSync('devices.json'));
};

const getDeviceList = (force) => {
  let devices = null;

  // Check the local cache unless forced
  if (!force) {
    devices = readDeviceCache();
  }

  if (devices == null || devices.length == 0) {
    let deviceResponse = getSDMDeviceList();
    devices = convertDevices(deviceResponse);
    writeDeviceCache(devices);
  }

  return devices;
}



module.exports = { findDevice, getDeviceList, getSDMDeviceList }
