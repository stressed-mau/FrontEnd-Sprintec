declare module "mailcheck" {
  export type MailcheckSuggestion = {
    address: string
    domain: string
    full: string
  }

  type RunOptions = {
    email: string
    suggested?: (suggestion: MailcheckSuggestion) => void
    empty?: () => void
    domains?: string[]
    secondLevelDomains?: string[]
    topLevelDomains?: string[]
  }

  const Mailcheck: {
    run(options: RunOptions): void
  }

  export default Mailcheck
}
