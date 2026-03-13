import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles, Role } from 'src/common/decorators/roles.decorator';

@Controller('sprints')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Post()
  @Roles(Role.Admin, Role.Manager)
  create(@Body() dto: CreateSprintDto) {
    return this.sprintsService.create(dto);
  }

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    if (projectId) {
      return this.sprintsService.findByProjectId(projectId);
    }
    return this.sprintsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sprintsService.findOne(id);
  }

  @Get(':id/progress')
  getProgress(@Param('id', ParseUUIDPipe) id: string) {
    return this.sprintsService.getProgress(id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Manager)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSprintDto) {
    return this.sprintsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Manager)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sprintsService.remove(id);
  }
}
