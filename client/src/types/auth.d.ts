type FetchOptions = RequestInit & { [key: string]: any };

type AuthFetchResponse<T = any> = {
  status: number;
  ok: boolean;
  data?: T;
  message?: string;
};

type Credentials = {
  email: string;
  password: string;
  [key: string]: any;
};

type AuthContextType = {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (val: boolean | null) => void;
  login: (credentials: Credentials) => Promise<any>;
  register: (credentials: Credentials) => Promise<any>;
  logout: () => Promise<void>;
};
