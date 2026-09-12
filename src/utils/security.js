import DOMPurify from 'dompurify';

export const sanitizeInput = (dirtyInput) => {
  if (!dirtyInput) return '';
  return DOMPurify.sanitize(dirtyInput, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'], // Autorise juste le formatage basique
    ALLOWED_ATTR: ['href']
  });
};