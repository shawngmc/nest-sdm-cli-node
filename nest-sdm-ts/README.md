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
nest-sdm/0.1.4 win32-x64 node-v12.0.0
$ nest-sdm --help [COMMAND]
USAGE
  $ nest-sdm COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nest-sdm hello [FILE]`](#nest-sdm-hello-file)
* [`nest-sdm help [COMMAND]`](#nest-sdm-help-command)

## `nest-sdm hello [FILE]`

describe the command here

```
USAGE
  $ nest-sdm hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ nest-sdm hello
  hello world from ./src/hello.ts!
```

_See code: [src\commands\hello.ts](https://github.com/shawngmc/nest-sdm-cli-node/blob/v0.1.4/src\commands\hello.ts)_

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
<!-- commandsstop -->
