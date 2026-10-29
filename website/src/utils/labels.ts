// utils/labels.ts — Grammar helpers for organisation labels: plural form + a/an article (B-63, B-69)

// pluralize — "Utility" -> "Utilities", "Box" -> "Boxes", "Fund" -> "Funds"; irregular words need an explicit *_label_plural in OrgConfig
export function pluralize(word: string): string {
  if (!word) return word
  if (/[^aeiou]y$/i.test(word)) return word.slice(0, -1) + 'ies'   // consonant + y
  if (/(s|x|z|ch|sh)$/i.test(word)) return word + 'es'
  return word + 's'
}

// indefinite — "a" or "an" for a label ("an Employee", "a Project"); vowel-letter rule plus the common sound exceptions (a Utility, an Hour)
export function indefinite(word: string): 'a' | 'an' {
  const w = word.trim()
  if (/^(uni|use|usu|uti|eu|one)/i.test(w)) return 'a'    // "yoo"/"wun" sound
  if (/^(hour|hono|heir)/i.test(w)) return 'an'           // silent h
  return /^[aeiou]/i.test(w) ? 'an' : 'a'
}
