import type { APIRoute } from 'astro';
import { kickoffISO, ordinal, upcoming } from '../lib/editions';

const MATCH_HOURS = 2;

const toICSDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

export const GET: APIRoute = ({ site }) => {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Patonz Cup//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];

  if (upcoming?.date) {
    const start = new Date(kickoffISO(upcoming));
    const timing = upcoming.kickoff
      ? [`DTSTART:${toICSDate(start)}`, `DTEND:${toICSDate(new Date(start.getTime() + MATCH_HOURS * 3_600_000))}`]
      : (() => {
          const end = new Date(`${upcoming.date}T00:00:00Z`);
          end.setUTCDate(end.getUTCDate() + 1);
          const day = (d: string) => d.slice(0, 10).replaceAll('-', '');
          return [`DTSTART;VALUE=DATE:${day(upcoming.date)}`, `DTEND;VALUE=DATE:${day(end.toISOString())}`];
        })();

    lines.push(
      'BEGIN:VEVENT',
      `UID:patonz-cup-${upcoming.year}@patonz.com`,
      `DTSTAMP:${toICSDate(new Date())}`,
      ...timing,
      `SUMMARY:⚽ Patonz Cup ${upcoming.year} (${ordinal(upcoming.edition)} edition)`,
      ...(upcoming.location ? [`LOCATION:${upcoming.location.replace(/([,;\\])/g, '\\$1')}`] : []),
      ...(site ? [`URL:${new URL(import.meta.env.BASE_URL, site).href}`] : []),
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return new Response(lines.join('\r\n'), { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
