import { PartialType } from '@nestjs/mapped-types';
import { CreateExportDto } from './create-export.dto';

export class UpdateExportDto extends PartialType(CreateExportDto) {}
