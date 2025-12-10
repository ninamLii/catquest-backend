import { Router } from "express";

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

    const mapped = paginated.map((cat: any) => ({
      id: cat.id,
      image: cat.image?.url || null,
      name: cat.name,
      description: cat.description,
      weight: cat.weight.metric,
      life_span: cat.life_span,
      sheeding: cat.shedding_level,
      child_friendly: cat.child_friendly,
      stranger_friendly: cat.stranger_friendly,
      dog_friendly: cat.dog_friendly,
      playfulness: cat.energy_level,
      intelligence: cat.intelligence,
      temperament: cat.temperament,
      indoors: cat.indoor,
      grooming: cat.grooming,
    }));
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
    const mapped = paginated.map((cat: any) => ({
      id: cat.id,
      image: cat.image?.url || null,
      name: cat.name,
      description: cat.description,
      weight: cat.weight.metric,
      life_span: cat.life_span,
      sheeding: cat.shedding_level,
      child_friendly: cat.child_friendly,
      stranger_friendly: cat.stranger_friendly,
      dog_friendly: cat.dog_friendly,
      playfulness: cat.energy_level,
      intelligence: cat.intelligence,
      temperament: cat.temperament,
      indoors: cat.indoor,
      grooming: cat.grooming,
    }));
    return res.json({ page, limit, total, totalPages, cats: mapped });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error occurred while fetching cat data." });
  }
});

export default router;
