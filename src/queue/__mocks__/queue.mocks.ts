import { Job } from 'bull';
import { JobStatus } from '../queue.service';
import { UploadJobData } from '../../audit/audit.processor';
import { fileContentMock } from '../../audit/__mocks__/audit.mock';

export const createQueueMock: UploadJobData = {
  fileContent: fileContentMock,
  audit_id: 1,
};

export const activeJobsMock: Job<UploadJobData>[] = [
  { data: { audit_id: 1 } },
] as Job<UploadJobData>[];

export const jobsMock: JobStatus = {
  activeJobs: activeJobsMock,
  waitingJobs: [],
};

export const emptyJobsMock: JobStatus = {
  activeJobs: [],
  waitingJobs: [],
};
