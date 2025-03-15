import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AddPermissionDto } from './dto/add-permission.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(@Query('onlyActive') onlyActive: string) {
    return this.rolesService.findAll({ onlyActive: onlyActive === 'true' });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('onlyActive') onlyActive: string) {
    return this.rolesService.findOne(+id, { onlyActive: onlyActive === 'true' });
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.delete(+id);
  }

  @Post(':id/permissions')
  addPermission(@Param('id') id: string, @Body() addPermissionDto: AddPermissionDto) {
    return this.rolesService.addPermission(+id, addPermissionDto);
  }

  @Delete(':roleId/permissions/:permissionId')
  @HttpCode(204)
  removePermission(@Param('roleId') roleId: string, @Param('permissionId') permissionId: string) {
    return this.rolesService.removePermission(+roleId, +permissionId);
  } 
}