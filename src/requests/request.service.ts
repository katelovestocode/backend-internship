import { InjectRepository } from '@nestjs/typeorm'
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { Request } from './entities/request.entity'
import { Company } from 'src/company/entities/company.entity'
import { RequestStatus } from 'src/company/types/types'
import { AllRequests, JoinRequest } from './types/types'

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // USER ACTIONS
  // get a list of all requests to join a company sent by a user
  async allUsersRequestsToJoin(userId: number): Promise<AllRequests> {
    try {
      const allRequests = await this.requestRepository.find({
        where: { requester: { id: userId } },
        relations: ['company'],
      })

      return {
        status_code: HttpStatus.OK,
        result: 'Successfully retrieved all requests',
        details: {
          requests: allRequests,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // USER sends a request to join a company
  async userSendsJoinRequest(
    companyId: number,
    userId: number,
  ): Promise<JoinRequest> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
      })

      if (!company) {
        throw new NotFoundException('Company is not found')
      }

      const existingRequest = await this.requestRepository.findOne({
        where: {
          company: { id: companyId },
          requester: { id: userId },
          status: In(['pending', 'accepted', 'declined']),
        },
      })

      if (existingRequest) {
        throw new BadRequestException(
          'User already has a pending, accepted or declined request for this company',
        )
      }

      const request = this.requestRepository.create({
        status: RequestStatus.Pending,
        requester: { id: userId },
        company: { id: company.id },
      })

      const newRequest = await this.requestRepository.save(request)

      return {
        status_code: HttpStatus.CREATED,
        result: 'Request has been sent successfully',
        details: {
          request: newRequest,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // USER cancelled their own request to join a company
  async userCancelledJoinRequest(
    userId: number,
    requestId: number,
  ): Promise<JoinRequest> {
    try {
      const request = await this.requestRepository.findOne({
        where: { id: requestId },
        relations: ['requester'],
      })
      if (!request) {
        throw new NotFoundException('Request is not found')
      }

      if (request.requester.id !== userId) {
        throw new NotFoundException('Request does not belong to the user')
      }

      if (request.status === 'cancelled') {
        throw new NotFoundException('Request is already cancelled')
      }

      if (request.status !== 'pending') {
        throw new BadRequestException('Request is not in pending status')
      }

      await this.requestRepository.update(request.id, {
        status: RequestStatus.Cancelled,
      })

      const updatedRequest = await this.requestRepository.findOne({
        where: { id: requestId },
        relations: ['requester'],
      })
      return {
        status_code: HttpStatus.OK,
        result: 'Request has been cancelled successfully',
        details: {
          request: updatedRequest,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // COMPANY ACTIONS
  // get a list of all requests to join a company
  async getAllCompanyRequests(companyId: number): Promise<AllRequests> {
    try {
      const allRequests = await this.requestRepository.find({
        where: { company: { id: companyId } },
        relations: ['company', 'requester'],
      })

      return {
        status_code: HttpStatus.OK,
        result: 'Successfully retrieved all requests',
        details: {
          requests: allRequests,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // COMPANY's owner is accepting join request
  async companyAcceptsJoinRequest(
    companyId: number,
    requestId: number,
  ): Promise<JoinRequest> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
        relations: ['owner', 'members'],
      })

      if (!company) {
        throw new NotFoundException('Company is not found')
      }

      const request = await this.requestRepository.findOne({
        where: { id: requestId },
        relations: ['requester'],
      })

      if (!request) {
        throw new NotFoundException('Request is not found')
      }

      if (request.status === 'accepted') {
        throw new NotFoundException('Request is already accepted')
      }

      if (request.status !== 'pending') {
        throw new BadRequestException('Request is not in pending status')
      }

      company.members.push(request.requester)
      await this.companyRepository.save(company)

      request.status = RequestStatus.Accepted
      const acceptedRequest = await this.requestRepository.save(request)

      return {
        status_code: HttpStatus.OK,
        result: 'Request has been accepted',
        details: {
          request: acceptedRequest,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // COMPANY's owner is declining a join request
  async companyDeclinesJoinRequest(
    companyId: number,
    requestId: number,
  ): Promise<JoinRequest> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
        relations: ['owner', 'members'],
      })

      if (!company) {
        throw new NotFoundException('Company is not found')
      }

      const request = await this.requestRepository.findOne({
        where: { id: requestId, company: { id: companyId } },
        relations: ['requester'],
      })

      if (!request) {
        throw new NotFoundException('Request is not found')
      }

      if (request.status === 'declined') {
        throw new NotFoundException('Request is already declined')
      }

      if (request.status !== 'pending') {
        throw new BadRequestException('Request is not in pending status')
      }

      request.status = RequestStatus.Declined
      const declinedRequest = await this.requestRepository.save(request)

      return {
        status_code: HttpStatus.OK,
        result: 'Request has been declined',
        details: {
          request: declinedRequest,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
