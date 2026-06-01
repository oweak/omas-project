const colorMap: Record<string, { bg: string; text: string }> = {
  default:  { bg: "bg-gray-100", text: "text-gray-600" },
  gray:     { bg: "bg-gray-200", text: "text-gray-700" },
  brown:    { bg: "bg-amber-100", text: "text-amber-800" },
  orange:   { bg: "bg-orange-100", text: "text-orange-700" },
  yellow:   { bg: "bg-yellow-100", text: "text-yellow-700" },
  green:    { bg: "bg-emerald-100", text: "text-emerald-700" },
  blue:     { bg: "bg-blue-100", text: "text-blue-700" },
  purple:   { bg: "bg-purple-100", text: "text-purple-700" },
  pink:     { bg: "bg-pink-100", text: "text-pink-700" },
  red:      { bg: "bg-red-100", text: "text-red-700" },
};

export function tagColor(color: string): string {
  const c = colorMap[color] || colorMap.default;
  return `${c.bg} ${c.text} px-2 py-0.5 rounded text-xs`;
}
