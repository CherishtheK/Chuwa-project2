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