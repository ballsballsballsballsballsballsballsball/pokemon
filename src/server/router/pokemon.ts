import { z } from "zod";
import { createRouter } from "./context";

type PokemonResponse = {
  count: number;
  next: string;
  previous: string;
  results: {
    name: string;
    url: string;
  }[];
};

type PokemonByNameResponse = {
  sprites: {
    front_default: string;
  };
};

export const pokemonRouter = createRouter()
  .query("all", {
    input: z.object({
      cursor: z.any().nullish(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=125&offset=${input.cursor}`
      );

      const data: PokemonResponse = await response.json();

      return {
        items: data.results,
        nextCursor: data.next.split("?")[1]?.split("&")[0]?.split("=")[1],
      };
    },
  })
  .query("byName", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input }) {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${input.name}`
      );

      const data: PokemonByNameResponse = await response.json();
      return data;
    },
  });
