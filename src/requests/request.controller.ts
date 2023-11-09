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
import { RequestService } from './request.service'
import { AuthGuard } from '@nestjs/passport'
import { UserValidGuard } from 'src/user/guards/validation.guard'
import { CompanyValidGuard } from 'src/company/guards/company-validation.guard'
import { AllRequests, JoinRequest } from './types/types'

@Controller('')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  // USER ACTIONS
  // get a list of all requests to join a company sent by a user
  @Get('/users/:userId/requests')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async getUserRequests(@Param('userId') userId: number): Promise<AllRequests> {
    return this.requestService.allUsersRequestsToJoin(+userId)
  }

  // USER sends a request to join a company
  @Post('/users/:userId/requests/:companyId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.CREATED)
  async sendJoinRequest(
    @Param('userId') userId: number,
    @Param('companyId') companyId: number,
  ): Promise<JoinRequest> {
    return await this.requestService.userSendsJoinRequest(+companyId, +userId)
  }

  // USER cancelled their own request to join a company
  @Put('/users/:userId/requests/:requestId')
  @UseGuards(AuthGuard(['jwt', 'auth0']), UserValidGuard)
  @HttpCode(HttpStatus.OK)
  async cancelJoinRequest(
    @Param('userId') userId: number,
    @Param('requestId') requestId: number,
  ): Promise<JoinRequest> {
    return await this.requestService.userCancelledJoinRequest(
      +userId,
      +requestId,
    )
  }

  // COMPANY ACTIONS
  // get a list of all requests to join a company
  @Get('/companies/:companyId/requests')
  @UseGuards(AuthGuard(['jwt', 'auth0']), CompanyValidGuard)
  @HttpCode(HttpStatus.OK)
  async getCompanyRequests(
    @Param('companyId') companyId: number,
  ): Promise<AllRequests> {
    return this.requestService.getAllCompanyRequests(+companyId)
  }

  // COMPANY's owner is accepting join request
  @Put('/companies/:companyId/requests/:requestId/accept')
  @UseGuards(AuthGuard(['jwt', 'auth0']), CompanyValidGuard)
  @HttpCode(HttpStatus.OK)
  async acceptJoinRequest(
    @Param('companyId') companyId: number,
    @Param('requestId') requestId: number,
  ): Promise<JoinRequest> {
    return await this.requestService.companyAcceptsJoinRequest(
      +companyId,
      +requestId,
    )
  }

  // COMPANY's owner is declining a join request
  @Put('/companies/:companyId/requests/:requestId/decline')
  @UseGuards(AuthGuard(['jwt', 'auth0']), CompanyValidGuard)
  @HttpCode(HttpStatus.OK)
  async declineJoinRequest(
    @Param('companyId') companyId: number,
    @Param('requestId') requestId: number,
  ): Promise<JoinRequest> {
    return await this.requestService.companyDeclinesJoinRequest(
      +companyId,
      +requestId,
    )
  }
}
