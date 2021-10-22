import Language from "../language/Language";

export interface Pattern {
  language: Language;
  pattern: string;
  isRegex: boolean;
}
