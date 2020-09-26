import { Command, flags } from '@oclif/command'
import utils from '../utils'
import * as fs from 'fs'
import { Token, Config, Device } from '../types'
import fetch, { Headers } from 'node-fetch';

const listDevices = async (config: Config, token: Token) : Promise<Device[]> => {
  const url = "https://smartdevicemanagement.googleapis.com/v1/enterprises/" + config.sdm_client_id + "/devices";
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", "Bearer " + token.access_token);

  const response = await fetch(url, {
    headers: headers,
    method: "GET"
  });
  const json : any = await response.json();

  let deviceList : Device[] = [];
  json.devices.forEach((device: any) => {
      deviceList.push(new Device(device.name, device.name.substring(device.name.lastIndexOf("/") + 1),
        device.parentRelations[0].displayName, device.type, Object.getOwnPropertyNames(device.traits)));
  })
  fs.writeFileSync('devices.json', JSON.stringify(deviceList, null, 4));

  return deviceList;
};

const getDevice = async (config: Config, token: Token, device : Device) : Promise<any> => {
  const url = "https://smartdevicemanagement.googleapis.com/v1/enterprises/" + config.sdm_client_id + "/devices/" + device.id;
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", "Bearer " + token.access_token);

  const response = await fetch(url, {
    headers: headers,
    method: "GET"
  });
  const json : any = await response.json();

  return json;
};

export default class Get extends Command {
  static description = 'Get the list of devices from Nest Device Access'

  static examples = [
    `$ nest-sdm list`,
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    device: flags.string({ char: 'd'})
  }

  static args = []

  async run() {
    const { args, flags } = this.parse(Get)
    let config = utils.readConfig()

    if (config == null) {
      throw Error("No config found.")
    } else {
      let token = utils.readCachedToken()
      if (token == null || !token.isValid()) {
        console.log('Fetching new token...');
        token = await utils.refreshAccessToken(config);
      } else {
        console.log('Using cached access token...');
      }

      if (!flags.device) {
        throw Error("A device reference (display name or ID) is required.")
      }

      if (token != null) {
        let devices : Device[] = await listDevices(config, token);

        let device = utils.findDevice(devices, flags.device);

        let deviceStatus : any = await getDevice(config, token, device);

        console.log(JSON.stringify(deviceStatus, null, 4));
      }
    }
  }
}
