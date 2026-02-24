export default function AppCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        bg-[var(--bg-card)]
        border border-[var(--border)]
        rounded-[var(--radius-lg)]
        p-6
      "
    >
      {children}
    </div>
  );
}
