const bulletRegex = /^(?:[•*-]|â€¢)\s*/;

export const splitSummaryIntoSections = (summary: string) => {
  const normalizedSummary = summary.replace(/\r\n/g, "\n").trim();

  if (!normalizedSummary) {
    return [];
  }

  const headingMatches = [...normalizedSummary.matchAll(/^#\s+.+$/gm)];

  if (headingMatches.length === 0) {
    return [normalizedSummary];
  }

  return headingMatches.map((match, index) => {
    const start = match.index ?? 0;
    const end =
      index + 1 < headingMatches.length
        ? headingMatches[index + 1].index ?? normalizedSummary.length
        : normalizedSummary.length;

    return normalizedSummary.slice(start, end).trim();
  });
};

export const parseSection = (
  section: string
): { title: string; points: string[] } => {
  const [title, ...content] = section.split("\n");
  const hasMarkdownTitle = title.startsWith("#");

  const cleanTitle = hasMarkdownTitle ? title.substring(1).trim() : "Summary";
  const contentLines = hasMarkdownTitle ? content : section.split("\n");

  const points: string[] = [];
  let currentPoint = "";

  contentLines.forEach((line) => {
    const trimmedLine = line.trim();
    if (bulletRegex.test(trimmedLine)) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = trimmedLine;
    } else if (!trimmedLine) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = "";
    } else {
      currentPoint = currentPoint
        ? `${currentPoint} ${trimmedLine}`
        : trimmedLine;
    }
  });

  if (currentPoint) points.push(currentPoint.trim());

  return {
    title: cleanTitle,
    points: points.filter(
      (point) => point && !point.startsWith("#") && !point.startsWith("[Choose")
    ),
  };
};

export function parsePoint(point: string) {
  const isNumbered = /^\d+\./.test(point);
  const isMainPoint = bulletRegex.test(point);
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u;

  const hasEmoji = emojiRegex.test(point);
  const isEmpty = !point.trim();

  return { isNumbered, isMainPoint, hasEmoji, isEmpty };
}

export function parseEmojiPoint(content: string) {
  const cleanContent = content.replace(bulletRegex, "").trim();

  const matches = cleanContent.match(/^(\p{Emoji}+)(.+)$/u);

  if (!matches) return null;

  const [_, emoji, text] = matches;
  return {
    emoji: emoji.trim(),
    text: text.trim(),
  };
}
