
import { Avatar } from './Avatar'

interface Member {
  initials: string
  name: string
}

interface AvatarStackProps {
  members: Member[]
  size?: 'sm' | 'md' | 'lg'
  max?: number
}

export function AvatarStack({ members, size = 'sm', max = 4 }: AvatarStackProps) {
  const visible = members.slice(0, max)
  const overflow = members.length - max

  return (
    <div className="flex items-center">
      {visible.map((member, i) => (
        <div
          key={i}
          className="relative"
          style={{ marginLeft: i === 0 ? 0 : '-8px', zIndex: visible.length - i }}
          title={member.name}
        >
          <Avatar initials={member.initials} size={size} className="ring-1 ring-surface" />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="relative flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium font-sans bg-border text-text-secondary ring-1 ring-surface"
          style={{ marginLeft: '-8px', zIndex: 0 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
