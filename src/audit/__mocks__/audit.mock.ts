import { CreateAuditDto } from '../dtos/create-audit.dto';
import { Audit } from '../entities/audit.entity';

export const auditMock: Audit = {
  id: 1,
  confirmed: false,
  created_at: new Date(),
  updated_at: new Date(),
};

export const fileContentMock =
  'Kathryne Lockma0051      845 Fahey Summit East Dillon11626761422000000000007638220230321\r\n';
export const invalidFileContentMock =
  'Kathryne Lockma0051\uFFFD\u0000      845 Fahey Summit East Dillon1162676\uFFFD\u00001422000000000007638220230321\r\n';

export const uploadFileMock: CreateAuditDto = {
  file: {
    buffer: Buffer.from(fileContentMock, 'utf-8'),
    fieldname: '',
    originalname: '',
    encoding: '',
    mimetype: '',
    size: 0,
    stream: null,
    destination: '',
    filename: '',
    path: '',
  },
};

export const uploadInvalidFileContentMock: CreateAuditDto = {
  file: {
    buffer: Buffer.from(invalidFileContentMock, 'utf-8'),
    fieldname: '',
    originalname: '',
    encoding: '',
    mimetype: '',
    size: 0,
    stream: null,
    destination: '',
    filename: '',
    path: '',
  },
};
