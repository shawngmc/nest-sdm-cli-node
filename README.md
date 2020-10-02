# nest-sdm-cli-node

A quick command line tool to use the new Nest Device Access API.

## Getting Started
1) Install nest-sdm with 'npm install -g nest-sdm'
2) Follow the [Quick Start Guide](https://developers.google.com/nest/device-access/get-started) until [part 2 - Get an Access Token](https://developers.google.com/nest/device-access/authorize#get_an_access_token) is complete.
3) Run 'nest-sdm -a configure' and fill in the values generated so far; note that this needs the refresh_token, not the access_token!
4) Test your access by running 'nest-sdm' with no options (equivalent to 'nest-sdm -a list') to get a list of linked devices 
