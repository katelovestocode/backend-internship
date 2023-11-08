import { InjectRepository } from '@nestjs/typeorm'
import { Invitation } from './entities/invitation.entity'
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { Repository } from 'typeorm'
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
        where: { company: { id: companyId } },
        relations: ['company', 'invitee'],
      })

      return {
        status_code: HttpStatus.OK,
        result: 'success',
        details: {
          invitations: allInvitations,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // COMPANY sends invitation
  // body {"inviteeId": 3}
  async compSendsInvitation(
    inviteeId: number,
    companyId: number,
  ): Promise<InvitationResponse> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: +companyId },
        relations: ['owner'],
      })

      const invitedUser = await this.userRepository.findOne({
        where: { id: inviteeId },
      })

      if (!invitedUser) {
        throw new NotFoundException('Invited user is not found')
      }

      const invitation = this.invitationRepository.create({
        status: InvitationStatus.Pending,
        inviter: { id: company.owner.id },
        invitee: { id: +inviteeId },
        company: { id: companyId },
      })

      const newInvitation = await this.invitationRepository.save(invitation)

      return {
        status_code: HttpStatus.CREATED,
        result: 'success',
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
        where: { id: +companyId },
        relations: ['owner'],
      })

      const invitation = await this.invitationRepository.findOne({
        where: { id: +invitationId },
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

      await this.invitationRepository.update(invitation.id, {
        status: InvitationStatus.Cancelled,
      })

      const updatedInvitation = await this.invitationRepository.findOne({
        where: { id: +invitationId },
        relations: ['inviter'],
      })

      return {
        status_code: HttpStatus.OK,
        result: 'success',
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
        where: { invitee: { id: userId } },
        relations: ['company'],
      })

      return {
        status_code: HttpStatus.OK,
        result: 'success',
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

      if (invitation.invitee.id !== userId) {
        throw new UnauthorizedException(
          'You can only accept your own invitations',
        )
      }

      if (invitation.status === 'accepted') {
        throw new NotFoundException('Invitation is already accepted')
      }

      const user = await this.userRepository.findOne({ where: { id: userId } })

      // save accepted user into company's members table
      if (user) {
        invitation.company.members.push(user)
        await this.companyRepository.save(invitation.company)
      }

      invitation.status = InvitationStatus.Accepted
      const acceptedInvite = await this.invitationRepository.save(invitation)

      return {
        status_code: HttpStatus.OK,
        result: 'success',
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

      if (invitation.invitee.id !== userId) {
        throw new UnauthorizedException(
          'You can only decline your own invitations',
        )
      }

      if (invitation.status === 'declined') {
        throw new NotFoundException('Invitation is already declined')
      }

      invitation.status = InvitationStatus.Declined
      const updatedInvite = await this.invitationRepository.save(invitation)

      return {
        status_code: HttpStatus.OK,
        result: 'success',
        details: {
          invitation: updatedInvite,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
