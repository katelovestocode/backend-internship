import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Company } from './entities/company.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserService } from 'src/user/user.service'
import {
  AllCompaniesResponse,
  CompanyResponse,
  DeletedCompanyResponse,
} from './types/types'
import { JwtPayload } from 'src/user/types/user.types'

@Injectable()
export class CompanyService {
  constructor(
    private userService: UserService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async createCompany(
    createCompanyDto: CreateCompanyDto,
    user: JwtPayload,
  ): Promise<CompanyResponse> {
    try {
      const owner = await this.userService.getUserByEmail(user.email)

      if (!owner) {
        throw new NotFoundException('Owner is not found')
      }

      const company = this.companyRepository.create({
        name: createCompanyDto.name,
        description: createCompanyDto.description,
        owner: owner,
        ...createCompanyDto,
      })

      const newCompany = await this.companyRepository.save(company)

      return {
        status_code: HttpStatus.CREATED,
        result: 'success',
        details: {
          company: newCompany,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getAllCompanies(): Promise<AllCompaniesResponse> {
    try {
      return {
        status_code: HttpStatus.OK,
        result: 'success',
        details: {
          companies: await this.companyRepository.find(),
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getOneCompany(id: number): Promise<CompanyResponse> {
    try {
      const oneCompany = await this.companyRepository.findOne({ where: { id } })

      if (!oneCompany) {
        throw new NotFoundException('Company do not exist!')
      }

      return {
        status_code: HttpStatus.OK,
        result: 'success',
        details: {
          company: oneCompany,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateCompany(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyResponse> {
    try {
      const company = await this.companyRepository.findOne({ where: { id } })

      if (!company) {
        throw new NotFoundException('Company do not exist!')
      }

      await this.companyRepository.update(id, updateCompanyDto)

      const newlyUpdatedCompany = await this.companyRepository.findOne({
        where: { id },
      })

      return {
        status_code: HttpStatus.OK,
        result: 'success',
        details: {
          company: newlyUpdatedCompany,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async removeCompany(id: number): Promise<DeletedCompanyResponse> {
    try {
      const company = await this.companyRepository.findOne({ where: { id } })
      if (!company) {
        throw new NotFoundException('Company do not exist!')
      }

      await this.companyRepository.delete(id)

      return {
        status_code: HttpStatus.OK,
        result: 'success',
        details: {
          company: id,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async ownerRemoveUserFromCompany(
    companyId: number,
    userId: number,
  ): Promise<CompanyResponse> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: +companyId },
        relations: ['owner', 'members'],
      })
      const userToRemove = company.members.find((user) => user.id === userId)

      if (!userToRemove) {
        throw new NotFoundException(
          'User is not found in the company members list',
        )
      }

      company.members = company.members.filter((user) => user.id !== userId)
      const updated = await this.companyRepository.save(company)

      return {
        status_code: HttpStatus.OK,
        result: 'success',
        details: {
          company: updated,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
