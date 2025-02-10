import { db } from "./db.server";

export async function getAllPages() {
  return await db.page.findMany();
}

export async function getPageBySlug(slug: string) {
  return await db.page.findUnique({ where: { slug } });
}

export async function createPage(title: string, slug: string, content: string) {
  return await db.page.create({
    data: { title, slug, content },
  });
}

export async function updatePage(slug: string, content: string) {
  return await db.page.update({
    where: { slug },
    data: { content },
  });
}

export async function deletePage(slug: string) {
  return await db.page.delete({ where: { slug } });
}
