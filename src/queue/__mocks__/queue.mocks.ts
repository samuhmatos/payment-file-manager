import { Job } from 'bull';
import { fileContentMock } from '../../upload/__mocks__/upload.mocks';
import { UploadJobData } from '../../upload/upload.processor';
import { JobStatus } from '../queue.service';

export const createQueueMock: UploadJobData = {
  fileContent: fileContentMock,
  upload_id: 1,
};

export const activeJobsMock: Job<UploadJobData>[] = [
  { data: { upload_id: 1 } },
] as Job<UploadJobData>[];

export const jobsMock: JobStatus = {
  activeJobs: activeJobsMock,
  waitingJobs: [],
};

export const emptyJobsMock: JobStatus = {
  activeJobs: [],
  waitingJobs: [],
};
