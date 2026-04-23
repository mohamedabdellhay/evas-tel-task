/**
 *
 * ######################################################################################
 * ##### This file was generated using AI for test the application "mohamedabdellhay". ########
 * ######################################################################################
 *
 * Database Seeder
 *
 * Seeds the database with:
 *  - 1 admin user
 *  - 5 staff members (cashiers/waiters)
 *  - 10 menu items
 *  - 100 orders distributed across staff, from the last 30 days
 *
 * Run with: pnpm run seed
 */

import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { MongooseModule, InjectModel, getModelToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import mongoose, { Model } from 'mongoose';
import { User, UserSchema } from '../../users/schemas/user.schema';
import { MenuItem, MenuItemSchema } from '../../menu/schemas/menu-item.schema';
import { Order, OrderSchema } from '../../orders/schemas/order.schema';
import {
  Restaurant,
  RestaurantSchema,
} from '../../restaurants/schemas/restaurant.schema';

function resolveSeederMongoUri(config: ConfigService): string {
  const seederOverride = config.get<string>('MONGO_URI_SEED');
  if (seederOverride) return seederOverride;

  const mongoUri = config.get<string>('MONGO_URI');
  if (!mongoUri) {
    throw new Error('Missing MONGO_URI (or MONGO_URI_SEED) for seeder.');
  }

  let resolvedUri = mongoUri;
  const dbName = config.get<string>('DB_NAME');
  if (dbName && resolvedUri.includes('${DB_NAME}')) {
    resolvedUri = resolvedUri.replace('${DB_NAME}', dbName);
  }

  return resolvedUri;
}

// ─── Lightweight seeder module (no guards, no cache, no Redis needed) ─────────
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: resolveSeederMongoUri(config),
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MenuItem.name, schema: MenuItemSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
})
class SeederModule {}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number): Date {
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - daysAgo);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const RESTAURANTS_DATA = [
  { name: 'Abo tarek', location: 'Giza', capacity: 500 },
  { name: 'Sara Ali', location: 'Cairo', capacity: 500 },
  { name: 'Mohamed Tarek', location: 'Alexandria', capacity: 500 },
  { name: 'Yasmine Omar', location: 'Luxor', capacity: 500 },
  { name: 'Karim Ibrahim', location: 'Aswan', capacity: 500 },
];

const STAFF_DATA = [
  { fullName: 'Ahmed Hassan', email: 'ahmed@restaurant.com', role: 'cashier' },
  { fullName: 'Sara Ali', email: 'sara@restaurant.com', role: 'cashier' },
  {
    fullName: 'Mohamed Tarek',
    email: 'mohamed@restaurant.com',
    role: 'cashier',
  },
  {
    fullName: 'Yasmine Omar',
    email: 'yasmine@restaurant.com',
    role: 'cashier',
  },
  { fullName: 'Karim Ibrahim', email: 'karim@restaurant.com', role: 'cashier' },
];

const MENU_DATA = [
  { name: 'koshary', price: 40, category: 'egyptian food' },
  { name: 'pasta', price: 50, category: 'pasta' },
  { name: 'fries', price: 10, category: 'starter' },
  { name: 'meat', price: 100, category: 'main course' },
  { name: 'land', price: 100, category: 'main course' },
  { name: 'rice', price: 15, category: 'main course' },
  { name: 'ice cream', price: 30, category: 'dessert' },
  { name: 'bread', price: 5, category: 'starter' },
  { name: 'juice', price: 10, category: 'Beverages' },
  { name: 'cake', price: 20, category: 'Dessert' },
];

// ─── Main seeder function ─────────────────────────────────────────────────────

async function seed() {
  const app = await NestFactory.createApplicationContext(SeederModule, {
    logger: ['error', 'warn'],
  });

  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const menuModel = app.get<Model<MenuItem>>(getModelToken(MenuItem.name));
  const orderModel = app.get<Model<Order>>(getModelToken(Order.name));
  const restaurantModel = app.get<Model<Restaurant>>(
    getModelToken(Restaurant.name),
  );

  // ── Clear collections ──────────────────────────────────────────────────────
  console.log('Clearing existing seed data...');
  await userModel.deleteMany({ role: { $in: ['cashier'] } });
  await menuModel.deleteMany({});
  await orderModel.deleteMany({});
  await restaurantModel.deleteMany({});

  // ── Seed admin ─────────────────────────────────────────────────────────────
  console.log('Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  try {
    await userModel.create({
      fullName: 'Mohamed',
      email: 'mohamed@mail.com',
      password: adminPassword,
      role: 'admin',
    });
  } catch (error) {
    console.log(error);
  }

  // ── Seed restaurants ─────────────────────────────────────────────────────────────
  try {
    console.log('Creating 5 restaurants...');
    const restaurantsDocs = await restaurantModel.insertMany(RESTAURANTS_DATA);
  } catch (error) {
    console.log(error);
  }

  // ── Seed staff ─────────────────────────────────────────────────────────────
  console.log('Creating 5 staff members...');
  const password = await bcrypt.hash('password123', 10);
  const staffDocs = await userModel.insertMany(
    STAFF_DATA.map((s) => ({ ...s, password })),
  );

  // ── Seed menu items ────────────────────────────────────────────────────────
  console.log('Creating 10 menu items...');
  const menuDocs = await menuModel.insertMany(MENU_DATA);

  // ── Seed 100 orders ────────────────────────────────────────────────────────
  console.log('Creating 100 orders...');
  const orders: any[] = [];

  for (let i = 0; i < 100; i++) {
    const waiter = pick(staffDocs);
    const itemCount = randomBetween(1, 4);
    const items: any[] = [];
    let total = 0;

    const pickedMenuItems = new Set<string>();
    while (items.length < itemCount) {
      const menuItem = pick(menuDocs);
      const id = menuItem._id.toString();
      if (pickedMenuItems.has(id)) continue; // avoid duplicate items per order
      pickedMenuItems.add(id);

      const qty = randomBetween(1, 3);
      items.push({
        menuItemId: menuItem._id,
        quantity: qty,
        price: menuItem.price,
      });
      total += menuItem.price * qty;
    }

    orders.push({
      waiterId: waiter._id,
      items,
      totalAmount: parseFloat(total.toFixed(2)),
      createdAt: randomDate(30), // spread across last 30 days
    });
  }

  await orderModel.insertMany(orders);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n Seeding complete!');
  console.log('─'.repeat(40));
  console.log(`Admin:      mohamed@mail.com / admin123`);
  console.log(`Staff:      ${staffDocs.length} cashiers created`);
  console.log(`Menu items: ${menuDocs.length} items`);
  console.log(`Orders:     ${orders.length} orders seeded`);
  console.log('─'.repeat(40));
  console.log('\nYou Can see Full documentaion at http://localhost:3000/docs');

  await app.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
