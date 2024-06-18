/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv {
    QUEUE_HOST: string;
    QUEUE_PORT: string;
    QUEUE_PASSWORD: string;

    DB_USER: string;
    DB_PORT: string;
    DB_HOST: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
  }
}
