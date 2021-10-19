import User from "../account/User";
import { Pattern } from "./Pattern";

export interface Framework {
  _id: string;
  name: string;
  description: string;
  location: string;

  isRoot: boolean;
  validated: boolean;

  patterns: Pattern[];

  detectionData: string;
  createdByUser: boolean;
  tags: string[];

  creator: User;

  createdOn: number;
  lastModified: number;

  timestamp: number;
  views: number;
}

export interface FrameworkCreation {
  name: string;
  description: string;
  location: string;

  patterns?: Pattern[];
  tags?: string[];
}
