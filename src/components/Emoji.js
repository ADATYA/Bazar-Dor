// Shows an emoji, or an <img> if the API gives an image URL / path
export default function Emoji({ value, className = "text-4xl" }) {
  const v = String(value ?? "🛒");
  if (/^(https?:|\/|data:)/.test(v) || /\.(png|jpe?g|webp|svg|gif)$/i.test(v)) {
    return <img src={v} alt="" className="h-12 w-12 object-contain" loading="lazy"
      onError={(e) => { e.currentTarget.replaceWith(document.createTextNode("🛒")); }} />;
  }
  return <div className={className}>{v}</div>;
}
