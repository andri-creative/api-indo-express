import { ObjectId } from "mongodb";

export interface ApiKey {
  _id?: ObjectId;
  key: string;
  userId: ObjectId;
  createdAt: Date;
}
