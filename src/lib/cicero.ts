export type Role = "visitatore" | "cicerone";

export const INTERESTS = [
  "arte",
  "storia",
  "archeologia",
  "architettura",
  "street food",
  "musica",
  "cinema",
  "fotografia",
  "sport",
  "natura",
  "mare",
  "moda",
  "caffè",
  "letteratura",
  "tecnologia",
  "artigianato",
] as const;

export const LANGUAGES = [
  "italiano",
  "inglese",
  "francese",
  "spagnolo",
  "tedesco",
  "arabo",
  "cinese",
] as const;

export const GENDERS = ["femmina", "maschio", "altro", "preferisco non dirlo"] as const;

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
] as const;

export type City = { name: string; lat: number; lon: number; region: string };

export const CITIES: City[] = [
  { name: "Venezia", lat: 45.44, lon: 12.34, region: "Veneto" },
  { name: "Roma", lat: 41.9, lon: 12.5, region: "Lazio" },
  { name: "Firenze", lat: 43.77, lon: 11.26, region: "Toscana" },
  { name: "Napoli", lat: 40.85, lon: 14.27, region: "Campania" },
  { name: "Torino", lat: 45.07, lon: 7.69, region: "Piemonte" },
  { name: "Palermo", lat: 38.12, lon: 13.36, region: "Sicilia" },
  { name: "Milano", lat: 45.46, lon: 9.19, region: "Lombardia" },
  { name: "Bologna", lat: 44.49, lon: 11.34, region: "Emilia-Romagna" },
  { name: "Genova", lat: 44.41, lon: 8.93, region: "Liguria" },
  { name: "Verona", lat: 45.44, lon: 10.99, region: "Veneto" },
  { name: "Trieste", lat: 45.65, lon: 13.77, region: "Friuli-Venezia Giulia" },
  { name: "Siena", lat: 43.32, lon: 11.33, region: "Toscana" },
  { name: "Pisa", lat: 43.72, lon: 10.4, region: "Toscana" },
  { name: "Perugia", lat: 43.11, lon: 12.39, region: "Umbria" },
  { name: "Ravenna", lat: 44.42, lon: 12.2, region: "Emilia-Romagna" },
  { name: "Ancona", lat: 43.62, lon: 13.51, region: "Marche" },
  { name: "L'Aquila", lat: 42.35, lon: 13.4, region: "Abruzzo" },
  { name: "Bari", lat: 41.12, lon: 16.87, region: "Puglia" },
  { name: "Lecce", lat: 40.35, lon: 18.17, region: "Puglia" },
  { name: "Matera", lat: 40.67, lon: 16.6, region: "Basilicata" },
  { name: "Reggio Calabria", lat: 38.11, lon: 15.65, region: "Calabria" },
  { name: "Catania", lat: 37.5, lon: 15.09, region: "Sicilia" },
  { name: "Siracusa", lat: 37.07, lon: 15.29, region: "Sicilia" },
  { name: "Cagliari", lat: 39.22, lon: 9.12, region: "Sardegna" },
  { name: "Alghero", lat: 40.56, lon: 8.32, region: "Sardegna" },
  { name: "Trento", lat: 46.07, lon: 11.12, region: "Trentino-Alto Adige" },
  { name: "Aosta", lat: 45.74, lon: 7.32, region: "Valle d'Aosta" },
  { name: "Campobasso", lat: 41.56, lon: 14.66, region: "Molise" },
];

export function findCity(name: string): City | undefined {
  return CITIES.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

export function searchCities(query: string): City[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CITIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q),
  ).slice(0, 8);
}

/** Proiezione lineare lat/lon sul viewBox 0 0 300 400 usato dalla mappa. */
export const MAP_VIEWBOX = { width: 300, height: 400 };
export function project(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon - 6.3) / (18.9 - 6.3)) * MAP_VIEWBOX.width;
  const y = ((47.3 - lat) / (47.3 - 36.5)) * MAP_VIEWBOX.height;
  return { x, y };
}

export type MatchableProfile = {
  age: number | null;
  gender: string | null;
  interests: string[];
  languages: string[];
  accessible_tours: boolean;
};

export type MatchPreferences = {
  age: number | null;
  gender: string | null;
  interests: string[];
  needsAccessible?: boolean;
  language?: string | null;
};

export type MatchResult = { score: number; sharedInterests: string[] };

/** Punteggio di compatibilità 0-100 tra visitatore e cicerone. */
export function matchScore(guide: MatchableProfile, prefs: MatchPreferences): MatchResult {
  const shared = guide.interests.filter((i) => prefs.interests.includes(i));
  const interestBase = prefs.interests.length || 1;
  const interestScore = Math.min(shared.length / Math.min(interestBase, 3), 1) * 55;

  let ageScore = 12;
  if (guide.age != null && prefs.age != null) {
    const diff = Math.abs(guide.age - prefs.age);
    ageScore = diff <= 1 ? 22 : diff <= 2 ? 17 : diff <= 4 ? 11 : 5;
  }

  const genderScore = prefs.gender && guide.gender === prefs.gender ? 10 : 4;

  const languageScore =
    prefs.language && guide.languages.includes(prefs.language) ? 8 : prefs.language ? 2 : 6;

  const accessibleScore = prefs.needsAccessible ? (guide.accessible_tours ? 5 : 0) : 5;

  const score = Math.round(
    interestScore + ageScore + genderScore + languageScore + accessibleScore,
  );
  return { score: Math.max(12, Math.min(99, score)), sharedInterests: shared };
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export const BOOKING_STATUS_LABEL: Record<string, string> = {
  in_attesa: "In attesa",
  accettata: "Accettata",
  rifiutata: "Rifiutata",
  completata: "Completata",
};

/** Ore riconosciute per ogni guida completata e tetto mensile. */
export const FSL_HOURS_PER_TOUR = 2;
export const FSL_MAX_TOURS_PER_MONTH = 5;

export function currentMonthLabel(date = new Date()): string {
  return date.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
}
