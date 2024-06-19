import {
  Controller,
  FileTypeValidator,
  Get,
  Header,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'application/octet-stream' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.auditService.create({ file });
  }

  @Post('/:id')
  async remove(@Param('id') id: number) {
    return this.auditService.confirm(id);
  }

  @Get('/export/:id')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename=audit.csv')
  async exportToCsv(@Param('id') id: number) {
    return this.auditService.exportToCsv(id);
  }
}
