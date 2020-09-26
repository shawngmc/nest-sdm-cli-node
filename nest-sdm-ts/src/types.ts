export class Device {
  public name: string;
  public id: string;
  public displayname: string;
  public type: string;
  public traits: string[];

  constructor( name: string, id: string, displayname: string, type: string, traits: string[]) {
    this.name = name;
    this.id = id;
    this.displayname = displayname;
    this.type = type;
    this.traits = traits;
  }
}

export class Token {
  public access_token: string;
  public token_expiry: Date;

  constructor(access_token: string, token_expiry: Date) {
    this.access_token = access_token;
    this.token_expiry = token_expiry;
  }

  public isValid() {
    if (new Date(Date.now()) >= new Date(this.token_expiry)) {
      return false;
    }
    return true;
  }
}

export class Config {
  public client_id: string;
  public client_secret: string;
  public refresh_token: string;
  public sdm_client_id: string;

  constructor(client_id: string, client_secret: string, refresh_token: string, sdm_client_id: string) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.refresh_token = refresh_token;
    this.sdm_client_id = sdm_client_id;
  }
}
