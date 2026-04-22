import { Whop } from "@whop/sdk"

export const whopsdk = new Whop({
  appID: process.env.NEXT_PUBLIC_WHOP_APP_ID,
  apiKey: process.env.WHOP_API_KEY,
})

// Get company_id from an experience
export async function getCompanyIdFromExperience(experienceId: string): Promise<string | null> {
  try {
    const experience = await whopsdk.experiences.retrieve(experienceId)
    // company is an object with id property
    return experience.company?.id || null
  } catch (error) {
    console.error('Error fetching experience:', error)
    return null
  }
}
