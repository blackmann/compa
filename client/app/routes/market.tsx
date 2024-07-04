import type { User } from '@prisma/client'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { prisma } from '~/lib/prisma.server'
import { checkAuth } from '~/lib/check-auth'
import { values } from '~/lib/values.server'
import { useState, useEffect } from 'react'
import { useLoaderData, useRouteLoaderData, useFetcher, useSearchParams } from '@remix-run/react'
import { Anchor } from '~/components/anchor'
import { Input } from '~/components/input'
import { ProductItem } from '~/components/product-item'
import { Select } from '~/components/select'
import type { loader as rootLoader } from '~/root'


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let user: User | null = null;

  try {
    const userId = await checkAuth(request);
    user = await prisma.user.findFirst({ where: { id: userId } });
  } catch {
    // 
  }

  const sellerProfile = user
    ? await prisma.sellerProfile.findFirst({
        where: { userId: user.id },
      })
    : null;

  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const searchQuery = url.searchParams.get('query') || '';

  const categoryFilter = category && category !== 'all' ? { categoryId: parseInt(category, 10) } : {};

  const products = await prisma.product.findMany({
    where: {
      status: 'available',
      ...(searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery } },
              { description: { contains: searchQuery } },
            ],
          }
        : {}),
      ...categoryFilter,
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany();

  return json({ categories, school: values.meta(), products, sellerProfile });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const searchQuery = formData.get('query') as string || '';
  const category = formData.get('category') as string || undefined;

  const categoryFilter = category && category !== 'all' ? { categoryId: parseInt(category, 10) } : {};

  const products = await prisma.product.findMany({
    where: {
      status: 'available',
      ...(searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery } },
              { description: { contains: searchQuery } },
            ],
          }
        : {}),
      ...categoryFilter,
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return json(products);
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Marketplace | ${data?.school.shortName} ✽ compa` },
    {
      name: 'description',
      content: 'Looking for something to buy or sell? This is the place.'
    }
  ]
}


export default function Market() {
  const { categories, products: initialProducts, sellerProfile } = useLoaderData<typeof loader>();
  const { user } = useRouteLoaderData<typeof rootLoader>('root') || {};
  const [products, setProducts] = useState(initialProducts);
  const [params] = useSearchParams();
  const fetcher = useFetcher();
  const [searchQuery, setSearchQuery] = useState(params.get('query') || '');
  const [selectedCategory, setSelectedCategory] = useState(params.get('category') || 'all');
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'query') {
      setSearchQuery(value);
    } else if (name === 'category') {
      setSelectedCategory(value);
    }
  };

  useEffect(() => {
    const formData = new FormData();
    formData.set('query', searchQuery);
    formData.set('category', selectedCategory);
    fetcher.submit(formData, { method: 'post' });
    setSearchPerformed(true);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (fetcher.data) {
      setProducts(Array.isArray(fetcher.data) ? fetcher.data : initialProducts);
    }
  }, [fetcher.data, initialProducts]);

  return (
    <div className="container min-h-[60vh]">
      <header className="mb-2">
        <h1 className="font-bold text-xl">Marketplace</h1>

        <fetcher.Form className="flex items-start gap-2">
          <Input
            name="query"
            value={searchQuery}
            onChange={handleSearchChange}
            type="search"
            placeholder="Search product"
          />
          <Select
            name="category"
            value={selectedCategory}
            onChange={handleSearchChange}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </Select>
        </fetcher.Form>
      </header>

      {sellerProfile && (
        <div className="flex gap-2 mb-2">
          <Anchor to="/market/profile" variant="neutral">
            Edit profile
          </Anchor>

          <Anchor to={`/p/${user?.username}/catalog`} variant="neutral">
            View catalog
          </Anchor>

          <Anchor to="/market/add">Add Product</Anchor>
        </div>
      )}

      {!sellerProfile && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-2">
          <div className="col-span-1">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-neutral-800 border dark:border-neutral-700">
              <header className="font-bold">Have a product?</header>

              <div className="mb-2 text-secondary">
                Do you have anything to sell? You're welcome to upload any number of products (used or new) you have.
              </div>
              {user ? (
                <Anchor to="/market/profile">Create seller profile</Anchor>
              ) : (
                <Anchor to="/login">Log in first</Anchor>
              )}
            </div>
          </div>
        </div>
      )}

      {products.length === 0 && searchPerformed ? (
        <div className="text-center text-secondary">
          No items match "{searchQuery}" {selectedCategory !== 'all' && `in this category`}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div className="col-span-1" key={product.id}>
              <ProductItem product={product} />
            </div>
          ))}
        </div>
      )}

      {products.length === 0 && selectedCategory !== 'all' && !searchPerformed && (
        <div className="text-center text-secondary">
          No items in this category
        </div>
      )}
    </div>
  );
}
