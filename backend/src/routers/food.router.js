import { Router } from 'express';
import { FoodModel } from '../models/food.model.js';
import handler from 'express-async-handler';

const router = Router();
router.get(
  '/',
  handler(async (req, res) => {
    const foods = await FoodModel.find({});
    res.send(foods);
  })
);

router.get(
  '/tags',
  handler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: '$tags',
      },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: '$count',
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: 'All',
      count: await FoodModel.countDocuments(),
    };

    tags.unshift(all);

    res.send(tags);
  })
);

router.get(
  '/search/:searchTerm',
  handler(async (req, res) => {
    const { searchTerm } = req.params;
    const searchRegex = new RegExp(searchTerm, 'i');

    const foods = await FoodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  })
);

router.get(
  '/tag/:tag',
  handler(async (req, res) => {
    const { tag } = req.params;
    const foods = await FoodModel.find({ tags: tag });
    res.send(foods);
  })
);

router.get(
  '/:foodId',
  handler(async (req, res) => {
    const { foodId } = req.params;
    try {
      const food = await FoodModel.findById(foodId);
      if (!food) {
        return res.status(404).json({ error: 'Food not found' });
      }
      res.send(food);
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid foodId' });
      }
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })
);

export default router;