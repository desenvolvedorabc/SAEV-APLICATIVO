export function limparHTML(str: string) {
  return str.replace(/<[^>]*>/g, '').trim();
}