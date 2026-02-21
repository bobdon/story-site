function stripMarkdown(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
}

export function getExcerpt(content: string, maxLength = 160) {
  const plain = stripMarkdown(content)
  if (plain.length <= maxLength) return plain
  const truncated = plain.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '…'
}

export function getReadingTime(content: string) {
  const plain = stripMarkdown(content)
  const words = plain.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 238))
  return `${minutes} min read`
}
