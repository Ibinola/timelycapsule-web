import { Controller, Get, Param, Query } from '@nestjs/common';
import { CapsulesService } from './capsules.service';

@Controller('api/capsules')
export class CapsulesController {
  constructor(private readonly capsulesService: CapsulesService) {}

  @Get()
  findAll(@Query('userId') userId: string) {
    if (!userId) {
      // For demo purposes, we can use a default user ID
      userId = 'demo-user-id';
    }
    return this.capsulesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    if (!userId) {
      // For demo purposes, we can use a default user ID
      userId = 'demo-user-id';
    }
    return this.capsulesService.findOne(id, userId);
  }
}
