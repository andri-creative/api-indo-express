import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  provider: "google";
  photo?: string;
  role: "user";
  createdAt: Date;
}
