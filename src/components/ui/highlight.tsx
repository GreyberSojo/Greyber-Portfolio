interface HighlightProps {
  children: React.ReactNode;
}

export function Highlight({ children }: HighlightProps) {
  return (
    <mark className="bg-yellow-200 text-yellow-900 px-1 rounded">
      {children}
    </mark>
  );
}
