import User from "../account/User";
import FrameworkCategory from "./FrameworkCategory";
import { Pattern } from "./Pattern";

export interface Framework {
  _id: string;
  name: string;
  imagingName: string;
  description: string;
  location: string;

  isRoot: boolean;
  validated: boolean;

  // Imaging properties
  level5: string;
  level4: string;
  level3: string;
  level2: string;
  level1: string;

  detectionData: string;
  createdByUser: boolean;
  tags: string[];

  patterns?: Pattern[];

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
