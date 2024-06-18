import { fileContentMock } from '../../upload/__mocks__/upload.mocks';
import { UploadJobData } from '../../upload/upload.processor';

export const createQueueMock: UploadJobData = {
  fileContent: fileContentMock,
  upload_id: 1,
};
