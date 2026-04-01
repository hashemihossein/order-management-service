export class PlaceOrderCommand {
  constructor(
    readonly userId: string,
    readonly originToken: string,
    readonly destinationToken: string,
    readonly amount: number,
  ) {}
}
