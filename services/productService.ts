import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export interface ProductFilters {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export class ProductService {
  static async getAllProducts(filters: ProductFilters) {
    const { search, category, page = 1, limit = 10 } = filters;

    // Build the query where clause
    const where: Prisma.ProductWhereInput = {
      active: true, // Only return active products
    };

    if (category) {
      where.category = {
        equals: category.trim(),
        mode: 'insensitive',
      };
    }

    if (search) {
      const searchTrimmed = search.trim();
      where.OR = [
        {
          name: {
            contains: searchTrimmed,
            mode: 'insensitive',
          },
        },
        {
          sku: {
            contains: searchTrimmed,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Pagination calculations
    const skip = (page - 1) * limit;
    const take = limit;

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: {
          id: 'asc', // Sort by ID ascending
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
    };
  }
}
