
import { connect, set } from 'mongoose';
import { UserModel } from '../models/user.model.js';
import { FoodModel } from '../models/food.model.js';
import { sample_users } from '../data.js';
import { sample_foods } from '../data.js';
import bcrypt from 'bcryptjs';

const PASSWORD_HASH_SALT_ROUNDS = 10;
set('strictQuery', true);

export const dbconnect = async () => {
  try {
    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    await seedUsers();
    await seedFoods();
    console.log('Connected to MongoDB and seeded data successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

async function seedUsers() {
  try {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      console.log('Users seed is already done!');
      return;
    }

    for (let user of sample_users) {
      user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
      await UserModel.create(user);
    }

    console.log('Users seed is done!');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

async function seedFoods() {
  try {
    const foodsCount = await FoodModel.countDocuments();
    if (foodsCount > 0) {
      console.log('Foods seed is already done!');
      return;
    }

    for (const food of sample_foods) {
      food.imageUrl = `/foods/${food.imageUrl}`;
      await FoodModel.create(food);
    }

    console.log('Foods seed is done!');
  } catch (error) {
    console.error('Error seeding foods:', error);
  }
}