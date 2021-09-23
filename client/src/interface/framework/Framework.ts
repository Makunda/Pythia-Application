import User from "../User";
import { Pattern } from "./Pattern";

export interface Framework {
  _id: number;
  name: string;
  description: string;
  location: string;

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
