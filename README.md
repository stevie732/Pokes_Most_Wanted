# Poke's Most Wanted Application

## Overview

The Poke's Most Wanted application is a React-based web application that allows users to view, search, and manage a collection of Pokémon. It integrates with Firebase for authentication and Firestore for storing user-specific Pokémon data. The application also fetches data from the PokeAPI to display available Pokémon.

## Components

### App Component

- **State Management**: Utilizes React's `useState` and `useEffect` hooks to manage authentication state, user data, and Pokémon data.
- **Firebase Integration**: Uses Firebase Authentication to manage user sessions and Firestore to store user-specific Pokémon collections.
- **Routing**: Implements `react-router-dom` for navigation between different pages such as Login, Register, Home, Collection, and User pages.

### Authentication

- **Login**: Allows users to log in using Firebase Authentication. Updates the application state to reflect the user's logged-in status.
- **Register**: Provides a registration form for new users to sign up.

### Pokémon Management

- **AvailablePokemon**: Displays a list of Pokémon fetched from the PokeAPI. Users can search and filter Pokémon using the `SearchBar` component.
- **UserPokemon**: Displays the user's collection of Pokémon stored in Firestore. Users can add or remove Pokémon from their collection.

### User Interface

- **SearchBar**: Allows users to search for Pokémon by name. Filters the list of available Pokémon based on the search query.
- **UserPage**: Displays user-specific information and allows users to update their profile.
- **Footer**: A simple footer component displayed at the bottom of the application.

## Design and Style

- **CSS Styling**: The application uses `main.css` for styling. It includes styles for layout, typography, and component-specific designs.
- **Responsive Design**: Ensures that the application is accessible and usable on various devices and screen sizes.
- **Navigation**: A top navigation bar provides links to different sections of the application. The navigation options change based on the user's authentication status.

## Error Handling

- **Toast Notifications**: Uses `react-toastify` to display error messages and notifications to the user. For example, errors during login or data fetching are shown as toast messages.

## External Libraries

- **React Router**: For handling client-side routing.
- **Firebase**: For authentication and Firestore database.
- **React Toastify**: For displaying notifications.
- **PokeAPI**: For fetching Pokémon data.

## Usage

1. **Login/Register**: Users can log in or register to access their Pokémon collection.
2. **View Pokémon**: Browse available Pokémon and add them to the user's collection.
3. **Manage Collection**: View and manage the user's Pokémon collection stored in Firestore.
4. **Search**: Use the search bar to find specific Pokémon by name.

## Future Enhancements

- **Enhanced Search**: Implement advanced search features such as filtering by type or abilities.
- **Profile Customization**: Allow users to customize their profile with additional information and settings.
- **Social Features**: Enable users to share their collections with friends or the community.
