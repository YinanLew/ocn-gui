export class DataFetchFailedError extends Error {
  constructor(message = "Data fetch failed.") {
    super(message);
    this.name = "DataFetchFailedError";
  }
}

export class AuthRequiredError extends Error {
  constructor(message = "Your session has expired. Please log in again.") {
    super(message);
    this.name = "AuthRequiredError";
  }
}
