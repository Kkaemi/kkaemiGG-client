import { DateTime } from "luxon";

export const calcPast = (UTC) => {
  const mapObj = {
    years: "년 전",
    months: "개월 전",
    weeks: "주 전",
    days: "일 전",
    hours: "시간 전",
    minutes: "분 전",
    seconds: "초 전",
  };

  const start = DateTime.fromISO(UTC);
  const end = DateTime.now();
  const diffObj = end
    .diff(start, [
      "years",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds",
    ])
    .toObject();

  const keys = Object.keys(diffObj);

  for (const key of keys) {
    if (diffObj[key] !== 0) {
      return `${diffObj[key]}${mapObj[key]}`;
    }
  }

  return "1초 전";
};

export const toLocalDateTime = (UTC) => {
  return DateTime.fromISO(UTC).toLocaleString(DateTime.DATETIME_MED);
};
