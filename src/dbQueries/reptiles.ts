import {
  creationDates,
  getCurrentDateTime,
  getReptilePartial,
} from "../helperFunctions";
import { isCreateReptileBody } from "../json_validation/request_body";
import { ReqBuilder } from "../middleware/auth_types";

// Create
export const createReptile: ReqBuilder =
  (client) =>
  async ({ body, jwtBody }, res) => {
    if (!isCreateReptileBody(body)) {
      return res
        .status(400)
        .json({ error: "Invalid parameters for creating Reptile" });
    }
    const userExists = await client.user.findFirst({
      where: { id: jwtBody?.userId },
    });
    if (!userExists) return res.json({ error: "User does not exist" });

    const reptile = await client.reptile.create({
      data: {
        ...body,
        userId: jwtBody!.userId,
        ...creationDates,
      },
    });
    res.json({ reptile });
  };

// Read
export const getReptiles: ReqBuilder = (client) => async (req, res) => {
  const reptiles = await client.reptile.findMany();
  res.json({ reptiles });
};

// Update
export const updateReptile: ReqBuilder = (client) => async (req, res) => {
  const reptileId = parseInt(req.params.id);
  const exists = await client.reptile.findFirst({
    where: { id: reptileId },
  });
  if (!exists) return res.status(404).json({});

  const reptilePartial = getReptilePartial(req.body);
  const updatedAt = getCurrentDateTime();
  const reptile = await client.reptile.update({
    where: {
      id: reptileId,
    },
    data: {
      ...reptilePartial,
      updatedAt,
    },
  });
  res.json({ reptile });
};

// Delete
export const deleteReptile: ReqBuilder =
  (client) =>
  async ({ params, jwtBody }, res) => {
    const reptileId = parseInt(params.id);
    if (!jwtBody?.userId) return res.status(401).json({ error: "Unauthorized" });
    const exists = await client.reptile.findFirst({
      where: { id: reptileId, userId: jwtBody.userId },
    });
    if (!exists) return res.status(404);

    await client.reptile.delete({
      where: { id: reptileId },
    });
    res.json({ message: `Deleted the reptile with id ${reptileId}` });
  };
