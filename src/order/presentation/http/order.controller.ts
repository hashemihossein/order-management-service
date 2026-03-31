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

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor() {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Place a new exchange order' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  async placeOrder(@Body() dto: PlaceOrderDto) {}

  @Get()
  @ApiOperation({
    summary: 'Get orders by userId (with optional status filter)',
  })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  async getOrders(@Query() query: GetOrdersQueryDto) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by ID' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async getOrderById(@Param('id') id: string) {}

  @Patch(':id/execute')
  @ApiOperation({ summary: 'Mark a PENDING order as EXECUTED' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async executeOrder(@Param('id') id: string) {}

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a PENDING order' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async cancelOrder(@Param('id') id: string) {}
}
