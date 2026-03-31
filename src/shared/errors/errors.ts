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

export class EventNotFoundError extends Error {
  constructor() {
    super("Event not found");
  }
}

export class AddressNotFoundError extends Error {
  constructor() {
    super("Address not found for the given coordinates");
  }
}

export class CoordinatesNotFoundError extends Error {
  constructor() {
    super("Coordinates not found for the given address");
  }
}

export class OSMProviderError extends Error {
  constructor(message: string) {
    super(message);
  }
}
