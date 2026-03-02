const MS_IN_MINUTE = 1000 * 60
const MS_IN_HOUR = 1000 * 60 * 60
const MS_IN_DAY = MS_IN_HOUR * 24
const MS_IN_WEEK = MS_IN_DAY * 7
const MS_IN_YEAR = MS_IN_DAY * 365

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return `${day}th`
  const lastDigit = day % 10
  switch (lastDigit) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

export function formatDate(date: string | Date): string {
  const targetDate = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - targetDate.getTime()

  if (Number.isNaN(targetDate.getTime())) {
    return ""
  }

  // under a week -> relative time
  if (diffMs < MS_IN_WEEK && diffMs >= 0) {
    if (diffMs < MS_IN_HOUR) {
      const minutes = Math.max(1, Math.floor(diffMs / MS_IN_MINUTE))
      return `${minutes}m ago`
    }

    if (diffMs < MS_IN_DAY) {
      const hours = Math.max(1, Math.floor(diffMs / MS_IN_HOUR))
      return `${hours}h ago`
    }

    const days = Math.max(1, Math.floor(diffMs / MS_IN_DAY))
    return days === 1 ? "1 day ago" : `${days} days ago`
  }

  const day = targetDate.getDate()
  const monthName = MONTH_NAMES[targetDate.getMonth()]
  const year = targetDate.getFullYear()

  // over a year -> include year, no ordinal
  if (diffMs >= MS_IN_YEAR) {
    return `${day} ${monthName} ${year}`
  }

  // over a week but under a year -> ordinal day + month
  const ordinalDay = getOrdinalSuffix(day)
  return `${ordinalDay} ${monthName}`
}
