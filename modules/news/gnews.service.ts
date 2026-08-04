import { GNewsItem } from "./news.types";

const API_KEY = process.env.GNEWS_API_KEY!;
const BASE_URL = "https://gnews.io/api/v4";

function generateId(url: string): string {
  let hash = 0;

  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash).toString();
}

async function isValidImage(url?: string): Promise<boolean> {
  if (!url) return false;

  try {
    const res = await fetch(url, {
      method: "HEAD",
      next: {
        revalidate: 86400,
      },
    });

    const contentType = res.headers.get("content-type");

    return (
      res.ok &&
      !!contentType &&
      contentType.startsWith("image/")
    );
  } catch {
    return false;
  }
}

export async function getTopTechNews(
  limit = 10
): Promise<GNewsItem[]> {

  const res = await fetch(
    `${BASE_URL}/top-headlines?category=technology&lang=en&max=${limit}&apikey=${API_KEY}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch GNews");
  }

  const data = await res.json();


  const articles = await Promise.all(
    data.articles.map(async (article: any) => {

      const imageValid = await isValidImage(article.image);

      if (!imageValid) {
        return null;
      }

      return {
        id: article.id || generateId(article.url),
        title: article.title,
        description: article.description ?? "",
        content: article.content ?? "",
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        lang: article.lang,
        source: article.source,
      };
    })
  );


  return articles.filter(Boolean) as GNewsItem[];
}

export async function getNewsById(id: string) {
  const news = await getTopTechNews(20);

  return news.find(item => item.id === id) ?? null;
}

export async function getRelatedNews(
  id: string,
  limit = 4
) {
  const news = await getTopTechNews(10);

  return news
    .filter(item => item.id !== id)
    .slice(0, limit);
}