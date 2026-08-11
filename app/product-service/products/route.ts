import { ProductController } from '@/controllers/productController';

export async function GET(request: Request) {
  return ProductController.getAllProducts(request);
}
