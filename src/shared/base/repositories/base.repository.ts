import { ClsService, ClsStore } from 'nestjs-cls';
import { DeleteResult, Repository } from 'typeorm';
import { NotFoundError } from 'src/shared/error-handling/exceptions/not-found.error';

export abstract class BaseRepository<T> {
  constructor(
    protected readonly repository: Repository<T>
  ) { }

  protected async throwIfNotDeleted(result: DeleteResult): Promise<void> {
    if (result.affected === 0) {
      throw new NotFoundError();
    }
  }
}