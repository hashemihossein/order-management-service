import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlaceOrderDto, OrderResponseDto, GetOrdersQueryDto } from './dto';
import { OrderService } from 'src/order/application/order.service';
import { IdParamDto } from './dto/get-orders-by-id-param.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Place a new exchange order' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  async placeOrder(@Body() dto: PlaceOrderDto) {
    return this.orderService.placeOrder(
      dto.userId,
      dto.originToken,
      dto.destinationToken,
      dto.amount,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get orders by userId (with optional status filter)',
  })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  async getOrders(@Query() query: GetOrdersQueryDto) {
    return this.orderService.getOrders(query.userId, query.status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by ID' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async getOrderById(@Param() param: IdParamDto) {
    return this.orderService.getOrderById(param.id);
  }

  @Patch(':id/execute')
  @ApiOperation({ summary: 'Mark a PENDING order as EXECUTED' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async executeOrder(@Param('id') id: string) {}

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a PENDING order' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async cancelOrder(@Param('id') id: string) {}
}
