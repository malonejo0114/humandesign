import { DateTime } from 'luxon';

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

export function toUtcWithAudit(input: {
  localDate: string;
  localTime: string;
  timezone?: string;
}): UtcAuditLog {
  const timezone = input.timezone ?? 'Asia/Seoul';
  const local = DateTime.fromISO(`${input.localDate}T${input.localTime}`, {
    zone: timezone
  });

  if (!local.isValid) {
    throw new Error(`Invalid local datetime: ${local.invalidExplanation ?? 'unknown error'}`);
  }

  const utc = local.toUTC();

  return {
    input: {
      localDate: input.localDate,
      localTime: input.localTime,
      timezone
    },
    parsedLocalIso: local.toISO({ suppressMilliseconds: true }) ?? '',
    utcIso: utc.toISO({ suppressMilliseconds: true }) ?? '',
    offsetMinutes: local.offset
  };
}
