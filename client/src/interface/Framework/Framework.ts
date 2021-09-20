import User from "../User";
import { Pattern } from "./Pattern";

export interface Framework {
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
