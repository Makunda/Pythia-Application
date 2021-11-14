/**
 * Category of the framework
 */
export default interface FrameworkCategory {
  _id?: string;
  title: string;
  description: string;
  tags: string[]; // Used as meta data
  isRoot: boolean; // consider the category as a starting point
  level: number;

  parent: FrameworkCategory | null; // Category leaf

  children?: FrameworkCategory[];
}
