export interface LoginResult {
  login: {
    success: boolean;
    message: string | null;
    token: string | null;
    user: { id: string; userName: string; role: string } | null;
  };
}

export interface LoginVariables {
  input: {
    loginName: string;
    loginPassword: string;
  };
}

export interface ValidateTokenResult {
  validateRegistrationToken: {
    valid: boolean;
    email: string | null;
  } | null;
}

export interface ValidateTokenVariables {
  token: string;
}

export interface RegisterResult {
  register: {
    success: boolean;
    message: string | null;
    token: string | null;
    user: {
      id: string;
      userName: string;
      role: string;
      email: string;
    } | null;
  };
}

export interface RegisterVariables {
  input: {
    token: string;
    registerName: string;
    password: string;
  };
}