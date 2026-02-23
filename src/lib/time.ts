export type UtcAuditLog = {
  input: {
    localDate: string;
    localTime: string;
    timezone: string;
  };
  parsedLocalIso: string;
  utcIso: string;
  offsetMinutes: number;
};

const SEOUL_OFFSET_MINUTES = 9 * 60;

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

export function toUtcWithAudit(input: {
  localDate: string;
  localTime: string;
  timezone?: string;
}): UtcAuditLog {
  const timezone = input.timezone ?? 'Asia/Seoul';
  if (timezone !== 'Asia/Seoul') {
    throw new Error('MVP currently supports Asia/Seoul only.');
  }

  const match = `${input.localDate}T${input.localTime}`.match(
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

  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second) - SEOUL_OFFSET_MINUTES * 60 * 1000;
  const utcIso = new Date(utcMs).toISOString().replace('.000', '');

  return {
    input: {
      localDate: input.localDate,
      localTime: input.localTime,
      timezone
    },
    parsedLocalIso: `${y}-${m}-${d}T${hh}:${mm}:${ss}+09:00`,
    utcIso,
    offsetMinutes: SEOUL_OFFSET_MINUTES
  };
}
