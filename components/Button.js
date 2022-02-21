export default function Button({ children, ...props }) {
  return (
    <button
      className={`
      border-silver border border-dashed transition-custom p-0.5 px-1 block
      hover:border-solid hover:border-blue-fg hover:text-blue-fg hover:bg-blue-bg
      `}
      {...props}
    >
      {children}
    </button>
  );
}
