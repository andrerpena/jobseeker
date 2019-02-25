export interface TimeAgo {
  number: number;
  prefix: string;
  timeFrame: string;
}

export function getTimeAgoFromString(text: string): TimeAgo | null {
  const matches = text.match(/(?:([^\d]*)(\d+)(\w))\sago/);
  if (matches) {
    return {
      prefix: matches[1],
      number: parseInt(matches[2]),
      timeFrame: matches[3].toLowerCase()
    };
  }
  return null;
}

export function getTimeFromTimeAgo(timeAgo: TimeAgo, now: Date): Date {
  const copiedNow = new Date(now.getTime());
  if (timeAgo.prefix) {
    return copiedNow;
  } else {
    if (timeAgo.timeFrame === "h") {
      copiedNow.setHours(copiedNow.getHours() - timeAgo.number);
      return copiedNow;
    }
    if (timeAgo.timeFrame === "d") {
      copiedNow.setDate(copiedNow.getDate() - timeAgo.number);
      return copiedNow;
    }
    if (timeAgo.timeFrame === "w") {
      copiedNow.setDate(copiedNow.getDate() - timeAgo.number * 7);
      return copiedNow;
    }
  }
  return copiedNow;
}
