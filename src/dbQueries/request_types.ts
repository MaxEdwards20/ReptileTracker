import { ScheduleType, SexType, SpeciesType } from "../types";

export type CreateUserBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
export type CreateFeedingBody = {
  reptileId: number;
  foodItem: string;
};

export type CreateHusbandryBody = {
  reptileId: number;
  length: number;
  weight: number;
  temperature: number;
  humidity: number;
};

export type CreateReptileBody = {
  userId: number;
  species: SpeciesType;
  name: string;
  sex: SexType;
};

export type UpdateReptileBody = {
  species?: SpeciesType;
  name?: string;
  sex?: string;
};

export type CreateScheduleBody = {
  reptileId: number;
  userId: number;
  type: ScheduleType;
  description: string;
};

export type LoginBody = {
  email: string;
  password: string;
};