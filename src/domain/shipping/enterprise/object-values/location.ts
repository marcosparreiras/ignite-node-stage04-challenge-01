export class Location {
  private _latitude: number;
  private _longitude: number;

  get latitude() {
    return this._latitude;
  }

  get longitude() {
    return this._longitude;
  }

  constructor(latitude: number, longitude: number) {
    this._latitude = latitude;
    this._longitude = longitude;
  }

  public getDistanceInKm(location: Location): number {
    const earthRadiusInKm = 6371;
    const distanceLatitude = this.deg2rad(location.latitude - this._latitude);
    const distanceLongitude = this.deg2rad(
      location.longitude - this._longitude
    );
    const a =
      Math.sin(distanceLatitude / 2) * Math.sin(distanceLatitude / 2) +
      Math.cos(this.deg2rad(this._latitude)) *
        Math.cos(this.deg2rad(location.latitude)) *
        Math.sin(distanceLongitude / 2) *
        Math.sin(distanceLongitude / 2);

    const b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusInKm * b;
    return distance;
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
}
