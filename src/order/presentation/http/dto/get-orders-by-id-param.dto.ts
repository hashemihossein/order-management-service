import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdParamDto {
  @ApiProperty({ example: 'f61c84e8-441b-450e-86a8-7cd757a3ec53' })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
