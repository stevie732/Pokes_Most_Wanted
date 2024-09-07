import React from "react";
import "./pokeItem.css";
import "./pokeItem.scss"; // Ensure SCSS is imported
import { PokemonItemProps, Pokemon } from "../types/types";
import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { AVAILABLE_FLOW, USER_FLOW, ADD_TEXT, OWNED_TEXT } from "../constants/constants";
import { typeColors } from "../constants/typeColors"; // Import the type-to-color mapping

const PokemonItem: React.FC<PokemonItemProps> = ({
  pokemon,
  flow,
  onRemove,
  onAdd,
}) => {
  const { name, image, types, abilities, user: userEmail } = pokemon;
  const db = getFirestore();

  const [owned, setIsOwned] = useState(false);

  const addPokemonSuccessNotification = (pokemon) => {
    toast.success(`${pokemon} added to your collection`, {
      position: "top-right",
    });
  };

  const removePokemonSuccessNotification = (pokemon) => {
    toast.success(`${pokemon} removed from your collection`, {
      position: "top-right",
    });
  };

  useEffect(() => {
    const checkIfPokemonInCollection = async (
      pokemonName: string
    ): Promise<void> => {
      const userPokemonCollection = collection(db, "pokemon");

      const q = query(
        userPokemonCollection,
        where("name", "==", pokemonName),
        where("user", "==", userEmail)
      );

      const querySnapshot = await getDocs(q);

      setIsOwned(!querySnapshot.empty);
    };
    checkIfPokemonInCollection(name);
  }, [db, name, userEmail]);

  const handleAddPokemon = async (pokemon: Pokemon) => {
    try {
      const pokemonCollection = collection(db, "pokemons");
      await addDoc(pokemonCollection, pokemon);
      addPokemonSuccessNotification(pokemon.name);
      onAdd(pokemon);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleRemovePokemon = async (pokemonName: string) => {
    try {
      const pokemonCollection = collection(db, "pokemons");
      const pokemonQuery = query(
        pokemonCollection,
        where("name", "==", pokemonName)
      );
      const querySnapshot = await getDocs(pokemonQuery);

      if (querySnapshot.docs.length === 0) {
        console.error("No Pokemon found with the name: " + pokemonName);
        return;
      }

      const pokemonDoc = querySnapshot.docs[0];

      await deleteDoc(pokemonDoc.ref);
      removePokemonSuccessNotification(pokemonName);

      onRemove(pokemonName);
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const isAvailableFlow: boolean = flow === AVAILABLE_FLOW;
  const isUserFlow: boolean = flow === USER_FLOW;
  const addText: string = !owned ? ADD_TEXT : OWNED_TEXT;

  // Determine the background color based on the first type
  const backgroundColor = typeColors[types[0]] || "#FFFFFF"; 

  return (
    <div className="pokemon-card">
      <div className="pokemon-details">
        <img src={image} alt={name} className="pokemon-image" />
        <h3 style={{ backgroundColor }}>{name}</h3>
        <p>
          <span>Types:</span> {types.join(", ")}
        </p>
        <p className="abilities">
          <span>Abilities:</span> {abilities.join(", ")}
        </p>

        {isAvailableFlow && (
          <button
            className="add-pokemon-button"
            onClick={() => handleAddPokemon(pokemon)}
            disabled={owned}
          >
            {addText}
          </button>
        )}
        {isUserFlow && (
          <button
            className="add-pokemon-button"
            onClick={() => handleRemovePokemon(name)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default PokemonItem;