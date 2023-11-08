import { Invitation } from '../entities/invitation.entity'

export type AllInvitesResponse = {
  status_code: number
  result: string
  details: AllInvDetails
}

type AllInvDetails = {
  invitations: Invitation[]
}

export type InvitationResponse = {
  status_code: number
  result: string
  details: InvDetails
}

export type InvDetails = {
  invitation: Invitation
}
