import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('restaurants')
@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Roles('admin', 'owner', 'user')
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'The restaurant has been successfully created.' })
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  @Roles('admin', 'owner', 'cashier')
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiResponse({ status: 200, description: 'Return all restaurants.' })
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'owner', 'cashier')
  @ApiOperation({ summary: 'Get a restaurant by id' })
  @ApiParam({ name: 'id', description: 'The ID of the restaurant' })
  @ApiResponse({ status: 200, description: 'Return the restaurant.' })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Get(':id/availability')
  @Roles('admin', 'owner', 'cashier')
  @ApiOperation({ summary: 'Get restaurant availability (Redis cached, 60s TTL)' })
  @ApiParam({ name: 'id', description: 'The ID of the restaurant' })
  @ApiResponse({ status: 200, description: 'Returns cached availability' })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  async getAvailability(@Param('id') id: string) {
    return this.restaurantsService.getAvailability(id);
  }

  @Patch(':id')
  @Roles('admin', 'owner')
  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiParam({ name: 'id', description: 'The ID of the restaurant' })
  @ApiResponse({ status: 200, description: 'The restaurant has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @Roles('admin', 'owner')
  @ApiOperation({ summary: 'Delete a restaurant' })
  @ApiParam({ name: 'id', description: 'The ID of the restaurant' })
  @ApiResponse({ status: 200, description: 'The restaurant has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }
}
