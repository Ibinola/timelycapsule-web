import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { CapsulesService } from './capsules.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assumes standard Guard location

@Controller('api/capsules')
@UseGuards(JwtAuthGuard)
export class CapsulesController {
  constructor(private readonly capsulesService: CapsulesService) {}

  @Get()
  findAll(@Request() req) {
    // req.user.userId comes from JWT strategy
    return this.capsulesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.capsulesService.findOne(id, req.user.userId);
  }
}
