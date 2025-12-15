import { Router } from "express";
import { mapCat } from "../helper/mapCats";

const router = Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 999;

  if (!process.env.CAT_API_KEY) {
    return res.status(500).json({ error: "No API KEY provided" });
  }
  try {
    const response = await fetch(`http://api.thecatapi.com/v1/breeds`, {
      headers: {
        "x-api-key": process.env.CAT_API_KEY,
      },
    });
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Something went wrong with the API request." });
    }
    const data = await response.json();
    const total = data.length;
    const totalPages = Math.ceil(total / limit);

    const start = (page - 1) * limit;
    const paginated = data.slice(start, start + limit);

    const mapped = paginated.map((cat: any) => mapCat(cat));
    return res.json({
      page,
      limit,
      total,
      totalPages,
      cats: mapped,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error occurred while fetching cat data." });
  }
});

router.get("/favourites", async (req, res) => {
  const idsParam = req.query.ids;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 999;
  if (!idsParam) {
    return res.status(400).json({ error: "No ids provided" });
  }
  const ids = (idsParam as string).split(",");

  if (!process.env.CAT_API_KEY) {
    return res.status(500).json({ error: "No API KEY provided" });
  }
  try {
    const response = await fetch(`http://api.thecatapi.com/v1/breeds`, {
      headers: {
        "x-api-key": process.env.CAT_API_KEY,
      },
    });
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Something went wrong with the API request." });
    }
    const data = await response.json();
    const total = data.length;
    const totalPages = Math.ceil(total / limit);

    const start = (page - 1) * limit;

    const filtered = data.filter((cat: any) => ids.includes(cat.id));
    const paginated = filtered.slice(start, start + limit);
    const mapped = paginated.map((cat: any) => mapCat(cat));
    return res.json({ page, limit, total, totalPages, cats: mapped });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error occurred while fetching cat data." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!process.env.CAT_API_KEY) {
    return res.status(500).json({ error: "No API KEY provided" });
  }
  try {
    const response = await fetch(`http://api.thecatapi.com/v1/breeds`, {
      headers: {
        "x-api-key": process.env.CAT_API_KEY,
      },
    });
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Something went wrong with the API request." });
    }
    const cats = await response.json();
    const cat = cats.find((c: any) => c.id === id);
    if (!cat) {
      return res.status(404).json({ error: "Cat not found" });
    }
    const mappedCat = mapCat(cat);
    return res.json({
      id: mappedCat.id,
      informations: mappedCat,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: "Error occurred while fetching cat data.",
      details: error.message,
    });
  }
});

export default router;
