
/**
 * run away from possibly malicious HTML stuff to prevent Crosas-Site Scripting.
 * get rid of annoying characters like these...        ---->           <, >, &, ", '
 */
export const sanitizeInput = (dirtyString) => {
  if (typeof dirtyString !== 'string') return ''
  return dirtyString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}
