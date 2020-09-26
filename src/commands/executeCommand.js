const { Command, flags } = require('@oclif/command')
const fetch = require('node-fetch');
const deviceUtils = require('../utils/device');
const configUtils = require('../utils/config');
const tokenUtils = require('../utils/token');

const executeCommand = async (command, params, deviceId) => {
  try {
    let config = configUtils.getConfig();
    let token = await tokenUtils.getToken();
      const body = {};
      body.command = command;
      body.params = params;

      const url = "https://smartdevicemanagement.googleapis.com/v1/enterprises/" + config.sdm_client_id + "/devices/" + deviceId + ":executeCommand";
      const opts = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token.access_token
          },
          body: JSON.stringify(body)
      };
      const response = await fetch(url, opts);
      const json = await response.json();
      return json;
  } catch (error) {
      console.log(error);
  }
};


const checkDeviceTrait = (device, trait) => {
  let traitSearchString = "sdm.devices.traits." + trait;
  let traitMatch = device.traits.find(t => t == traitSearchString);

  if (!traitMatch) {
    throw Error("Trait " + traitSearchString + " not valid for device " + device.displayName);
  }
};


class ExecuteCommand extends Command {
  async run() {
    const { flags } = this.parse(ExecuteCommand)
    let devices = await deviceUtils.getDeviceList();

    // Make sure device is valid
    let device = deviceUtils.findDevice(devices, flags.device);

    // Make sure device has those traits
    checkDeviceTrait(device, flags.trait);

    // Parse Params
    let params = null;
    if (flags.params) {
      try {
        params = {};
        flags.params.forEach((paramStr) => {
          let dividerPos = paramStr.indexOf("=");
          let key = paramStr.substring(0, dividerPos);
          let value = paramStr.substring(dividerPos + 1);
          params[key] = value;
        })
      } catch (error) {
        throw Error("Could not parse given params.");
      }
    }

    let result = await executeCommand("sdm.devices.commands." + flags.trait + "." + flags.command, params, device.id);
    console.log("Command accepted, response: " + JSON.stringify(result));
  }
}

ExecuteCommand.description = `Get the list of devices from Nest Device Access`

ExecuteCommand.flags = {
  help: flags.help({ char: 'h' }),
  device: flags.string({ char: 'd'}),
  trait: flags.string({ char: 't'}),
  command: flags.string({ char: 'c'}),
  params: flags.string({ char: 'p', multiple: true})
}

module.exports = ExecuteCommand;
