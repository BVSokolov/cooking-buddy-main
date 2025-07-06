export type Recipe = {
  id: string;
  name: string;
  content: {
    ingredients: {
      [key: string]: { id: string; name: string; value: string };
    };
    instructions: string[];
  };
};
