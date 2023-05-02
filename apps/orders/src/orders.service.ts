import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from './constants/services';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async createOrder(orderDto: CreateOrderDto, authentication: string) {
    const session = await this.ordersRepository.startTransaction(); //mongodb transaction feature
    try {
      const order = await this.ordersRepository.create(orderDto, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          orderDto,
          Authentication: authentication,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    }
  }

  async getOrders() {
    return this.ordersRepository.find({});
  }
}
