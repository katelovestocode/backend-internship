import { InjectRepository } from '@nestjs/typeorm'
import { Invitation } from './entities/invitation.entity'
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { In, Not, Repository } from 'typeorm'
import { InvitationStatus } from 'src/company/types/types'
import { Company } from 'src/company/entities/company.entity'
import { User } from 'src/user/entities/user.entity'
import { AllInvitesResponse, InvitationResponse } from './types/types'

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // COMPANY
  // get a list of all invites sent by the company to join
  async getAllCompanyInvitations(
    companyId: number,
  ): Promise<AllInvitesResponse> {
    try {
      const allInvitations = await this.invitationRepository.find({
        where: {
          company: { id: companyId },
          status: Not(In(['cancelled', 'declined'])),
        },
        relations: ['company', 'invitee'],
      })

      return {
        status_code: HttpStatus.OK,
        result: 'Successfully retrieved all invitations',
        details: {
          invitations: allInvitations,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // COMPANY sends invitation
  async compSendsInvitation(
    inviteeId: number,
    companyId: number,
  ): Promise<InvitationResponse> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
        relations: ['owner'],
      })

      if (!company) {
        throw new NotFoundException('Company is not found')
      }

      const invitedUser = await this.userRepository.findOne({
        where: { id: inviteeId },
      })

      if (invitedUser.id === company.owner.id) {
        throw new BadRequestException(
          "You can't add owner to the member's list!",
        )
      }

      if (!invitedUser) {
        throw new NotFoundException('Invited user is not found')
      }

      const existingInvitation = await this.invitationRepository.findOne({
        where: {
          company: { id: companyId },
          invitee: { id: inviteeId },
          status: In(['pending', 'accepted', 'declined', 'cancelled']),
        },
      })

      if (existingInvitation) {
        throw new BadRequestException(
          'User already has a pending, accepted, declined or cancelled invitation from the company',
        )
      }

      const invitation = this.invitationRepository.create({
        status: InvitationStatus.Pending,
        inviter: { id: company.owner.id },
        invitee: { id: inviteeId },
        company: { id: companyId },
      })

      const newInvitation = await this.invitationRepository.save(invitation)

      return {
        status_code: HttpStatus.CREATED,
        result: 'Invitation has been sent successfully',
        details: {
          invitation: newInvitation,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // COMPANY cancels their own invitation
  async compCancelledInvitation(
    companyId: number,
    invitationId: number,
  ): Promise<InvitationResponse> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
        relations: ['owner'],
      })

      if (!company) {
        throw new NotFoundException('Company is not found')
      }

      const invitation = await this.invitationRepository.findOne({
        where: { id: invitationId },
        relations: ['inviter'],
      })

      if (!invitation) {
        throw new NotFoundException('Invitation is not found')
      }

      if (invitation.inviter.id !== company.owner.id) {
        throw new UnauthorizedException(
          'You can only cancel your own invitations',
        )
      }

      if (invitation.status === 'cancelled') {
        throw new NotFoundException('Invitation is already cancelled')
      }

      if (invitation.status !== 'pending') {
        throw new BadRequestException('Invitation is not in pending status')
      }

      await this.invitationRepository.update(invitation.id, {
        status: InvitationStatus.Cancelled,
      })

      const updatedInvitation = await this.invitationRepository.findOne({
        where: { id: invitationId },
        relations: ['inviter'],
      })

      return {
        status_code: HttpStatus.OK,
        result: 'Invitation has been cancelled successfully',
        details: {
          invitation: updatedInvitation,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // USER ACTIONS
  // get a list of all invites user received to join companies
  async getAllUsersInvitations(userId: number): Promise<AllInvitesResponse> {
    try {
      const allInvitations = await this.invitationRepository.find({
        where: {
          invitee: { id: userId },
          status: Not(In(['cancelled', 'declined'])),
        },

        relations: ['company'],
      })

      return {
        status_code: HttpStatus.OK,
        result: 'Successfully retrieved all invitations',
        details: {
          invitations: allInvitations,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // USER accepts invitation
  async userAcceptsInvitation(
    userId: number,
    invitationId: number,
  ): Promise<InvitationResponse> {
    try {
      const invitation = await this.invitationRepository.findOne({
        where: { id: invitationId },
        relations: ['inviter', 'invitee', 'company', 'company.members'],
      })

      if (!invitation) {
        throw new NotFoundException('Invitation is not found')
      }

      const user = await this.userRepository.findOne({ where: { id: userId } })

      if (!user) {
        throw new NotFoundException('User is not found!')
      }

      if (invitation.invitee.id !== userId) {
        throw new UnauthorizedException(
          'You can only accept your own invitations',
        )
      }

      if (invitation.status === 'accepted') {
        throw new NotFoundException('Invitation is already accepted')
      }

      if (invitation.status !== 'pending') {
        throw new BadRequestException('Invitation is not in pending status')
      }

      // save accepted user into company's members table
      invitation.company.members.push(user)
      await this.companyRepository.save(invitation.company)

      invitation.status = InvitationStatus.Accepted
      const acceptedInvite = await this.invitationRepository.save(invitation)

      return {
        status_code: HttpStatus.OK,
        result: 'Invitation has been accepted',
        details: {
          invitation: acceptedInvite,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // USER declines company's invitation
  async userDeclineInvitation(
    userId: number,
    invitationId: number,
  ): Promise<InvitationResponse> {
    try {
      const invitation = await this.invitationRepository.findOne({
        where: { id: invitationId },
        relations: ['inviter', 'invitee'],
      })

      if (!invitation) {
        throw new NotFoundException('Invitation is not found')
      }

      const user = await this.userRepository.findOne({ where: { id: userId } })

      if (!user) {
        throw new NotFoundException('User is not found!')
      }

      if (invitation.invitee.id !== userId) {
        throw new UnauthorizedException(
          'You can only decline your own invitations',
        )
      }

      if (invitation.status === 'declined') {
        throw new NotFoundException('Invitation is already declined')
      }

      if (invitation.status !== 'pending') {
        throw new BadRequestException('Invitation is not in pending status')
      }

      invitation.status = InvitationStatus.Declined
      const updatedInvite = await this.invitationRepository.save(invitation)

      return {
        status_code: HttpStatus.OK,
        result: 'Invitation has been declined',
        details: {
          invitation: updatedInvite,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
