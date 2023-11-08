import { IsNotEmpty, IsNumber } from 'class-validator'

export class JoinRequestDto {
  @IsNotEmpty()
  @IsNumber()
  companyId: number
}
