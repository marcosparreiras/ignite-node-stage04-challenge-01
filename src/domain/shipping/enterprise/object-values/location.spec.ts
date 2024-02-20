import { Location } from "./location";

describe("Location [Value-Object]", () => {
  it("Should get distance in km from two locations", async () => {
    const location01 = new Location(-19.945480363739996, -43.92957666603725);
    const location02 = new Location(-19.951523329789485, -43.92783787367566);

    const distance = location01.getDistanceInKm(location02);
    expect(distance).toBeCloseTo(0.696, 3);
  });
});
