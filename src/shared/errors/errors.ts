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

export class EventNotAuthorizedError extends Error {
  constructor() {
    super("User not authorized to perform this action on the event");
  }
}

export class UserAlreadySubscribedError extends Error {
  constructor() {
    super("User already subscribed to the event");
  }
}

export class UserNotSubscribedError extends Error {
  constructor() {
    super("User not subscribed to the event");
  }
}

export class UserAlreadyReviewedError extends Error {
  constructor() {
    super("User already reviewed the event");
  }
}

export class EvaluationNotDisposibleError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class OrganizerCannotReviewOwnEventError extends Error {
  constructor() {
    super("Organizer cannot review own event");
  }
}
