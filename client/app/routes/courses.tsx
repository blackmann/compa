import { ActionFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/lib/prisma.server";
import { slugify } from "~/lib/slugify";

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.json();

  const { code, name } = data;

  await prisma.course.create({
    data: { code, name, slug: slugify(`${code} ${name}`) },
  });

  return json({});
};
