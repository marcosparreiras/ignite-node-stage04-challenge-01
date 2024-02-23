export class InvalidGeoCoordinatesError extends Error {
  constructor() {
    super("Invalid geo coordinates");
  }
}
