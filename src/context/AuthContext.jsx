import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "streamoholic_user";
const USERS_KEY = "streamoholic_users";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureDemoUser() {
  const users = loadUsers();
  if (!users["demo@streamoholic.tv"]) {
    users["demo@streamoholic.tv"] = {
      name: "Demo Viewer",
      email: "demo@streamoholic.tv",
      password: "demo1234",
      plan: "Signal",
      joined: new Date().toISOString(),
      avatarColor: "cyan",
      devices: ["Web Browser", "Smart TVs", "iOS & Android"],
      screens: 3,
    };
    saveUsers(users);
  }
}
ensureDemoUser();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored) setUser(stored);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = (u) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  // Mock network delay so forms feel real.
  const delay = () => new Promise((res) => setTimeout(res, 550));

  const signUp = async ({ name, email, password }) => {
    await delay();
    const users = loadUsers();
    if (users[email]) {
      throw new Error("An account with that email already exists.");
    }
    const newUser = {
      name,
      email,
      password, // mock only — never store plaintext passwords in a real app
      plan: "Free",
      joined: new Date().toISOString(),
      avatarColor: ["crimson", "cyan", "amber"][Math.floor(Math.random() * 3)],
      devices: ["Web Browser"],
      screens: 1,
    };
    users[email] = newUser;
    saveUsers(users);
    const { password: _pw, ...safeUser } = newUser;
    persist(safeUser);
    return safeUser;
  };

  const signIn = async ({ email, password }) => {
    await delay();
    const users = loadUsers();
    const found = users[email];
    if (!found || found.password !== password) {
      throw new Error("That email and password don't match our records.");
    }
    const { password: _pw, ...safeUser } = found;
    persist(safeUser);
    return safeUser;
  };

  const signOut = () => persist(null);

  const updateProfile = (patch) => {
    if (!user) return;
    const updated = { ...user, ...patch };
    persist(updated);
    const users = loadUsers();
    if (users[user.email]) {
      users[user.email] = { ...users[user.email], ...patch };
      saveUsers(users);
    }
  };

  return (
    <AuthContext.Provider value={{ user, ready, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
