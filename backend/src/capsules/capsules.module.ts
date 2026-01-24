import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapsulesService } from './capsules.service';
import { CapsulesController } from './capsules.controller';
import { Capsule } from './entities/capsule.entity';
import { CapsuleUtilsService } from './capsule-utils.service';

@Module({
  imports: [TypeOrmModule.forFeature([Capsule])],
  controllers: [CapsulesController],
  providers: [CapsulesService, CapsuleUtilsService],
})
export class CapsulesModule {}
