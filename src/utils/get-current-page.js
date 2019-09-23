export default function() {
  const pages = getCurrentPages();
  return pages[pages.length - 1]
}
