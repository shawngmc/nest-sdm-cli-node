const fs = require('fs');
const inquirer = require('inquirer');

const readConfig = () => {
  return JSON.parse(fs.readFileSync('config.json'));
}

const writeConfig = (config) => {
  fs.writeFileSync('config.json', JSON.stringify(config, null, 4));
}

const isConfigValid = (config) => {
  // TODO: Implement checks
 return true;
}

const buildConfigInteractive = () => {
  inquirer
    .prompt([
      {
        "type": 'input',
        "name": 'client_id',
        "message": "What is your client ID?",
        "validate": function (input) {
          return input.length > 0;
        }
      },
      {
        "type": 'input',
        "name": 'client_secret',
        "message": "What is your client secret?",
        "validate": function (input) {
          return input.length > 0;
        }
      },
      {
        "type": 'input',
        "name": 'sdm_client_id',
        "message": "What is your SDM client ID?",
        "validate": function (input) {
          return input.length > 0;
        }
      },
      {
        "type": 'input',
        "name": 'refresh_token',
        "message": "What is your refresh token?",
        "validate": function (input) {
          return input.length > 0;
        }
      }
    ])
    .then(answers => {
      writeConfig(answers);
    })
    .catch(error => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.log(error);
      } else {
        // Something else when wrong
        console.log(error);
      }
      return null;
    });
}

const getConfig = () => {
  let config = null;

  try {
    config = readConfig();
  } catch (error) {
    console.log("Could not find or read config due to : " + error);
  }

  return config;
}

module.exports = { getConfig, isConfigValid, buildConfigInteractive }
