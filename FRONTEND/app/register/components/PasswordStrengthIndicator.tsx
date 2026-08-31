interface Props {
  password: string;
  strength: { score: number; label: string; color: string };
}

export default function PasswordStrengthIndicator({ password, strength }: Props) {
  if (!password) return null;

  const width = (strength.score / 6) * 100;

  return (
    <div className="mt-1 space-y-1">
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${strength.color} transition-all duration-300`}
          style={{ width: `${width}%` }}
        />
      </div>
      <p className={`text-xs ${strength.color.replace('bg-', 'text-')}`}>
        {strength.label}
        {strength.label !== 'Weak' && ' ✓'}
      </p>
    </div>
  );
}
