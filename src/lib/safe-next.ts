// Post-sign-in redirect target: same-site paths only, so a crafted link can't bounce users elsewhere.
export function safeNext(value: FormDataEntryValue | string | null | undefined): string {
  const next = typeof value === 'string' ? value : ''
  return next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : '/me'
}
