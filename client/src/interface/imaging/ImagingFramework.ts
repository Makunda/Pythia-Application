/**
 * Imaging frameworks
 */
export default interface ImagingFramework {
  _id?: string;
  pattern: string;
  name: string;
  language: string;
  description: string;

  // Imaging properties
  level5: string;
  level4: string;
  level3: string;
  level2: string;
  level1: string;

  // Timestamp
  createdOn: Date;
  lastModified: Date;
  timestamp: number;

  // Todo, add fields validated by the User as locks
  locks: string[];

  views: number;
}
