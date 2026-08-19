// Forgiving book-name resolution: handles casing, punctuation, ordinals and
// the abbreviations media operators actually type ("jn", "rom", "ps", "1 cor").

const ALIASES: Record<string, string> = {
  gen: "Genesis", ge: "Genesis", gn: "Genesis",
  ex: "Exodus", exo: "Exodus", exod: "Exodus",
  lev: "Leviticus", lv: "Leviticus",
  num: "Numbers", nm: "Numbers", nu: "Numbers",
  deut: "Deuteronomy", dt: "Deuteronomy", deu: "Deuteronomy",
  josh: "Joshua", jos: "Joshua",
  judg: "Judges", jdg: "Judges", jg: "Judges",
  rut: "Ruth", rth: "Ruth",
  "1sam": "1 Samuel", "1sa": "1 Samuel", "1sm": "1 Samuel",
  "2sam": "2 Samuel", "2sa": "2 Samuel", "2sm": "2 Samuel",
  "1kgs": "1 Kings", "1ki": "1 Kings", "1kg": "1 Kings",
  "2kgs": "2 Kings", "2ki": "2 Kings", "2kg": "2 Kings",
  "1chr": "1 Chronicles", "1ch": "1 Chronicles",
  "2chr": "2 Chronicles", "2ch": "2 Chronicles",
  ezr: "Ezra", neh: "Nehemiah", est: "Esther", esth: "Esther",
  jb: "Job",
  ps: "Psalms", psa: "Psalms", psalm: "Psalms", pss: "Psalms", psl: "Psalms",
  prov: "Proverbs", prv: "Proverbs", pr: "Proverbs",
  eccl: "Ecclesiastes", ecc: "Ecclesiastes", ec: "Ecclesiastes",
  song: "Song of Solomon", sos: "Song of Solomon", ss: "Song of Solomon",
  songofsongs: "Song of Solomon", cant: "Song of Solomon",
  isa: "Isaiah", is: "Isaiah",
  jer: "Jeremiah", jr: "Jeremiah",
  lam: "Lamentations",
  ezek: "Ezekiel", eze: "Ezekiel", ezk: "Ezekiel",
  dan: "Daniel", dn: "Daniel",
  hos: "Hosea", joe: "Joel", am: "Amos", ob: "Obadiah", oba: "Obadiah",
  jon: "Jonah", jnh: "Jonah", mic: "Micah", nah: "Nahum", na: "Nahum",
  hab: "Habakkuk", zeph: "Zephaniah", zep: "Zephaniah",
  hag: "Haggai", zech: "Zechariah", zec: "Zechariah", mal: "Malachi",
  mt: "Matthew", matt: "Matthew", mat: "Matthew",
  mk: "Mark", mar: "Mark", mrk: "Mark",
  lk: "Luke", luk: "Luke",
  jn: "John", joh: "John", jhn: "John",
  act: "Acts", ac: "Acts",
  rom: "Romans", ro: "Romans", rm: "Romans",
  "1cor": "1 Corinthians", "1co": "1 Corinthians",
  "2cor": "2 Corinthians", "2co": "2 Corinthians",
  gal: "Galatians", ga: "Galatians",
  eph: "Ephesians", ep: "Ephesians",
  phil: "Philippians", php: "Philippians", phi: "Philippians",
  col: "Colossians",
  "1thess": "1 Thessalonians", "1thes": "1 Thessalonians", "1th": "1 Thessalonians",
  "2thess": "2 Thessalonians", "2thes": "2 Thessalonians", "2th": "2 Thessalonians",
  "1tim": "1 Timothy", "1ti": "1 Timothy", "1tm": "1 Timothy",
  "2tim": "2 Timothy", "2ti": "2 Timothy", "2tm": "2 Timothy",
  tit: "Titus", ti: "Titus", phlm: "Philemon", phm: "Philemon",
  heb: "Hebrews", hb: "Hebrews", jas: "James", jam: "James", jms: "James",
  "1pet": "1 Peter", "1pe": "1 Peter", "1pt": "1 Peter",
  "2pet": "2 Peter", "2pe": "2 Peter", "2pt": "2 Peter",
  "1jn": "1 John", "1jo": "1 John", "1joh": "1 John",
  "2jn": "2 John", "2jo": "2 John", "2joh": "2 John",
  "3jn": "3 John", "3jo": "3 John", "3joh": "3 John",
  jud: "Jude", jde: "Jude",
  rev: "Revelation", rv: "Revelation", re: "Revelation",
  apocalypse: "Revelation",
};

/** Normalises "1st Cor.", "I Corinthians", "psalm" → comparable key. */
export function normaliseBookKey(raw: string): string {
  let s = raw.toLowerCase().trim().replace(/\./g, "").replace(/\s+/g, " ");
  s = s
    .replace(/^i{3}\s/, "3 ")
    .replace(/^i{2}\s/, "2 ")
    .replace(/^i\s/, "1 ")
    .replace(/^first\s/, "1 ")
    .replace(/^second\s/, "2 ")
    .replace(/^third\s/, "3 ")
    .replace(/^(\d)(st|nd|rd)\s/, "$1 ");
  return s.replace(/\s/g, "");
}

/**
 * Resolve a typed book name against the canonical list of the loaded dataset.
 * Returns the canonical book name or null.
 */
export function resolveBook(input: string, canonical: string[]): string | null {
  const key = normaliseBookKey(input);
  if (!key) return null;
  const byKey = new Map(canonical.map((b) => [normaliseBookKey(b), b]));
  if (byKey.has(key)) return byKey.get(key)!;
  if (ALIASES[key]) return ALIASES[key];
  // prefix match, e.g. "philipp" → Philippians
  const prefix = canonical.find((b) => normaliseBookKey(b).startsWith(key));
  if (prefix) return prefix;
  const aliasPrefix = Object.keys(ALIASES).find((a) => a.startsWith(key));
  if (aliasPrefix) return ALIASES[aliasPrefix] ?? null;
  return null;
}

export interface ParsedReference {
  book: string;
  chapter: number;
  verse: number | null;
}

/**
 * Parses "John 3:16", "john 3 16", "Jn 3:16", "1 cor 13", "Rom 8".
 */
export function parseReference(query: string, canonical: string[]): ParsedReference | null {
  const cleaned = query.trim().replace(/\s+/g, " ");
  const m = cleaned.match(/^([\d]?\s?[a-zA-Z. ]+?)\s*(\d+)?\s*[:. ]?\s*(\d+)?$/);
  if (!m) return null;
  const [, rawBook, rawChapter, rawVerse] = m;
  if (!rawBook) return null;
  const book = resolveBook(rawBook, canonical);
  if (!book) return null;
  return {
    book,
    chapter: rawChapter ? parseInt(rawChapter, 10) : 1,
    verse: rawVerse ? parseInt(rawVerse, 10) : null,
  };
}