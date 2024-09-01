import { Auth } from "firebase/auth";

export {};

export interface AuthProps {
  auth: Auth;
  setIsRegistered: (isRegistered: boolean) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: string) => void;
}

export interface Ability {
  ability: {
    name: string;
  };
}

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  abilities: string[];
  image: string;
  user: string;
}
export interface PokemonItemProps {
  pokemon: Pokemon;
  flow: string;
  onRemove?: Function;
  onAdd?: Function;
}

export interface PokemonProps {
  pokemons: Pokemon[];
  user: string;
  removePokemonFromState?: Function;
  addPokemonToState?: Function;
}