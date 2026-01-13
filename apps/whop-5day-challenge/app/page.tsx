import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to a default experience ID
  // In production, this would be dynamic based on user's experience
  const defaultExperienceId = process.env.DEFAULT_EXPERIENCE_ID || 'default'
  redirect(`/experiences/${defaultExperienceId}`)
}

