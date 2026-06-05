export type MessageReason =
  | "job_opportunity"
  | "project_collaboration"
  | "technical_question"
  | "professional_networking"
  | "mentorship"
  | "freelance_proposal"

export interface SendPortfolioMessagePayload {
  recipient_id: string
  portfolio_slug?: string
  reason: MessageReason
  reason_title: string
  base_message: string
  additional_details?: string
  contact_name?: string
  contact_email?: string
}

export interface ApiMessageUserInformation {
  id?: number
  fullname?: string | null
  occupation?: string | null
  image_url?: string | null
  nationality?: string | null
  phone_number?: string | null
  public_email?: string | null
}

export interface ApiMessageUser {
  id: number
  username?: string | null
  email?: string | null
  is_active?: boolean
  role_id?: number
  user_information?: ApiMessageUserInformation | null
}

export interface ApiMessage {
  id: number
  message: string
  sender_id: number | null
  receiver_id: number
  is_read: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  guest_name?: string | null
  guest_email?: string | null
  sender?: ApiMessageUser | null
}

export interface InboxMessage {
  id: string
  senderId: string
  receiverId: string
  from: string
  fromEmail: string
  fromPhoto?: string
  category: string
  message: string
  additionalDetails?: string
  contactName?: string
  contactEmail?: string
  date: string
  read: boolean
  createdAt: string
  rawMessage: string
}
