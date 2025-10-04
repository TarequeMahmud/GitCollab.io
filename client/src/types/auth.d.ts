type Credentials = {
  username: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
};

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  about: string;
}