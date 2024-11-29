import {
  Repository,
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
} from 'typeorm';
import { FilterDto } from './filter.dto';
import { SortOrder } from './sort-order-enum';

export class PageService {
  protected createOrderQuery(filter: FilterDto) {
    const order: any = {};

    if (filter.orderBy) {
      order[filter.orderBy] = filter.sortOrder;
      return order;
    }

    order.id = SortOrder.DESC;
    return order;
  }

  protected paginate<T>(
    repository: Repository<T>,
    filter: FilterDto,
    where: FindOptionsWhere<T>,
    select?: FindOptionsSelect<T>,
    relations?: FindOptionsRelations<T>,
  ) {
    return repository.findAndCount({
      order: this.createOrderQuery(filter),
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
      where: where,
      select: select,
      relations: relations,
    });
  }
}
