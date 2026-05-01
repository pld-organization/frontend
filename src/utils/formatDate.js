export function formatDate(value, locale = "fr-DZ", options = {}) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}
