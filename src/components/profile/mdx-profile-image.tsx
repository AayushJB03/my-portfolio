import { USER } from "@/data"
import { getProfileContent } from "@/data/content"
import { ProfileImageCard } from "./profile-image-card"

export async function ProfileImage({
  className,
  alt = `${USER.fullName}'s profile picture`,
  size = 160,
}: {
  className?: string
  alt?: string
  size?: number
}) {
  const profile = await getProfileContent()

  return (
    <ProfileImageCard
      avatarUrl={profile.avatarUrl}
      alt={alt}
      className={className}
      size={size}
    />
  )
}
