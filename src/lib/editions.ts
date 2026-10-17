import type { ImageMetadata } from 'astro';
import data from '../data/editions.json';

export interface Team {
  id: string;
  name: string;
  colors: [string, string];
  photos?: string[];
  players: string[];
}

export interface Edition {
  edition: number;
  year: number;
  date: string | null;
  kickoff?: string | null;
  location?: string | null;
  winner: string | null;
  teams: Team[];
}

export const editions = (data.editions as unknown as Edition[])
  .slice()
  .sort((a, b) => b.edition - a.edition);

export const upcoming = editions.find((e) => e.winner === null);
export const completed = editions.filter((e) => e.winner !== null);

export const winnerOf = (e: Edition) => e.teams.find((t) => t.id === e.winner);
export const loserOf = (e: Edition) => e.teams.find((t) => t.id !== e.winner);

const ordinalSuffix = new Intl.PluralRules('en-GB', { type: 'ordinal' });
const suffixes: Record<string, string> = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
export const ordinal = (n: number) => `${n}${suffixes[ordinalSuffix.select(n)]}`;

// Editions are played in November: Italian winter time (UTC+1).
export const kickoffISO = (e: Edition) => `${e.date}T${e.kickoff ?? '00:00'}:00+01:00`;

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Rome',
  }).format(new Date(`${date}T12:00:00+01:00`));

const photoModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/jerseys/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

export function photo(file: string): ImageMetadata | undefined {
  const entry = Object.entries(photoModules).find(([path]) => path.endsWith(`/${file}`));
  if (!entry) console.warn(`[patonz-cup] Photo not found in src/assets/jerseys: ${file}`);
  return entry?.[1].default;
}

export function champions() {
  const wins = new Map<string, number[]>();
  for (const e of completed) {
    for (const player of winnerOf(e)?.players ?? []) {
      wins.set(player, [...(wins.get(player) ?? []), e.year]);
    }
  }
  return [...wins]
    .map(([name, years]) => ({ name, years: years.sort() }))
    .sort((a, b) => b.years.length - a.years.length || a.name.localeCompare(b.name, 'en'));
}
