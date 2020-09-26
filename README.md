nest-sdm
========

A quick command line tool to use the new Nest Device Access API.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/nest-sdm.svg)](https://npmjs.org/package/nest-sdm)
[![Downloads/week](https://img.shields.io/npm/dw/nest-sdm.svg)](https://npmjs.org/package/nest-sdm)
[![License](https://img.shields.io/npm/l/nest-sdm.svg)](https://github.com/shawngmc/nest-sdm-cli-node/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g nest-sdm
$ nest-sdm COMMAND
running command...
$ nest-sdm (-v|--version|version)
nest-sdm/0.1.5 win32-x64 node-v12.0.0
$ nest-sdm --help [COMMAND]
USAGE
  $ nest-sdm COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nest-sdm configure`](#nest-sdm-configure)
* [`nest-sdm executeCommand`](#nest-sdm-executecommand)
* [`nest-sdm get`](#nest-sdm-get)
* [`nest-sdm help [COMMAND]`](#nest-sdm-help-command)
* [`nest-sdm list`](#nest-sdm-list)

## `nest-sdm configure`

Configure settings for Nest Device Access

```
USAGE
  $ nest-sdm configure

OPTIONS
  -h, --help  show CLI help
```

_See code: [src\commands\configure.js](https://github.com/shawngmc/nest-sdm-cli-node/blob/v0.1.5/src\commands\configure.js)_

## `nest-sdm executeCommand`

Get the list of devices from Nest Device Access

```
USAGE
  $ nest-sdm executeCommand

OPTIONS
  -c, --command=command
  -d, --device=device
  -h, --help             show CLI help
  -p, --params=params
  -t, --trait=trait
```

_See code: [src\commands\executeCommand.js](https://github.com/shawngmc/nest-sdm-cli-node/blob/v0.1.5/src\commands\executeCommand.js)_

## `nest-sdm get`

Get the status of a specific device from Nest Device Access

```
USAGE
  $ nest-sdm get

OPTIONS
  -d, --device=device
  -h, --help           show CLI help
```

_See code: [src\commands\get.js](https://github.com/shawngmc/nest-sdm-cli-node/blob/v0.1.5/src\commands\get.js)_

## `nest-sdm help [COMMAND]`

display help for nest-sdm

```
USAGE
  $ nest-sdm help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src\commands\help.ts)_

## `nest-sdm list`

Get the list of devices from Nest Device Access

```
USAGE
  $ nest-sdm list

OPTIONS
  -h, --help  show CLI help
```

_See code: [src\commands\list.js](https://github.com/shawngmc/nest-sdm-cli-node/blob/v0.1.5/src\commands\list.js)_
<!-- commandsstop -->
