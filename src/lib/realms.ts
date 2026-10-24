// The four genre realms. Slugs match the legacy /realm/:realmId URLs; `dbRealm` is
// the Realm enum value the battle tables were written with.
export type RealmSlug = 'cultivation' | 'gamelit' | 'apocalypse' | 'portal'

export interface Realm {
  slug: RealmSlug
  dbRealm: 'XIANXIA' | 'GAMELIT' | 'APOCALYPSE' | 'ISEKAI'
  name: string
  tagline: string
  blurb: string
  boss: string
  bossLore: string
  // Royal Road tags that place a book in this realm (matched as exact tags).
  tags: string[]
  image: string
  icon: string
  primary: string
  accent: string
}

export const REALMS: Realm[] = [
  {
    slug: 'gamelit',
    dbRealm: 'GAMELIT',
    name: 'GameLit',
    tagline: 'Stats, skills, and the System',
    blurb:
      'Blue boxes, level-ups, dungeon crawls, and VR worlds. The heart of LitRPG: stories where the rules of the game are the rules of the world.',
    boss: 'Glitchlord Exeon',
    bossLore:
      'Once an elite NPC meant to guide players, Exeon gained sentience after a failed patch and now rules a corrupted server shard.',
    tags: ['LitRPG', 'GameLit', 'Virtual Reality', 'Dungeon', 'Dungeon Crawler'],
    image: '/images/realms/gamelit.png',
    icon: '/images/realms/gamelit-icon.png',
    primary: '#6c00ff',
    accent: '#00f7ff',
  },
  {
    slug: 'cultivation',
    dbRealm: 'XIANXIA',
    name: 'Cultivation',
    tagline: 'Qi, sects, and the long road to immortality',
    blurb:
      'Xianxia, wuxia, and martial arts progression. Break through realms, survive tribulations, and outlast arrogant young masters.',
    boss: 'Longzu, the Heaven-Scourging Flame',
    bossLore:
      'A guardian of the Dao twisted by the essence of a fallen sun, Longzu incinerates any cultivator who nears immortality without divine sanction.',
    tags: ['Xianxia', 'Wuxia', 'Martial Arts', 'Cultivation'],
    image: '/images/realms/cultivation.png',
    icon: '/images/realms/cultivation-icon.png',
    primary: '#1a4c3e',
    accent: '#d4af37',
  },
  {
    slug: 'apocalypse',
    dbRealm: 'APOCALYPSE',
    name: 'Apocalypse',
    tagline: 'The System arrives. Survive it.',
    blurb:
      'The world ends and the leveling begins. Post-apocalyptic survival, dystopias, and Earth turned into a dungeon.',
    boss: 'Zereth, Dungeon Architect of the End',
    bossLore:
      'The first herald of the System, Zereth terraforms cities into labyrinths and broadcasts World Events to forge humanity into a worthy rival.',
    tags: ['Post Apocalyptic', 'Dystopia', 'Apocalypse', 'Survival'],
    image: '/images/realms/apocalypse.png',
    icon: '/images/realms/apocalypse-icon.png',
    primary: '#3a3f4b',
    accent: '#ff7300',
  },
  {
    slug: 'portal',
    dbRealm: 'ISEKAI',
    name: 'Portal & Isekai',
    tagline: 'Another world, another life',
    blurb:
      'Transported, reincarnated, or looping back in time. Second chances in strange worlds, with knowledge nobody else has.',
    boss: 'Aurelion the Eternal Return',
    bossLore:
      'An ordinary man who cheated death across 10,000 worlds, Aurelion rules the Astral Crossroads and hungers for the souls of the reborn.',
    tags: ['Portal Fantasy / Isekai', 'Reincarnation', 'Time Loop', 'Time Travel'],
    image: '/images/realms/portal.png',
    icon: '/images/realms/portal-icon.png',
    primary: '#2b1d3b',
    accent: '#ffd369',
  },
]

export function getRealm(slug: string): Realm | undefined {
  return REALMS.find(realm => realm.slug === slug)
}

export function realmsForTags(tags: string[]): Realm[] {
  return REALMS.filter(realm => realm.tags.some(tag => tags.includes(tag)))
}
