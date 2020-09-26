#!/usr/bin/env node
const fetch = require("node-fetch");
const fs = require('fs');
const cli = require('cli');
const inquirer = require('inquirer');

cli.enable("status", "version");
let options = cli.parse({
	action: [ 'a', 'An action to perform - configure, list, get, or command', 'string', 'list' ],
	device: [ 'd', 'A device display name or id to act upon', 'string', undefined],
	trait: [ 't', 'A device trait to act upon', 'string', undefined],
    command: [ 'c', 'What action to perform on that device for the selected trait', 'string', undefined ],
    params: ['p', 'A json string to pass to the command as params', "{}"]
});

let config = JSON.parse(fs.readFileSync('config.json'));

let sessionData = {};
try {
    sessionData = JSON.parse(fs.readFileSync('token.json'));
} catch (error) {
    if (error.code !== 'ENOENT') {
        console.log(error);
    }
}

let devices = [];
try {
    devices = JSON.parse(fs.readFileSync('devices.json'));
} catch (error) {
    if (error.code !== 'ENOENT') {
        console.log(error);
    }
}



// const getAccessToken = async () => {
//     try {
//       const params = new URLSearchParams();
//       params.append('client_id', config.client_id);
//       params.append('client_secret', config.client_secret);
//       params.append('code', auth_code);
//       params.append('grant_type', "authorization_code");
//       params.append('redirect_uri', "https://www.google.com");

//       const url = "https://www.googleapis.com/oauth2/v4/token?" + params.toString();
//       const config = {
//         method: "POST"
//       };
//       const response = await fetch(url, config);
//       console.log(response);
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.log(error);
//     }
//   };

const refreshAccessToken = async () => {
    try {
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
        sessionData.access_token = json.access_token;
        sessionData.token_expiry = new Date(Date.now() + (json.expires_in - 60) * 1000);
        access_token = json.access_token;
        fs.writeFileSync('token.json', JSON.stringify(sessionData));
    } catch (error) {
        console.log(error);
    }
};

const isTokenValid = () => {
    if (sessionData == null) {
        return false;
    }

    if (sessionData.access_token == null) {
        return false;
    }

    if (sessionData.token_expiry == null) {
        return false;
    }

    if (new Date() >= new Date(sessionData.token_expiry)) {
        return false;
    }

    return true;
};

const listDevices = async () => {
    try {
        const url = "https://smartdevicemanagement.googleapis.com/v1/enterprises/" + config.sdm_client_id + "/devices";
        const opts = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionData.access_token
            }
        };
        const response = await fetch(url, opts);
        const json = await response.json();

        return json;
    } catch (error) {
        console.log(error);
    }
};

const getDeviceInfoByDeviceId = async (deviceId) => {
    try {
        const url = "https://smartdevicemanagement.googleapis.com/v1/enterprises/" + config.sdm_client_id + "/devices/" + deviceId;
        const opts = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionData.access_token
            }
        };
        const response = await fetch(url, opts);
        const json = await response.json();

        return json;
    } catch (error) {
        console.log(error);
    }
};

const storeDeviceList = (deviceResponse) => {
    let deviceList = [];
    deviceResponse.devices.forEach((device) => {
        let cleanDevice = {};
        cleanDevice.name = device.name;
        cleanDevice.type = device.type;
        cleanDevice.id = device.name.substring(device.name.lastIndexOf("/") + 1);
        cleanDevice.displayname = device.parentRelations[0].displayName;
        cleanDevice.traits = Object.getOwnPropertyNames(device.traits);
        deviceList.push(cleanDevice);
    })
    fs.writeFileSync('devices.json', JSON.stringify(deviceList, "", 4));
};

const executeCommand = async (command, params, deviceId) => {
    try {
        const body = {};
        body.command = command;
        body.params = params;

        const url = "https://smartdevicemanagement.googleapis.com/v1/enterprises/" + config.sdm_client_id + "/devices/" + deviceId + ":executeCommand";
        console.log(url);
        console.log(body);
        const opts = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionData.access_token
            },
            body: JSON.stringify(body)
        };
        console.log(opts);
        const response = await fetch(url, opts);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};

const checkDeviceRef = (deviceRef) => {
    if (deviceRef === undefined) {
        cli.fatal("Device required.");
    }

    // See if we have a valid device ID
    let idMatch = devices.find(d => d.id == deviceRef);
    if (idMatch) {
        return deviceRef;
    } else {
        // See if we have a valid device name
        let nameMatch = devices.find(d => d.displayname == deviceRef);
        if (nameMatch) {
            return nameMatch.id;
        } else {
            cli.fatal("Device " + deviceRef + " not found.");
        }
    }
};

const checkDeviceTrait = (deviceId, trait) => {
    let traitSearchString = "sdm.devices.traits." + trait;
    let device = devices.find(d => d.id === deviceId);
    let traitMatch = device.traits.find(t => t == traitSearchString);

    if (!traitMatch) {
        cli.fatal("Trait " + traitSearchString + " not valid for device " + device.displayname);
    }
};

const main = async () => {
    if (!isTokenValid()) {
        cli.debug('Fetching new token...');
        await refreshAccessToken();
    } else {
        cli.debug('Using cached access token...');
    }

    if (options.action == "configure") {
        inquirer
            .prompt([
                {
                    "type": 'input',
                    "name": 'client_id',
                    "message": "What is your client ID?",
                    "validate": function(input) {
                        return input.length > 0;
                    }
                },
                {
                    "type": 'input',
                    "name": 'client_secret',
                    "message": "What is your client secret?",
                    "validate": function(input) {
                        return input.length > 0;
                    }
                },
                {
                    "type": 'input',
                    "name": 'sdm_client_id',
                    "message": "What is your SDM client ID?",
                    "validate": function(input) {
                        return input.length > 0;
                    }
                },
                {
                    "type": 'input',
                    "name": 'refresh_token',
                    "message": "What is your refresh token?",
                    "validate": function(input) {
                        return input.length > 0;
                    }
                }
            ])
            .then(answers => {
                fs.writeFileSync('config.json', JSON.stringify(answers, "", 4));
                console.log("Configuration written!");
            })
            .catch(error => {
                if(error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
                } else {
                // Something else when wrong
                console.log(error);
                }
            });
    } else {
        if (devices.length == 0) {
            let deviceResponse = await listDevices();
            storeDeviceList(deviceResponse);
        }
        
        if (options.action == "list") {
            let deviceResponse = await listDevices();
            storeDeviceList(deviceResponse);
            console.log(JSON.stringify(devices, "", 4));
        } else if (options.action == "get") {
            // Make sure device is valid
            let deviceId = checkDeviceRef(options.device);

            result = await getDeviceInfoByDeviceId(deviceId);
            console.log(result);
        } else if (options.action == "command") {
            // Make sure device is valid
            let deviceId = checkDeviceRef(options.device);

            // Make sure device has those traits
            checkDeviceTrait(deviceId, options.trait);

            // Parse Params
            let params = {};
            try {
                console.log(options.params);
                params = JSON.parse(options.params);
            } catch (error) {
                cli.fatal("Could not parse given params.");
            }

            result = await executeCommand("sdm.devices.commands." + options.trait + "." + options.command, params, deviceId);
            console.log(result);
        }
    }
}

main();