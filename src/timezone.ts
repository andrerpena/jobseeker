import * as cityTimeZones from "city-timezones";
import * as moment from "moment-timezone";

/**
 * Returns the UTC offset for the given timezone
 * @param timezone Example: America/New_York
 */
export function getNormalizedUtcOffset(timezone: string): number | null {
  const momentTimezone = moment.tz(timezone);
  if (!momentTimezone) {
    return null;
  }
  let offset = momentTimezone.utcOffset();
  if (momentTimezone.isDST()) {
    // utcOffset will return the offset normalized by DST. If the location
    // is in daylight saving time now, it will be adjusted for that. This is
    // a NAIVE attempt to normalize that by going back 1 hour
    offset -= 60;
  }
  return offset / 60;
}

/**
 * Returns the offset range for the given city or region
 * @param location
 */
export function getUtcOffsetForLocation(location: string): number[] | null {
  const timezones = cityTimeZones.findFromCityStateProvince(location);
  if (timezones && timezones.length) {
    // timezones will contain an array of all timezones for all cities inside
    // the given location. For example, if location is a country, this will contain
    // all timezones of all cities inside the country.
    // YOU SHOULD CACHE THE RESULT OF THIS FUNCTION.
    const offsetSet = new Set<number>();
    for (let timezone of timezones) {
      const offset = getNormalizedUtcOffset(timezone.timezone);
      if (offset !== null) {
        offsetSet.add(offset);
      }
    }

    return [...offsetSet].sort((a, b) => a - b);
  }
  return null;
}
