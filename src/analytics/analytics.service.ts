import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { MenuItem, MenuItemDocument } from '../menu/schemas/menu-item.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItemDocument>,
  ) {}

  async getTopPerformers(limit = 10) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.orderModel.aggregate([
      // Step 1: Filter by date
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },

      // Step 2: Unwind items
      { $unwind: '$items' },

      // Step 3: Revenue + count per waiter×dish
      {
        $group: {
          _id: { waiterId: '$waiterId', menuItemId: '$items.menuItemId' },
          dishRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          dishCount: { $sum: '$items.quantity' },
        },
      },

      // Step 4: Roll up per waiter 
      {
        $group: {
          _id: '$_id.waiterId',
          totalRevenue: { $sum: '$dishRevenue' },
          top3Dishes: {
            $topN: {
              n: 3,
              sortBy: { dishCount: -1 },
              output: { menuItemId: '$_id.menuItemId', orderCount: '$dishCount' },
            },
          },
        },
      },

      // Step 5: Sort by revenue and LIMIT EARLY
      { $sort: { totalRevenue: -1 } },
      { $limit: limit },

      // Step 6: Fetch only the fields we actually use from users
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 0, fullName: 1, email: 1 } }],
          as: 'waiterInfo',
        },
      },
      { $unwind: '$waiterInfo' },

      // Step 7: Fetch only dish names for the 3 menuItemIds we already have
      {
        $lookup: {
          from: 'menuitems',
          localField: 'top3Dishes.menuItemId',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, name: 1 } }],
          as: 'dishDetails',
        },
      },

      // Step 8: Convert dishDetails array 
      {
        $project: {
          _id: 0,
          waiterId: '$_id',
          waiterName: '$waiterInfo.fullName',
          waiterEmail: '$waiterInfo.email',
          totalRevenue: { $round: ['$totalRevenue', 2] },
          signatureDishes: {
            $let: {
              vars: {
                // Build { "<id>": "<name>", ... } 
                nameMap: {
                  $arrayToObject: {
                    $map: {
                      input: '$dishDetails',
                      as: 'd',
                      in: { k: { $toString: '$$d._id' }, v: '$$d.name' },
                    },
                  },
                },
              },
              in: {
                $map: {
                  input: '$top3Dishes',
                  as: 'dish',
                  in: {
                    name: {
                      $getField: {
                        field: { $toString: '$$dish.menuItemId' },
                        input: '$$nameMap',
                      },
                    },
                    orderCount: '$$dish.orderCount',
                  },
                },
              },
            },
          },
        },
      },
    ]);
  }
}