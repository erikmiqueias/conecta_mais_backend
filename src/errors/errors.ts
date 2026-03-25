export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Email already exists");
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
  }
}
