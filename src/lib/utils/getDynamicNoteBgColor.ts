// Generate a distinct color (HSL) based on index
function getColor(index: number) {
  const hue = (index * 47) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 85%, 65%), hsl(${(hue + 40) % 360}, 85%, 55%))`;
}

// Determine best text color (black/white) based on bg color
function getTextColor(bg: string) {
  const rgb = bg.match(/\d+/g)?.map(Number);
  if (!rgb) return "text-black";

  let [r, g, b] = rgb;
  if (bg.startsWith("hsl")) {
    // Convert HSL to RGB
    const h = rgb[0] / 360;
    const s = rgb[1] / 100;
    const l = rgb[2] / 100;

    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    [r, g, b] = [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
  }

  // Luminance check
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "text-black" : "text-white";
}

export const getDynamicNoteBgColor: (noteIdx: number) => { text: string; bg: string } = (
  noteIdx: number
) => {
  const bgColor = getColor(noteIdx);
  const textColor = getTextColor(bgColor);
  return {
    text: textColor,
    bg: bgColor,
  };
};
