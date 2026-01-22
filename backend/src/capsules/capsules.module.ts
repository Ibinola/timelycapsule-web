import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapsulesService } from './capsules.service';
import { CapsulesController } from './capsules.controller';
import { Capsule } from './entities/capsule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Capsule])],
  controllers: [CapsulesController],
  providers: [CapsulesService],
})
export class CapsulesModule {}
