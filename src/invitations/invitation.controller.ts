import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { InvitationService } from './invitation.service'
import { CompanyValidGuard } from 'src/company/guards/company-validation.guard'
import { AuthGuard } from '@nestjs/passport'
import { UserValidGuard } from 'src/user/guards/validation.guard'
import { AllInvitesResponse, InvitationResponse } from './types/types'

@Controller('')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  // COMPANY
  // get a list of all invites sent by the company to join
  @Get('/companies/:companyId/invitations')
  @UseGuards(AuthGuard(['jwt', 'auth0']), CompanyValidGuard)
  @HttpCode(HttpStatus.OK)
  async getCompanyInvitations(
    @Param('companyId') companyId: string,
  ): Promise<AllInvitesResponse> {
    return this.invitationService.getAllCompanyInvitations(+companyId)
  }

  // COMPANY sends invitation
  @Post('/companies/:companyId/invitations/:inviteeId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), CompanyValidGuard)
  @HttpCode(HttpStatus.CREATED)
  async sendCompanyInvitations(
    @Param('companyId') companyId: string,
    @Param('inviteeId') inviteeId: string,
  ): Promise<InvitationResponse> {
    return await this.invitationService.compSendsInvitation(
      +inviteeId,
      +companyId,
    )
  }

  //COMPANY
  // company cancels their own invitation
  @Put('/companies/:companyId/invitations/:invitationId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), CompanyValidGuard)
  @HttpCode(HttpStatus.OK)
  async cancelInvitation(
    @Param('companyId') companyId: string,
    @Param('invitationId') invitationId: string,
  ): Promise<InvitationResponse> {
    return await this.invitationService.compCancelledInvitation(
      +companyId,
      +invitationId,
    )
  }

  // USER ACTIONS
  // get a list of all invites user received to join companies
  @Get('/users/:userId/invitations')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async getUserInvitations(
    @Param('userId') userId: string,
  ): Promise<AllInvitesResponse> {
    return this.invitationService.getAllUsersInvitations(+userId)
  }

  // USER accepts invitation
  @Put('/users/:userId/invitations/:invitationId/accept')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async acceptInvitation(
    @Param('userId') userId: string,
    @Param('invitationId') invitationId: string,
  ): Promise<InvitationResponse> {
    return await this.invitationService.userAcceptsInvitation(
      +userId,
      +invitationId,
    )
  }

  // USER declines company's invitation
  @Put('/users/:userId/invitations/:invitationId/decline')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async declineInvitation(
    @Param('userId') userId: string,
    @Param('invitationId') invitationId: string,
  ): Promise<InvitationResponse> {
    return await this.invitationService.userDeclineInvitation(
      +userId,
      +invitationId,
    )
  }
}
