import { JwtAuthGuard } from '@app/common';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() order: CreateOrderDto, @Req() req: any) {
    return await this.ordersService.createOrder(
      order,
      req.cookies?.Authentication,
    );
  }

  @Get()
  async getOrders() {
    return await this.ordersService.getOrders();
  }
}
