import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Put,
} from '@nestjs/common'
import { CompanyService } from './company.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { AuthGuard } from '@nestjs/passport'
import { JwtPayload } from 'src/user/types/user.types'
import { CurrentUser } from 'src/user/decorators/currentUser'
import { CompanyValidGuard } from './guards/company-validation.guard'
import {
  AllCompaniesResponse,
  CompanyResponse,
  DeletedCompanyResponse,
} from './types/types'

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // create company
  @Post()
  @UseGuards(AuthGuard(['jwt', 'auth0']))
  @HttpCode(HttpStatus.CREATED)
  async createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<CompanyResponse> {
    return await this.companyService.createCompany(createCompanyDto, user)
  }

  // get all companies
  @Get()
  @UseGuards(AuthGuard(['jwt', 'auth0']))
  async findAllCompanies(): Promise<AllCompaniesResponse> {
    return await this.companyService.getAllCompanies()
  }

  // get company by id
  @Get(':id')
  @UseGuards(AuthGuard(['jwt', 'auth0']))
  async findOneCompany(@Param('id') id: string): Promise<CompanyResponse> {
    return await this.companyService.getOneCompany(+id)
  }

  // update company by id
  @Put(':id')
  @UseGuards(AuthGuard(['jwt', 'auth0']), CompanyValidGuard)
  async updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto
  ): Promise<CompanyResponse> {
    return await this.companyService.updateCompany(+id, updateCompanyDto)
  }

  // delete company
  @Delete(':id')
  @UseGuards(AuthGuard(['jwt', 'auth0']), CompanyValidGuard)
  async removeCompany(
    @Param('id') id: string,
  ): Promise<DeletedCompanyResponse> {
    return await this.companyService.removeCompany(+id)
  }
}
