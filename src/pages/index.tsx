import {
  Button,
  Card,
  Center,
  Grid,
  Image,
  Loader,
  Stack,
} from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
import { trpc } from "../utils/trpc";

const Pokemon = ({
  pokemon,
  index,
}: {
  pokemon: {
    name: string;
    url: string;
  };
  index: number;
}) => {
  return (
    <Grid.Col span={12} lg={2}>
      <Card>
        <Center>
          <Stack>
            <Image
              height={100}
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${
                index + 1
              }.gif`}
              alt={pokemon.name}
            />
            <span
              style={{
                textTransform: "capitalize",
              }}
            >
              {pokemon.name}
            </span>
          </Stack>
        </Center>
      </Card>
    </Grid.Col>
  );
};

const Home: NextPage = () => {
  const { data, fetchNextPage, isFetchingNextPage } = trpc.useInfiniteQuery(
    ["pokemon.all", {}],
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const [ref, observed] = useIntersection();

  useEffect(() => {
    if (observed?.isIntersecting) {
      fetchNextPage();
    }
  }, [observed?.isIntersecting, fetchNextPage]);

  return (
    <>
      <Head>
        <title>poke man</title>
      </Head>
      <Center>
        {data?.pages ? (
          <Grid
            grow
            sx={{
              width: "80%",
            }}
          >
            {data.pages.map((page) => (
              <>
                {page.items.map((pokemon, index) => {
                  return (
                    <Pokemon
                      pokemon={pokemon}
                      key={pokemon.name}
                      index={index}
                    />
                  );
                })}
              </>
            ))}
          </Grid>
        ) : (
          <Loader />
        )}
      </Center>
      <Button
        onClick={() => fetchNextPage()}
        ref={ref}
        mt={"xl"}
        loading={isFetchingNextPage}
      >
        Next
      </Button>
    </>
  );
};

export default Home;
