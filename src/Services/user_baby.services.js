import AppError from "../Errors/App.error.js";
import { sql } from "@vercel/postgres";

export const associateUserBabyService = async (userId, babyId) => {
  const insertUserBabyQuery = sql`
    INSERT INTO "user_baby" (user_id, baby_id)
    VALUES (${userId}, ${babyId})
    ON CONFLICT DO NOTHING;
  `;
  await insertUserBabyQuery;

  const updateBabyQuery = sql`
    UPDATE "baby" SET user_id = ${userId}
    WHERE id = ${babyId};
  `;
  await updateBabyQuery;

  const babyQuery = sql`
    SELECT * FROM "baby" WHERE id = ${babyId};
  `;
  const babyResult = await babyQuery;

  if (babyResult.rows.length === 0) {
    throw new AppError("Baby not found.");
  }

  return babyResult.rows[0];
};

export const listBabyIdForUserService = async (userId) => {
  try {
    const query = sql`
      SELECT baby_id FROM "user_baby" WHERE user_id = ${userId};
    `;
    const result = await query;

    if (result.rows.length === 0) {
      throw new AppError("Baby not found for the given user.");
    }

    return result.rows[0].baby_id;
  } catch (error) {
    throw new AppError("Error getting baby for user:", error);
  }
};

export const disassociateUserBabyService = async (userId, babyId) => {
  const query = sql`
    DELETE FROM "user_baby" WHERE user_id = ${userId} AND baby_id = ${babyId};
  `;
  await query;
};
