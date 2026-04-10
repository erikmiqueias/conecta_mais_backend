export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Email already exists");
    this.name = "EmailAlreadyExistsError";
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
    this.name = "UserNotFoundError";
  }
}

export class EventNotFoundError extends Error {
  constructor() {
    super("Event not found");
    this.name = "EventNotFoundError";
  }
}

export class AddressNotFoundError extends Error {
  constructor() {
    super("Address not found for the given coordinates");
    this.name = "AddressNotFoundError";
  }
}

export class CoordinatesNotFoundError extends Error {
  constructor() {
    super("Coordinates not found for the given address");
    this.name = "CoordinatesNotFoundError";
  }
}

export class OSMProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OSMProviderError";
  }
}

export class EventNotAuthorizedError extends Error {
  constructor() {
    super("User not authorized to perform this action on the event");
    this.name = "EventNotAuthorizedError";
  }
}

export class UserAlreadySubscribedError extends Error {
  constructor() {
    super("User already subscribed to the event");
    this.name = "UserAlreadySubscribedError";
  }
}

export class UserNotSubscribedError extends Error {
  constructor() {
    super("User not subscribed to the event");
    this.name = "UserNotSubscribedError";
  }
}

export class UserAlreadyReviewedError extends Error {
  constructor() {
    super("User already reviewed the event");
    this.name = "UserAlreadyReviewedError";
  }
}

export class EvaluationNotDisposibleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvaluationNotDisposibleError";
  }
}

export class OrganizerCannotReviewOwnEventError extends Error {
  constructor() {
    super("Organizer cannot review own event");
    this.name = "OrganizerCannotReviewOwnEventError";
  }
}

export class EventAlreadyCanceledError extends Error {
  constructor() {
    super("Event already canceled");
    this.name = "EventAlreadyCanceledError";
  }
}

export class EventAlreadyReopenedError extends Error {
  constructor() {
    super("Event already reopened");
    this.name = "EventAlreadyReopenedError";
  }
}

export class CannotCancelPastEventError extends Error {
  constructor() {
    super("Cannot cancel past event");
    this.name = "CannotCancelPastEventError";
  }
}

export class CannotReopenPastEventError extends Error {
  constructor() {
    super("Cannot reopen past event");
    this.name = "CannotReopenPastEventError";
  }
}

export class EventNotCanceledError extends Error {
  constructor() {
    super("Event not canceled");
    this.name = "EventNotCanceledError";
  }
}

export class CannotEvaluateCanceledEventError extends Error {
  constructor() {
    super("Cannot evaluate canceled event");
    this.name = "CannotEvaluateCanceledEventError";
  }
}

export class EventNotNeededAccessCodeError extends Error {
  constructor() {
    super("Event not needed access code");
    this.name = "EventNotNeededAccessCodeError";
  }
}

export class AccessCodeIsRequiredError extends Error {
  constructor() {
    super("Access code is required to private event");
    this.name = "AccessCodeIsRequiredError";
  }
}

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoginError";
  }
}

export class RefreshTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RefreshTokenError";
  }
}
