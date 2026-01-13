/**
 * Challenge Content - All 5 days of content
 */

export interface ActionItem {
  id: string
  text: string
  points: number
  requiresInput?: boolean // If true, shows input field
  inputPlaceholder?: string
}

export interface DayContent {
  dayNumber: number
  title: string
  goal: string
  lessonBullets: string[]
  actionItems: ActionItem[]
}

export interface ChallengeContent {
  title: string
  subtitle: string
  whyAreWeHere: string[]
  howThisChallengeWorks: string[]
  days: DayContent[]
}

export const CHALLENGE_CONTENT: ChallengeContent = {
  title: 'WHOP 5-Day Challenge',
  subtitle: 'Launch Your First Paid Community (Build As You Go)',
  
  whyAreWeHere: [
    'To launch a paid community on Whop',
    'Easiest way for a beginner to start',
    'Lowest friction model',
    'Get momentum fast',
    'Get paid while building',
    'No course required',
  ],
  
  howThisChallengeWorks: [
    'We are beta launching',
    'We are not perfecting anything',
    'You will:',
    '  - Sell Month 1 access',
    '  - Teach live',
    '  - Record sessions',
    '  - Upload recordings as content',
    '  - Live first, polish later',
  ],
  
  days: [
    {
      dayNumber: 1,
      title: 'Model & Opportunity',
      goal: 'Believe this is doable',
      lessonBullets: [
        'Why paid communities work',
        'Why this is the easiest way to start',
        'Why low-ticket recurring removes pressure',
        'Examples of paid groups crushing on Whop',
        'Normal people getting results',
        'You do NOT need:',
        '  - Content',
        '  - A big audience',
        '  - To be an expert',
        'Build as you go',
      ],
      actionItems: [
        {
          id: 'day1-commit',
          text: "Commit to launching a paid community in 5 days",
          points: 10,
        },
        {
          id: 'day1-who',
          text: "Write your community's \"who it's for\" in 1 sentence",
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'e.g., "For busy professionals who want to build wealth"',
        },
        {
          id: 'day1-promise',
          text: 'Draft your Month 1 promise (simple outcome)',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'e.g., "Build your first revenue stream"',
        },
      ],
    },
    {
      dayNumber: 2,
      title: 'Market Research',
      goal: 'Pick the right market',
      lessonBullets: [
        'Markets matter more than ideas',
        "Don't invent demand",
        'Enter markets where money is moving',
        'The big markets:',
        '  - Health',
        '  - Wealth',
        '  - Relationships',
        'Find problems people already pay to solve',
      ],
      actionItems: [
        {
          id: 'day2-market',
          text: 'Pick a market (Health / Wealth / Relationships / Other)',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'Health, Wealth, Relationships, or Other',
        },
        {
          id: 'day2-niche',
          text: 'Pick a niche inside that market',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'e.g., "Weight loss for busy moms"',
        },
        {
          id: 'day2-problem',
          text: 'Identify 1 clear problem people already pay to solve',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'Describe the problem',
        },
        {
          id: 'day2-proof',
          text: 'Add proof people care (notes field + optional links)',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'Add proof, links, or examples',
        },
      ],
    },
    {
      dayNumber: 3,
      title: 'The Offer',
      goal: 'Define the outcome',
      lessonBullets: [
        "People don't pay for communities",
        'They pay for outcomes',
        'You are selling Month 1 progress',
        'Keep it simple and clear',
      ],
      actionItems: [
        {
          id: 'day3-offer',
          text: 'Write a 1-sentence offer',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'Your one-sentence offer',
        },
        {
          id: 'day3-outcome',
          text: 'Define the Month 1 outcome',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'What will they achieve in Month 1?',
        },
        {
          id: 'day3-delivery',
          text: 'Decide delivery method (live calls, accountability, templates, etc.)',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'How will you deliver the outcome?',
        },
        {
          id: 'day3-price',
          text: 'Set your monthly price',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'Enter your monthly price (e.g., $49, $97)',
        },
      ],
    },
    {
      dayNumber: 4,
      title: 'Pre-Sell & Setup',
      goal: 'Beta launch style setup',
      lessonBullets: [
        "You don't need a finished course to sell Month 1",
        'Sell access to progress + live implementation',
        'Simple setup beats perfect setup',
        'One clear CTA + one checkout link',
      ],
      actionItems: [
        {
          id: 'day4-product',
          text: 'Create your Whop product + monthly plan (name + price)',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'Product name and link (if available)',
        },
        {
          id: 'day4-invite',
          text: 'Write your simple invite message (3–5 sentences)',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'Your invite message',
        },
        {
          id: 'day4-session',
          text: 'Choose your first live session topic + date/time',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'Session topic and when',
        },
        {
          id: 'day4-outreach',
          text: 'Make an outreach list of 20 people OR 20 places to post',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'List your outreach targets or posting locations',
        },
      ],
    },
    {
      dayNumber: 5,
      title: 'Launch & Deliver',
      goal: 'Go live and ship the first session',
      lessonBullets: [
        'Live first, polish later',
        'Teaching live creates content automatically',
        'Deliver results > fancy production',
        'Capture wins/testimonials from Day 1',
      ],
      actionItems: [
        {
          id: 'day5-live',
          text: 'Host your first live session (or schedule it if time-zones require)',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'Session details or schedule',
        },
        {
          id: 'day5-upload',
          text: 'Record and upload the replay as content',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'Link to uploaded recording (if available)',
        },
        {
          id: 'day5-roadmap',
          text: "Post a \"Next 7 days\" roadmap to the community",
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'Your 7-day roadmap',
        },
        {
          id: 'day5-testimonials',
          text: 'Ask for 3 quick wins/testimonials and screenshot them',
          points: 10,
          requiresInput: true,
          inputPlaceholder: 'Add testimonials or wins',
        },
      ],
    },
  ],
}

/**
 * Get content for a specific day
 */
export function getDayContent(dayNumber: number): DayContent | null {
  return CHALLENGE_CONTENT.days.find(d => d.dayNumber === dayNumber) || null
}

/**
 * Calculate total possible points
 */
export function getTotalPossiblePoints(): number {
  let total = 0
  
  // Action items (10 points each)
  CHALLENGE_CONTENT.days.forEach(day => {
    total += day.actionItems.reduce((sum, item) => sum + item.points, 0)
  })
  
  // Day completion bonuses (50 each)
  total += 5 * 50
  
  // All 5 days completion bonus (200)
  total += 200
  
  return total
}

