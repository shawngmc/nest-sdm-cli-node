const {Command, flags} = require('@oclif/command')
const fetch = require('node-fetch');
const deviceUtils = require('../utils/device');
const fs = require('fs');

class ListCommand extends Command {
  async run() {
    const {flags} = this.parse(ListCommand)

    let response = await deviceUtils.getSDMDeviceList();
    console.log(JSON.stringify(response, null, 4));
  }
}

ListCommand.description = `Get the list of devices from Nest Device Access`

ListCommand.flags = {
  help: flags.help({ char: 'h' })
}

module.exports = ListCommand
