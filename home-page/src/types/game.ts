/**
 * Represents a single game entry in the MKK Games Universe catalog.
 */
export interface Game {
  id: string;
  name: string;
  image: string;
  link: string;
  category: "Arcade" | "Puzzle" | "Strategy" | "Classic" | "Action";
  description: string;
  isNew?: boolean;
}
