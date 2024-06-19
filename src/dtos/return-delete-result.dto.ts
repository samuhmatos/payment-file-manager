import { DeleteResult } from 'typeorm';

export class ReturnDeleteResultDto {
  message: string;

  constructor(deleteResult: DeleteResult) {
    if (deleteResult.affected >= 1) {
      this.message = 'Apagado com sucesso';
    } else {
      this.message = 'Erro ao apagar. Tente novamente mais tarde!';
    }
  }
}
