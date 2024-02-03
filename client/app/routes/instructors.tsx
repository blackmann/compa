import { ActionFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/lib/prisma.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.json();

  await prisma.instructor.create({ data });

  return json({});
};
