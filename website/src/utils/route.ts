// utils/route.ts — Hash-address helpers: split "#/path?id=5" into path + query params, build a path with an id (B-01)

export interface ParsedHash { path: string; params: URLSearchParams }

// splitHash — "#/projects/detail?id=5" -> { path: '/projects/detail', params: id=5 }
export function splitHash(raw: string): ParsedHash {
  const clean = raw.replace(/^#/, '')
  const q = clean.indexOf('?')
  return q === -1
    ? { path: clean, params: new URLSearchParams() }
    : { path: clean.slice(0, q), params: new URLSearchParams(clean.slice(q + 1)) }
}

// withId — build a detail/edit address that carries the record id
export function withId(path: string, id: string): string {
  return `${path}?id=${encodeURIComponent(id)}`
}
