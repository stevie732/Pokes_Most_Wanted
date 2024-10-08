import React, { useState, useEffect } from "react";
import "./main.css";
import pokepic from "./assets/pokeball.png";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AvailablePokemon from "./pokemon/AvailablePokemon";
import UserPokemon from "./pokemon/UserPokemon";
import UserPage from "./components/user/UserPage";
import Footer from "./components/footer/Footer";
import SearchBar from "./components/searchbar/SearchBar";

import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { Pokemon, Ability, PokemonType } from "./types/types";

import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const auth = getAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [username, setUsername] = useState("");
  const [availablePokemons, setAvailablePokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [userPokemons, setUserPokemons] = useState<Pokemon[]>([]);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user.uid);
        setUsername(user.displayName || "");
        localStorage.setItem("user", user.uid);
      } else {
        setIsLoggedIn(false);
        setUser("");
        setUsername("");
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const getAvailablePokeData = async () => {
      const apiUrl: string = "https://pokeapi.co/api/v2";
      const limit: number = 151;
      const offset: number = 0;
      const url: string = `${apiUrl}/pokemon?limit=${limit}&offset=${offset}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        const pokemonList: {
          name: string;
          url: string;
          id: number;
          types: string[];
        }[] = data.results;

        const updatedPokemonList = await Promise.all(
          pokemonList.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            if (!response.ok) {
              throw new Error(`Error fetching data for ${pokemon.name}`);
            }
            const pokemonData = await response.json();
            const types = pokemonData.types.map(
              ({ type }: PokemonType) => type.name
            );
            const abilities = pokemonData.abilities.map(
              ({ ability }: Ability) => ability.name
            );
            const { sprites } = pokemonData;
            const image = sprites.other['official-artwork'].front_shiny;
            return { ...pokemon, types, abilities, image, user };
          })
        );

        setAvailablePokemons(updatedPokemonList);
        setFilteredPokemons(updatedPokemonList); // Initialize filteredPokemons
      } catch (error) {
        console.error("Error fetching data from the PokeAPI:", error);
      }
    };

    getAvailablePokeData();
  }, [user]);

  useEffect(() => {
    const getUserPokeData = async () => {
      try {
        const userPokemonQuery = query(
          collection(db, "pokemon"),
          where("user", "==", user)
        );
        const querySnapshot = await getDocs(userPokemonQuery);

        const updatedPokemonList: Pokemon[] = [];

        querySnapshot.forEach((doc) => {
          updatedPokemonList.push(doc.data() as Pokemon);
        });

        setUserPokemons(updatedPokemonList);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    getUserPokeData();
  }, [db, user]);

  const handleLogout = async () => {
    const loginErrorNotification = (error) => {
      toast.error(`Registration error: ${error}`, {
        position: "top-right",
      });
    };
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser("");
      setUsername("");
      localStorage.removeItem("user");
      console.log(user, "has been logged out");
    } catch (error) {
      loginErrorNotification(error);
      console.error("Error logging out:", error);
    }
  };

  const removePokemonFromState = (pokemonName: string): void => {
    const updatedPokemon = userPokemons.filter(
      ({ name }) => name !== pokemonName
    );
    setUserPokemons(updatedPokemon);
  };

  const addPokemonToState = (pokemon: Pokemon): void => {
    const updatedPokemon = [...userPokemons, pokemon];
    setUserPokemons(updatedPokemon);
  };

  const handleSearch = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = availablePokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredPokemons(filtered);
  };

  const HomePage = () => (
    <div>
      <h2>Welcome, {username}</h2>
      <SearchBar onSearch={handleSearch} />
      <AvailablePokemon
        pokemons={filteredPokemons}
        user={user}
        addPokemonToState={addPokemonToState}
      />
    </div>
  );

  const LoginComponent = (
    <Login
      auth={auth}
      setIsLoggedIn={setIsLoggedIn}
      setIsRegistered={setIsRegistered}
      setUser={setUser}
    />
  );

  const RegisterComponent = (
    <Register
      auth={auth}
      setIsLoggedIn={setIsLoggedIn}
      setIsRegistered={setIsRegistered}
      setUser={setUser}
    />
  );

  const CollectionComponent = (
    <UserPokemon
      user={user}
      pokemons={userPokemons}
      removePokemonFromState={removePokemonFromState}
    />
  );

  const UserPageComponent = (
    <UserPage
      username={username}
      setUsername={setUsername}
    />
  );

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <div className="top-container">
          <img src={pokepic} alt="nopic" />
          <h1 className="main-logo-text">Poke's Most Wanted</h1>
          <nav>
            <ul>
              {!isLoggedIn && (
                <li>
                  <Link to="/login">Login</Link>
                </li>
              )}
              {isLoggedIn && (
                <li onClick={handleLogout}>
                  <Link to="/login">Logout</Link>
                </li>
              )}
              <li>
                <Link to="/register">Register</Link>
              </li>
              {isLoggedIn && (
                <div>
                  <li>
                    <Link to="/collection">Collection</Link>
                  </li>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/user">User</Link>
                  </li>
                </div>
              )}
            </ul>
          </nav>
        </div>
        <Routes>
          <Route path="/login" element={LoginComponent} />
          <Route path="/register" element={RegisterComponent} />
          <Route path="/collection" element={CollectionComponent} />
          <Route path="/user" element={UserPageComponent} />
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <HomePage />
              ) : (
                LoginComponent
              )
            }
          />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;