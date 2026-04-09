import "../styles/LoadingSpinner.css";

export default function LoadingSpinner({ color = "black", size = "medium" }) {
  return (
    <div
      className={`loading-spinner ${size}`}
      style={{ borderTopColor: color }}
    ></div>
  );
}