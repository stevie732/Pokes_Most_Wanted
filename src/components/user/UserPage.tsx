import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./userpage.css";

interface UserPageProps {
  username: string;
  setUsername: (username: string) => void;
}

const UserPage: React.FC<UserPageProps> = ({ username, setUsername }) => {
  const [newUsername, setNewUsername] = useState<string>(username);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUsername = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
          setNewUsername(userDoc.data().username);
        }
      }
    };

    fetchUsername();
  }, [auth, db, setUsername]);

  const handleUpdateUsername = async () => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: newUsername });
        await setDoc(doc(db, "users", auth.currentUser.uid), { username: newUsername });
        setUsername(newUsername);
        toast.success("Username updated successfully", { position: "top-right" });
      } catch (error) {
        toast.error(`Error updating username: ${error.message}`, { position: "top-right" });
      }
    }
  };

  const handleDeleteUsername = async () => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: "" });
        await deleteDoc(doc(db, "users", auth.currentUser.uid));
        setUsername("");
        setNewUsername("");
        toast.success("Username deleted successfully", { position: "top-right" });
      } catch (error) {
        toast.error(`Error deleting username: ${error.message}`, { position: "top-right" });
      }
    }
  };

  return (
    <div className="user-page">
      <h2>User Name</h2>
      <input
        type="text"
        placeholder="Enter new username"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <button onClick={handleUpdateUsername}>Update Username</button>
      <button onClick={handleDeleteUsername}>Delete Username</button>
    </div>
  );
};

export default UserPage;
