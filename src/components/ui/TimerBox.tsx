interface TimerBoxProps {
  label: string;
  value: string;
  variant: 'amber' | 'green';
}

export default function TimerBox({ label, value, variant }: TimerBoxProps) {
  const colors = {
    amber: {
      bg: 'bg-amber-500/8',
      border: 'border-amber-500/25',
      label: 'text-amber-500/70',
      value: 'text-amber-600',
      icon: '#D97706',
    },
    green: {
      bg: 'bg-emerald-500/8',
      border: 'border-emerald-500/25',
      label: 'text-emerald-500/70',
      value: 'text-emerald-600',
      icon: '#34D399',
    },
  }[variant];

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-xl px-4 py-3 flex items-center justify-between`}>
      <div>
        <div className={`text-[11px] ${colors.label}`}>{label}</div>
        <div className={`text-2xl font-bold tabular-nums ${colors.value}`}>{value}</div>
      </div>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.icon} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    </div>
  );
}
