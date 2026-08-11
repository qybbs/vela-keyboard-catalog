import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ProductService } from '../services/productService';

// Schema for query parameters validation
const getProductsQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val >= 1, {
      message: 'Page must be a number greater than or equal to 1',
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => !isNaN(val) && val >= 1, {
      message: 'Limit must be a number greater than or equal to 1',
    }),
});

export class ProductController {
  static async getAllProducts(request: Request) {
    try {
      const { searchParams } = new URL(request.url);

      // Extract raw query string values
      const rawParams = {
        search: searchParams.get('search') || undefined,
        category: searchParams.get('category') || undefined,
        page: searchParams.get('page') || undefined,
        limit: searchParams.get('limit') || undefined,
      };

      // Validate inputs
      const validationResult = getProductsQuerySchema.safeParse(rawParams);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Bad Request',
            message: 'Invalid query parameters',
            details: validationResult.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const { search, category, page, limit } = validationResult.data;

      // Query products from service layer
      const { products, total } = await ProductService.getAllProducts({
        search,
        category,
        page,
        limit,
      });

      // Format response according to design requirements (must contain "content")
      return NextResponse.json({
        content: products,
        pageable: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error in ProductController.getAllProducts:', error);
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'An unexpected error occurred while fetching products',
        },
        { status: 500 }
      );
    }
  }
}
