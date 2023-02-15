import { RequestHandler } from "express";
import { client } from "..";
import { getCurrentDateTime } from "../helperFunctions";
import { emptyScheduleDays } from "../types";
import { isCreateScheduleBody } from "../validationFunctions";
import { PrismaClient } from "@prisma/client";

// Create
export const createSchedule =
  (client: PrismaClient): RequestHandler =>
  async ({ body }, res) => {
    if (!isCreateScheduleBody(body)) {
      return res.status(400).json({ error: "Invalid user Input" });
    }
    const reptileExists = await client.reptile.findFirst({
      where: { id: body.reptileId },
    });
    const userExists = await client.user.findFirst({
      where: { id: body.userId },
    });

    if (!(reptileExists && userExists)) {
      return res.json({ error: "Invalid User or Reptile Id" });
    }

    const createdAt = getCurrentDateTime();
    const schedules = await client.schedule.create({
      data: {
        ...body,
        ...emptyScheduleDays,
        createdAt,
        updateAt: createdAt,
      },
    });
    res.json({ schedules });
  };

// Read
export const getAllSchedules =
  (client: PrismaClient): RequestHandler =>
  async (req, res) => {
    const schedules = await client.schedule.findMany();
    return res.json({ schedules });
  };

export const getScheduleByUser =
  (client: PrismaClient): RequestHandler =>
  async (req, res) => {
    const userId = parseInt(req.params.id);
    const schedules = await client.schedule.findMany({
      where: {
        userId: userId,
      },
    });
    res.json({ schedules });
  };

export const getScheduleByReptile =
  (client: PrismaClient): RequestHandler =>
  async (req, res) => {
    const id = parseInt(req.params.id);
    const schedules = await client.schedule.findMany({
      where: {
        reptileId: id,
      },
    });
    res.json({ schedules });
  };
