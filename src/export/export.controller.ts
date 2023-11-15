import { Controller, Get, Param } from '@nestjs/common'
import { ExportService } from './export.service'

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('user/:userId')
  async exportUserQuizResults(@Param('userId') userId: string) {
    return this.exportService.exportUserQuizResults(+userId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exportService.findOne(+id)
  }
}
