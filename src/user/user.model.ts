export type SessionType = {
  session_id: string;
  access_token: string;
  refresh_token: string;
};

export type UserSessionType = { [key: string]: SessionType };

export type ContactType = {
  phoneNumber: string | null;
  whatsappNumber: string | null;
  telegramUsername: string | null;
};

export type AddressType = {
  city: string | null;
  street: string | null;
  house: string | null;
};

export type UserTypeArgs = {
  id: string;
  email: string;
  password: string;
  name: string;
  sessions: UserSessionType;
  contact?: ContactType;
  address?: AddressType;
};

export class User {
  public id: string;
  public email: string;
  public password: string;
  public name: string;
  public sessions: UserSessionType;
  public contact: ContactType;
  public address: AddressType;

  constructor({
    id,
    email,
    password,
    name,
    sessions,
    contact,
    address,
  }: UserTypeArgs) {
    this.id = id || null;
    this.email = email;
    this.password = password;
    this.name = name;
    this.sessions = sessions || {};
    this.contact = contact || {
      phoneNumber: null,
      whatsappNumber: null,
      telegramUsername: null,
    };
    this.address = address || {
      city: null,
      street: null,
      house: null,
    };
  }

  toDTO() {
    return <User>{
      id: this.id,
      email: this.email,
      name: this.name,
      sessions: this.sessions,
    };
  }
}
