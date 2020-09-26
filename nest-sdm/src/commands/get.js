const { Command, flags } = require('@oclif/command')
const fetch = require('node-fetch');
const deviceUtils = require('../utils/device');
const configUtils = require('../utils/config');
const tokenUtils = require('../utils/token');

const getStatus = async (deviceId) => {
  try {
    let config = configUtils.getConfig();
    let token = await tokenUtils.getToken();

      const url = "https://smartdevicemanagement.googleapis.com/v1/enterprises/" + config.sdm_client_id + "/devices/" + deviceId;
      const opts = {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token.access_token
          }
      };
      const response = await fetch(url, opts);
      const json = await response.json();
      return json;
  } catch (error) {
      console.log(error);
  }
};

class GetCommand extends Command {
  async run() {
    const { flags } = this.parse(GetCommand)
    let devices = await deviceUtils.getDeviceList();

    // Make sure device is valid
    let device = deviceUtils.findDevice(devices, flags.device);

    let result = await getStatus(device.id);
    console.log(result);
  }
}

GetCommand.description = `Get the status of a specific device from Nest Device Access`

GetCommand.flags = {
  help: flags.help({ char: 'h' }),
  device: flags.string({ char: 'd'})
}

module.exports = GetCommand;
