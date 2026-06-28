import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('pending-users')
  @ApiOperation({ summary: 'Get all users with pending access status' })
  @ApiResponse({ status: 200, description: 'Returns list of pending users' })
  async getPendingUsers() {
    return this.adminService.getPendingUsers();
  }

  @Get('all-users')
  @ApiOperation({ summary: 'Get all registered users' })
  @ApiResponse({ status: 200, description: 'Returns list of all users' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('approve/:id')
  @ApiOperation({ summary: 'Approve a user access request' })
  @ApiParam({ name: 'id', description: 'User ID to approve' })
  @ApiResponse({ status: 200, description: 'User approved successfully' })
  async approveUser(@Param('id') id: string) {
    return this.adminService.approveUser(id);
  }

  @Patch('reject/:id')
  @ApiOperation({ summary: 'Reject a user access request' })
  @ApiParam({ name: 'id', description: 'User ID to reject' })
  @ApiResponse({ status: 200, description: 'User rejected successfully' })
  async rejectUser(@Param('id') id: string) {
    return this.adminService.rejectUser(id);
  }
}
