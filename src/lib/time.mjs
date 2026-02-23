const SEOUL_OFFSET_MINUTES = 9 * 60;

export function toUtcWithAudit({ localDate, localTime, timezone = 'Asia/Seoul' }) {
  if (timezone !== 'Asia/Seoul') {
    throw new Error('MVP currently supports Asia/Seoul only.');
  }

  const match = `${localDate}T${localTime}`.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
  );
  if (!match) {
    throw new Error('Invalid local datetime format.');
  }

  const [, y, m, d, hh, mm, ss = '00'] = match;
  const utcMs = Date.UTC(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss)) - SEOUL_OFFSET_MINUTES * 60 * 1000;
  const utc = new Date(utcMs);

  if (Number.isNaN(utcMs)) {
    throw new Error('Invalid local datetime value.');
  }

  const parsedLocalIso = `${y}-${m}-${d}T${hh}:${mm}:${ss}+09:00`;
  const utcIso = utc.toISOString().replace('.000', '');

  return {
    input: { localDate, localTime, timezone },
    parsedLocalIso,
    utcIso,
    offsetMinutes: SEOUL_OFFSET_MINUTES
  };
}
