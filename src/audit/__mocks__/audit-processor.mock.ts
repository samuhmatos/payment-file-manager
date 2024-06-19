import { Job } from 'bull';
import { auditMock, fileContentMock } from './audit.mock';
import { UploadJobData } from '../audit.processor';

export const createUploadProcessor: Job<UploadJobData> = {
  id: '1',
  data: {
    fileContent: fileContentMock,
    audit_id: auditMock.id,
  },
} as Job<UploadJobData>;
