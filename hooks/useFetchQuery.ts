import { Colors } from '@/constants/Colors';
import { InitialPageParam } from './../node_modules/@tanstack/query-core/src/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

type API = {
  '/pokemon?limit=21': {
    count: number;
    next: string | null;
    results: { name: string; url: string }[];
  };
  '/pokemon/[id]': {
    id: number;
    name: string;
    url: string;
    weight: number;
    height: number;
    moves: { move: { name: string } }[];
    stats: {
      base_stat: number;
      stat: {
        name: string;
      };
    }[];
    cries: {
      latest: string;
    };
    types: {
      type: {
        name: keyof (typeof Colors)['type'];
      };
    }[];
  };
  '/pokemon-species/[id]': {
    flavor_text_entries: {
      flavor_text: string;
      language: {
        name: string;
      };
    }[];
  };
};

const endpoint = 'https://pokeapi.co/api/v2';
export function useFetchQuery<T extends keyof API>(
  path: T,
  params?: Record<string, string | number>
) {
  const localUrl =
    endpoint +
    Object.entries(params ?? {}).reduce(
      (acc, [Key, value]) => acc.replaceAll(`[${Key}]`, value),
      path
    );
  return useQuery({
    queryKey: [localUrl],
    queryFn: async () => {
      return fetch(localUrl).then((r) => r.json() as Promise<API[T]>);
    },
  });
}

export function useInfiniteFetchQuery<T extends keyof API>(path: T) {
  return useInfiniteQuery({
    queryKey: [path],
    initialPageParam: endpoint + path,
    queryFn: async ({ pageParam }) => {
      return fetch(pageParam, {
        headers: {
          Accept: 'application/json',
        },
      }).then((r) => r.json() as Promise<API[T]>);
    },
    getNextPageParam: (lastPage) => {
      if ('next' in lastPage) {
        return lastPage.next;
      }
      return null;
    },
  });
}

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration * 1000));
}