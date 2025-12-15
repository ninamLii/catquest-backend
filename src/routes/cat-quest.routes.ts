import { Router } from "express";
import { mapCat } from "../helper/mapCats";
import type { WizardResult } from "../types/catQuest";

const router = Router();

function countDifferences(cat: any, answers: WizardResult): number {
  let differences = 0;
  const keysOfAnswers = Object.keys(answers) as (keyof WizardResult)[];
  // usefull for debugging
  const differencesLog: string[] = [];

  for (const key of keysOfAnswers) {
    switch (key) {
      case "hyperallergenic":
        if (cat.hypoallergenic !== answers.hyperallergenic) {
          differences++, differencesLog.push("hyperallergenic");
        }
        break;
      case "welfare":
        if (answers.welfare === 0) continue;
        const catLifeSpanSplit = cat.life_span.split(" - ");
        const catMinLifeSpan = parseInt(catLifeSpanSplit[0]);
        let shortlegs = 1;
        let suppresedTail = 1;
        let maxHealthIssues = 5;
        let lifeSpanMin = 1;
        if (answers.welfare === 1) {
          shortlegs = 0;
        } else if (answers.welfare === 2) {
          shortlegs = 0;
          suppresedTail = 0;
        }
        if (answers.welfare === 3) {
          shortlegs = 0;
          suppresedTail = 0;
          maxHealthIssues = 4;
        }
        if (answers.welfare === 4) {
          shortlegs = 0;
          suppresedTail = 0;
          maxHealthIssues = 2;
          lifeSpanMin = 9;
        }
        if (
          catMinLifeSpan < lifeSpanMin ||
          cat.short_legs !== shortlegs ||
          cat.suppresed_tail !== suppresedTail ||
          cat.health_issues > maxHealthIssues
        ) {
          differences++;
          differencesLog.push("welfare");
        }
        break;
      case "socialNeeds":
        if (cat.social_needs !== answers.socialNeeds) {
          differences++;
          differencesLog.push("socialNeeds");
        }

        break;
      case "activityLevel":
        if (cat.activity_level !== answers.activityLevel) {
          differences++;
          differencesLog.push("activityLevel");
        }
        break;
      case "garden":
        if (answers.garden === 0 && cat.indoors !== 1) {
          differences++;
          differencesLog.push("garden");
        }
        break;
      case "familyFriendly":
        if (cat.child_friendly !== answers.familyFriendly) {
          differences++;
          differencesLog.push("familyFriendly");
        }

        break;
      case "dogFriendly":
        if (cat.dog_friendly === 0 && answers.dogFriendly == 1) {
          differences++;
          differencesLog.push("dogFriendly");
        }
        break;
      case "affectionate":
        if (cat.affectionate !== answers.affectionate) {
          differences++;
          differencesLog.push("affectionate");
        }
        break;
      case "strangerFriendly":
        if (cat.stranger_friendly !== answers.strangerFriendly) {
          differences++;
          differencesLog.push("strangerFriendly");
        }
        break;
      case "sheddingLevel":
        if (
          answers.sheddingLevel === 0 &&
          cat.shedding_level !== 0 &&
          cat.hairless !== 0
        ) {
          differencesLog.push("sheddingLevel differente 1");
          differences++;
        } else if (
          answers.sheddingLevel === 3 &&
          cat.shedding_level > 3 &&
          cat.hairless !== 0
        ) {
          differencesLog.push("sheddingLevel differente 2");
          differences++;
        } else if (
          answers.sheddingLevel === 5 &&
          cat.shedding_level < 3 &&
          cat.hairless === 0
        ) {
          differencesLog.push("sheddingLevel differente 3");
          differences++;
        }
        differencesLog.push("sheddingLevel differente 00");
        break;
      case "annoyingPotential":
        if (
          cat.vocalisation !== answers.annoyingPotential &&
          cat.intelligence !== answers.annoyingPotential
        )
          differences++;
        break;
      default:
        break;
    }
  }

  console.log("differences", differences, "cat", cat.name);

  return differences;
}

router.post("/", async (req, res) => {
  const answers = req.body as WizardResult;

  if (!answers) {
    return res.status(400).json({ error: "Missing answers" });
  }
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
    const result = {
      perfectHit: [] as any[],
      oneDifference: [] as any[],
      twoDifferences: [] as any[],
      threeDifferences: [] as any[],
      moreThanThree: [] as any[],
    };

    for (const cat of cats) {
      const mappedCat = mapCat(cat);
      const differences = countDifferences(mappedCat, answers);

      if (differences === 0) result.perfectHit.push(mappedCat);
      else if (differences === 1) result.oneDifference.push(mappedCat);
      else if (differences === 2) result.twoDifferences.push(mappedCat);
      else if (differences === 3) result.threeDifferences.push(mappedCat);
      else result.moreThanThree.push(mappedCat);
    }
    return res.json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error occurred while fetching cat data." });
  }
});

export default router;
