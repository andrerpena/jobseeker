import * as cityTimeZones from "city-timezones";
import * as moment from "moment-timezone";

function getUtcOffsetForLocation(location: string): number | null {
  const timezones = cityTimeZones.findFromCityStateProvince(location);
  if (timezones && timezones.length) {
    const timezone = timezones[0];
    let offset = moment.tz(timezone.timezone).utcOffset();
    if (moment.tz(timezone.timezone).isDST()) {
      offset -= 60;
    }
    return offset / 60;
  }
  return null;
}

console.log(getUtcOffsetForLocation("Blablabla"));
