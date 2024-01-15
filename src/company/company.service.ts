import {
  ForbiddenException,
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
        result: 'Company successfully has been created',
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
        result: 'Successfully retrieved all companies',
        details: {
          companies: await this.companyRepository.find({
            relations: ['owner', 'members', 'admins'],
          }),
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getOneCompany(id: number): Promise<CompanyResponse> {
    try {
      const oneCompany = await this.companyRepository.findOne({
        where: { id },
        relations: ['owner', 'members', 'admins'],
      })

      if (!oneCompany) {
        throw new NotFoundException('Company do not exist!')
      }

      return {
        status_code: HttpStatus.OK,
        result: 'Successfully retrieved one company',
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
        result: 'Successfully updated company information',
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
      const company = await this.companyRepository.findOne({
        where: { id },
        relations: ['owner'],
      })

      if (!company) {
        throw new NotFoundException('Company do not exist!')
      }

      await this.companyRepository.delete(id)

      return {
        status_code: HttpStatus.OK,
        result: 'Successfully removed the company',
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
        where: { id: companyId },
        relations: ['owner', 'members', 'admins'],
      })

      if (!company) {
        throw new NotFoundException('Company is not found')
      }

      const userToRemove = company.members.find((user) => user.id === userId)

      if (!userToRemove) {
        throw new NotFoundException(
          'User is not found in the company members list',
        )
      }

      company.members = company.members.filter((user) => user.id !== userId)
      company.admins = company.admins.filter((admin) => admin.id !== userId)
      const updated = await this.companyRepository.save(company)

      return {
        status_code: HttpStatus.OK,
        result: 'Companys owner successfully removed the user',
        details: {
          company: updated,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // company owner makes a user an admin or cancel admin status
  //{"isAdmin": true }
  async toggleAdminStatus(
    companyId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<CompanyResponse> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
        relations: ['owner', 'members', 'admins'],
      })

      if (!company) {
        throw new NotFoundException('Company is not found')
      }

      const user = company.members.find((member) => member.id === userId)

      if (!user) {
        throw new NotFoundException(
          'User is not found as a member of the company',
        )
      }

      const alreadyAnAdmin = company.admins.some((admin) => admin.id === userId)

      if (isAdmin) {
        if (alreadyAnAdmin) {
          throw new ForbiddenException('User is already an Admin')
        }
        company.admins.push(user)
      } else {
        company.admins = company.admins.filter((admin) => admin.id !== userId)
      }

      const updatedCompany = await this.companyRepository.save(company)

      return {
        status_code: HttpStatus.OK,
        result: 'Admin status is successfully updated',
        details: {
          company: updatedCompany,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  //company owner gets all company's admins
  async getCompanyAdmins(companyId: number): Promise<CompanyResponse> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
        relations: ['admins'],
      })

      if (!company) {
        throw new NotFoundException('Company is not found')
      }

      return {
        status_code: HttpStatus.OK,
        result: "Successfully retrieved company's admins",
        details: {
          company: company,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
