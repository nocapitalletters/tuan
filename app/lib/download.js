export function downloadUrl(url) {
  return `/download?file=${encodeURIComponent(url)}`;
}
