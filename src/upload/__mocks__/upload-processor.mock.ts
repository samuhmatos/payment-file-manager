import { Job } from 'bull';
import { UploadJobData } from '../upload.processor';
import { fileContentMock, uploadMock } from './upload.mocks';

export const createUploadProcessor: Job<UploadJobData> = {
  id: '1',
  data: {
    fileContent: fileContentMock,
    upload_id: uploadMock.id,
  },
} as Job<UploadJobData>;
