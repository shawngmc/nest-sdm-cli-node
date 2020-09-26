const {Command, flags} = require('@oclif/command')
const configUtils = require('../utils/config');

class ConfigureCommand extends Command {
  async run() {
    const {flags} = this.parse(ConfigureCommand)

    await configUtils.buildConfigInteractive();
  }
}

ConfigureCommand.description = `Configure settings for Nest Device Access`

ConfigureCommand.flags = {
  help: flags.help({ char: 'h' })
}

module.exports = ConfigureCommand
