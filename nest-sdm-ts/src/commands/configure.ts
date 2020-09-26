import { Command, flags } from '@oclif/command'
import utils from '../utils'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import { Config } from '../types'

export default class Configure extends Command {
  static description = 'Configure for communication with Nest Device Access'

  static examples = [
    `$ nest-sdm configure`,
  ]

  static flags = {
    help: flags.help({ char: 'h' })
  }

  static args = []

  async run() {
    const { args, flags } = this.parse(Configure)
    let config = utils.readConfig()
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
        fs.writeFileSync('config.json', JSON.stringify(answers, null, 4));
        console.log("Configuration written!");
      })
      .catch(error => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else when wrong
          console.log(error);
        }
      });

  }
}
