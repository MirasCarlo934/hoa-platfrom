export type UserType = {
  username: string;
  password: string;
  role: string;
  firstname: string;
  lastname: string;
};

export type UserWithoutPasswordType = {
  username: string;
  role: string;
  firstname: string;
  lastname: string;
};

export default class User implements UserType {
  readonly username: string;
  readonly password: string;
  readonly role: string;
  readonly firstname: string;
  readonly lastname: string;

  constructor(obj: UserType) {
    this.username = obj.username;
    this.password = obj.password;
    this.role = obj.role;
    this.firstname = obj.firstname;
    this.lastname = obj.lastname;
  }

  getUsername(): string {
    return this.username;
  }

  getRole(): string {
    return this.role;
  }

  getFullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  validatePassword(password: string): boolean {
    return this.password === password;
  }

  toJSON(): UserWithoutPasswordType {
    return {
      username: this.username,
      role: this.role,
      firstname: this.firstname,
      lastname: this.lastname
    };
  }
}
