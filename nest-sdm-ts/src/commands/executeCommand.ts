import { Command, flags } from '@oclif/command'
import utils from '../utils'
import * as fs from 'fs'
import * as https from 'https'
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

const executeCommandEx = async () => {
  try {

    https.
      const body = {};
      body.command = "sdm.devices.commands.CameraLiveStream.GenerateRtspStream";
      body.params = null;

      const url = "https://smartdevicemanagement.googleapis.com/v1/enterprises/" + "sdm.devices.commands.CameraLiveStream.GenerateRtspStream" + "/devices/" + "AVPHwEtzqAEOq1N7LlEtdUP0uOTCM3p3VmiSLOZIl_tsxhy18GgfzcBBWrH1vfIjHfrXjEiG7tZI-NicLRmptZjpatn2mw" + ":executeCommand";
      console.log(url);
      console.log(body);
      const opts = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + "ya29.a0AfH6SMAXoLvZK350Cjkqme1JmIfP0498Ku8We2Fsj2zx4MeHTMSjVJILQhx2KYqhzvIQ224iRmjf1LhbUnQBmRCvg9CAjX8AQzkOIwFNUvt5-lMip5c5RLBd4xxBSuRni8SxfKKTenAikHEqz9Clzlvaadl8_Z_BbTeM"
          },
          body: JSON.stringify(body)
      };
      console.log(opts)
      const response = await fetch(url, opts);
      const json = await response.json();
      return json;
  } catch (error) {
      console.log(error);
  }
}


const executeCommand = async (config: Config, token: Token, device : Device, command : string, params : any) : Promise<any> => {
  try {
      const body = {};
      body.command = command;
      body.params = null;

      const url = "https://smartdevicemanagement.googleapis.com/v1/enterprises/" + config.sdm_client_id + "/devices/" + device.id + ":executeCommand";
      console.log(url);
      console.log(body);
      const opts = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token.access_token
          },
          body: JSON.stringify(body)
      };
      console.log(opts)
      const response = await fetch(url, opts);
      const json = await response.json();
      return json;
  } catch (error) {
      console.log(error);
  }
  // const body : any = {};
  // body.command = command;
  // body.params = null;

  // const url = "https://smartdevicemanagement.googleapis.com/v1/enterprises/" + config.sdm_client_id + "/devices/" + device.id + ":executeCommand";
  // console.log(url);
  // console.log(body);
  // console.log(JSON.stringify(body));
  // const headers = new Headers();
  // headers.set("Content-Type", "application/json");
  // headers.set("Authorization", "Bearer " + token.access_token);
  // console.log(headers);

  // const response = await fetch(url, {
  //   headers: headers,
  //   method: "POST",
  //   body: JSON.stringify(body)
  // });
  // console.log(response);
  // const json : any = await response.json();
  // return json;
};

export default class ExecuteCommand extends Command {
  static description = 'Get the list of devices from Nest Device Access'

  static examples = [
    `$ nest-sdm list`,
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    device: flags.string({ char: 'd'}),
    trait: flags.string({ char: 't'}),
    command: flags.string({ char: 'c'}),
    params: flags.string({ char: 'p'})
  }

  static args = []

  async run() {
    const { args, flags } = this.parse(ExecuteCommand)
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

      if (!flags.trait) {
        throw Error("A trait to target on the device is required.")
      }

      if (!flags.command) {
        throw Error("A command to run against the trait on the device is required.")
      }

      let params : any = {};
      // if (flags.params) {
      //   params = JSON.parse(flags.params);
      // }

      if (token != null) {
        let devices : Device[] = await listDevices(config, token);

        let device = utils.findDevice(devices, flags.device);

        let commandStr = "sdm.devices.commands." + flags.trait + "." + flags.command;
        // let execResponse = executeCommand(config, token, device, commandStr, params);
        let execResponse = executeCommand(config, token, device, commandStr, params);
        console.log(JSON.stringify(execResponse, null, 4));
      }
    }
  }
}
