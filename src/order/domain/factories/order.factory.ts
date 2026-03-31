import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Order } from '../order';
import { Token } from '../value-objects/token.vo';
import { Amount } from '../value-objects/amount.vo';

@Injectable()
export class OrderFactory {
  create(
    userId: string,
    originTokenRaw: string,
    destinationTokenRaw: string,
    amountRaw: number,
  ): Order {
    const originToken = new Token(originTokenRaw);
    const destinationToken = new Token(destinationTokenRaw);
    const amount = new Amount(amountRaw);

    if (originToken.value === destinationToken.value) {
      throw new Error('originToken and destinationToken must be different');
    }

    return new Order(
      uuidv4(),
      userId,
      originToken.value,
      destinationToken.value,
      amount.value,
    );
  }
}
