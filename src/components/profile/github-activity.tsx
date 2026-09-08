import { USER } from "@/data"
import { cn } from "@/lib/utils"
import { HeaderTitle } from "./header-title"

type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE"

type ContributionDay = {
  contributionCount: number
  contributionLevel: ContributionLevel
  date: string
  weekday: number
}

type ContributionWeek = {
  contributionDays: ContributionDay[]
}

type ContributionMonth = {
  name: string
  totalWeeks: number
}

type ContributionCalendar = {
  totalContributions: number
  weeks: ContributionWeek[]
  months: ContributionMonth[]
}

type GitHubContributionResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar: ContributionCalendar
      }
    }
  }
  errors?: { message: string }[]
}

const contributionQuery = `
  query GitHubContributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          months {
            name
            totalWeeks
          }
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
              weekday
            }
          }
        }
      }
    }
  }
`

const levelClassName: Record<ContributionLevel, string> = {
  NONE: "bg-github-none",
  FIRST_QUARTILE: "bg-github-l1",
  SECOND_QUARTILE: "bg-github-l2",
  THIRD_QUARTILE: "bg-github-l3",
  FOURTH_QUARTILE: "bg-github-l4",
}

const getContributions = async () => {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    console.error(
      "GitHubActivity: GITHUB_TOKEN environment variable is not defined."
    )
    return null
  }

  const to = new Date()
  const from = new Date(to)
  from.setFullYear(from.getFullYear() - 1)

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "next-app",
      },
      body: JSON.stringify({
        query: contributionQuery,
        variables: {
          login: USER.username,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
      next: {
        revalidate: 60 * 60,
      },
    })

    if (!response.ok) {
      console.error(
        `GitHubActivity: Fetch failed with status ${response.status} ${response.statusText}`
      )
      const text = await response.text().catch(() => "")
      console.error(`GitHubActivity: Error response body: ${text}`)
      return null
    }

    const result = (await response.json()) as GitHubContributionResponse

    if (result.errors?.length) {
      console.error(
        "GitHubActivity: GraphQL errors returned from GitHub API:",
        result.errors
      )
      return null
    }

    return (
      result.data?.user?.contributionsCollection?.contributionCalendar ?? null
    )
  } catch (err) {
    console.error("GitHubActivity: Exception during fetch:", err)
    return null
  }
}

const getMonthStarts = (months: ContributionMonth[]) => {
  let weekIndex = 1

  return months.map((month) => {
    const start = weekIndex
    weekIndex += month.totalWeeks

    return {
      name: month.name.slice(0, 3),
      start,
    }
  })
}

export const GitHubActivity = async () => {
  const calendar = await getContributions()

  return (
    <section className="w-full">
      <HeaderTitle title="GitHub Activity" />
      <div className="space-y-3 p-2">
        <div className="border-edge bg-background/60 rounded-[10px] border p-3 sm:p-4">
          {calendar ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-primary/95 text-sm font-medium sm:text-base">
                    {calendar.totalContributions.toLocaleString()} contributions
                    in the last year
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Public GitHub activity for @{USER.username}
                  </p>
                </div>
                <a
                  href={`https://github.com/${USER.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary text-xs underline underline-offset-4"
                >
                  View on GitHub
                </a>
              </div>

              <div className="min-w-0 space-y-2">
                <div
                  className="text-muted-foreground hidden text-xs sm:grid"
                  style={{
                    gridTemplateColumns: `repeat(${calendar.weeks.length}, minmax(0, 1fr))`,
                  }}
                >
                  {getMonthStarts(calendar.months).map((month) => (
                    <span
                      key={`${month.name}-${month.start}`}
                      style={{ gridColumnStart: month.start }}
                    >
                      {month.name}
                    </span>
                  ))}
                </div>

                <div
                  className="grid min-w-0 gap-[2px] sm:gap-[3px]"
                  style={{
                    gridTemplateColumns: `repeat(${calendar.weeks.length}, minmax(0, 1fr))`,
                  }}
                >
                  {calendar.weeks.map((week, weekIndex) => (
                    <div
                      key={weekIndex}
                      className="grid min-w-0 grid-rows-7 gap-[2px] sm:gap-[3px]"
                    >
                      {week.contributionDays.map((day) => (
                        <span
                          key={day.date}
                          title={`${day.contributionCount} contributions on ${day.date}`}
                          className={cn(
                            "aspect-square min-h-[3px] rounded-[2px]",
                            "ring-background/80 ring-1",
                            levelClassName[day.contributionLevel]
                          )}
                          style={{
                            gridRowStart: day.weekday + 1,
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-muted-foreground text-xs">
                  Last 12 months of contributions
                </p>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <span>Less</span>
                  {(
                    [
                      "NONE",
                      "FIRST_QUARTILE",
                      "SECOND_QUARTILE",
                      "THIRD_QUARTILE",
                      "FOURTH_QUARTILE",
                    ] as ContributionLevel[]
                  ).map((level) => (
                    <span
                      key={level}
                      className={cn(
                        "ring-background/80 size-3 rounded-[2px] ring-1",
                        levelClassName[level]
                      )}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1 py-2">
              <h3 className="text-primary/95 text-sm font-medium">
                GitHub activity will appear here
              </h3>
              <p className="text-muted-foreground text-sm">
                Add a server-side GITHUB_TOKEN environment variable to render @
                {USER.username}&apos;s contribution graph.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
