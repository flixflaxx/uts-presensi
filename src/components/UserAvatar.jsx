export default function UserAvatar({ user, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const initials = (user?.name || 'User')
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br ${
        user?.avatarBg || 'from-indigo-200 to-purple-100'
      } font-bold shadow-sm select-none shrink-0 overflow-hidden ${sizeClasses[size] || sizeClasses.md} ${className}`}
      style={{ color: user?.avatarColor || '#4338CA' }}
      aria-label={user?.name || 'User avatar'}
    >
      <span>{initials}</span>
    </div>
  );
}

