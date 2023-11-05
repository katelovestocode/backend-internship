import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Company } from './entities/company.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserService } from 'src/user/user.service'

@Injectable()
export class CompanyService {
  constructor(
    private userService: UserService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async createCompany(createCompanyDto: CreateCompanyDto, user: any) {
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
      }
    }
  }

  async getAllCompanies() {
     return {
      status_code: HttpStatus.OK,
      result: 'success',
      details: {
        companies: await this.companyRepository.find(),
      },
    }
  }

  async getOneCompany(id: number) {
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
  }

  async updateCompany(id: number, updateCompanyDto: UpdateCompanyDto) {
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
  
  }

  async removeCompany(id: number) {
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
  }
}
