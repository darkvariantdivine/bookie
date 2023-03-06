
import {
  test,
  expect,
  describe
} from "@jest/globals";
import {roundInterval} from "@/libs/utils";

describe("Tests for rounding to an interval", () => {
  beforeAll(async () => {
    const constants = await import("@/constants");
    constants.SLOT_INTERVAL = 0.25;
  })

  test("Round value down", async () => {
    expect(roundInterval(5)).toEqual({minutes: 0.0, hours: 0.0});
    expect(roundInterval(17)).toEqual({minutes: 15.0, hours: 0.0});
    expect(roundInterval(37)).toEqual({minutes: 30.0, hours: 0.0});
  });

  test("Value no change", () => {
    expect(roundInterval(15)).toEqual({minutes: 15.0, hours: 0.0})
    expect(roundInterval(30)).toEqual({minutes: 30.0, hours: 0.0});
  });

  test("Round value up", () => {
    expect(roundInterval(27)).toEqual({minutes: 30.0, hours: 0.0});
    expect(roundInterval(13)).toEqual({minutes: 15.0, hours: 0.0});
  });

  test("Round up to next hour", () => {
    expect(roundInterval(95)).toEqual({minutes: 30.0, hours: 1.0});
    expect(roundInterval(135)).toEqual({minutes: 15.0, hours: 2.0});
  });

  afterAll(async () => {
    const constants = await import("@/constants");
    constants.SLOT_INTERVAL = 0.5;
  })
});