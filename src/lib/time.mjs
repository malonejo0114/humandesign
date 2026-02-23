const SEOUL_OFFSET_MINUTES = 9 * 60;

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year, month) {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

function parseLocalDateTime(localDate, localTime) {
  const match = `${localDate}T${localTime}`.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
  );

  if (!match) {
    throw new Error('Invalid local datetime format. Use YYYY-MM-DD and HH:mm[:ss].');
  }

  const [, y, m, d, hh, mm, ss = '00'] = match;
  const year = Number(y);
  const month = Number(m);
  const day = Number(d);
  const hour = Number(hh);
  const minute = Number(mm);
  const second = Number(ss);

  if (month < 1 || month > 12) throw new Error('Invalid local datetime value: month out of range.');
  if (day < 1 || day > daysInMonth(year, month)) throw new Error('Invalid local datetime value: day out of range.');
  if (hour > 23 || minute > 59 || second > 59) {
    throw new Error('Invalid local datetime value: time out of range.');
  }

  return { year, month, day, hour, minute, second, y, m, d, hh, mm, ss };
}

export function toUtcWithAudit({ localDate, localTime, timezone = 'Asia/Seoul' }) {
  if (timezone !== 'Asia/Seoul') {
    throw new Error('MVP currently supports Asia/Seoul only.');
  }

  const parsed = parseLocalDateTime(localDate, localTime);

  const utcMs =
    Date.UTC(parsed.year, parsed.month - 1, parsed.day, parsed.hour, parsed.minute, parsed.second) -
    SEOUL_OFFSET_MINUTES * 60 * 1000;
  const utc = new Date(utcMs);

  const parsedLocalIso = `${parsed.y}-${parsed.m}-${parsed.d}T${parsed.hh}:${parsed.mm}:${parsed.ss}+09:00`;
  const utcIso = utc.toISOString().replace('.000', '');

  return {
    input: { localDate, localTime, timezone },
    parsedLocalIso,
    utcIso,
    offsetMinutes: SEOUL_OFFSET_MINUTES
  };
}
