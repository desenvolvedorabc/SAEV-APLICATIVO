import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import Router from "next/router";
import { api } from "src/services/api";
import axios from "axios";
import { queryClient } from "src/lib/react-query";

export type IUser = {
  USU_ID: string;
  USU_EMAIL: string;
  USU_MUN: {
    MUN_ID: string;
    MUN_NOME: string;
  };
  USU_ESC: {
    ESC_ID: string;
    ESC_NOME: string;
  };
  USU_SPE: {
    SPE_ID: string;
    SPE_NOME: string;
    SPE_PER: {
      PER_ID: string;
      PER_NOME: string;
    };
  };
  isChangePasswordWelcome: boolean;
};

type AuthContextData = {
  signIn(values): Promise<any>;
  signOut: () => void;
  user: IUser;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {

  queryClient.clear();

  localStorage.clear();

  destroyCookie(null, "USU_NOME", {
    path: "/",
  });
  destroyCookie(null, "USU_EMAIL", {
    path: "/",
  });
  // destroyCookie(null, "USU_CARGO", {
  //   path: '/',
  // });
  destroyCookie(null, "USU_AVATAR", {
    path: "/",
  });
  destroyCookie(null, "USU_AVATAR_URL", {
    path: "/",
  });
  destroyCookie(null, "__session", {
    path: "/",
  });
  destroyCookie(null, "USU_ID", {
    path: "/",
  });
  destroyCookie(null, "USU_SPE", {
    path: "/",
  });
  destroyCookie(null, "USU_RETRY", {
    path: "/",
  });
  destroyCookie(null, "PER_NOME", {
    path: "/",
  });
  destroyCookie(null, "USU_SPE_ID", {
    path: "/",
  });

  // authChannel.postMessage("signOut");

  Router.push("/login");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser>({} as IUser);

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          signOut();
          break;
        case "signIn":
          Router.push("/");
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    const { __session: token } = parseCookies();

    if (token) {
      const decodeToken = jwt_decode(token) as any;
      setUser(decodeToken?.user);
    }
  }, []);

  async function signIn(values) {
    let response;
    try {
      response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        USU_EMAIL: values?.email,
        USU_SENHA: values?.password,
      })
    } catch (error) {
      response = error.response;
    }
    if (response.status !== 200) {
      return response;
    }


    const { access_token: token, expires_in } = response.data;

    setCookie(null, "__session", response.data.access_token, {
      path: "/",
      maxAge: +expires_in,
    });

    const decodeToken = jwt_decode(response.data.access_token) as any;

    const userDecodeToken = decodeToken?.user as IUser;

    setUser(userDecodeToken);

    setCookie(null, "USU_ID", decodeToken["user"]["USU_ID"], {
      path: "/",
    });

    setCookie(null, "USU_NOME", decodeToken["user"]["USU_NOME"], {
      path: "/",
    });
    setCookie(null, "USU_SPE", decodeToken["user"]["USU_SPE"]?.SPE_NOME || "", {
      path: "/",
    });
    setCookie(null, "PER_NOME", decodeToken["user"]["USU_SPE"]["SPE_PER"]?.PER_NOME || "", {
      path: "/",
    });
    window.localStorage.setItem("PER_NOME", decodeToken["user"]["USU_SPE"]["SPE_PER"]?.PER_NOME || "")
    setCookie(null, "USU_EMAIL", decodeToken["user"]["USU_EMAIL"], {
      path: "/",
    });
    setCookie(null, "USU_SPE_ID", decodeToken["user"]["USU_SPE"]?.SPE_ID || "", {
      path: "/",
    });
    setCookie(null, "USU_AVATAR", decodeToken["user"]["USU_AVATAR"], {
      path: "/",
    });
    const avatar = decodeToken["user"]["USU_AVATAR"];
    setCookie(null, "USU_AVATAR_URL", `${process.env.NEXT_PUBLIC_API_URL}/users/avatar/${avatar}`, {
      path: "/",
    });
    setCookie(null, "USU_RETRY", "0", {
      path: "/",
    });

    api.defaults.headers["Authorization"] = `Bearer ${token}`;

    switch (userDecodeToken?.USU_SPE.SPE_PER.PER_NOME) {
      case "Escola":
        Router.push(
          `/municipio/${userDecodeToken?.USU_MUN.MUN_ID}/escola/${userDecodeToken?.USU_ESC.ESC_ID}`
        );
        break;
      case "Município":
        Router.push(`/municipio/${userDecodeToken?.USU_MUN.MUN_ID}`);
        break;
      default:
        Router.push("/");
        break;
    }

    authChannel.postMessage("signIn");
  }

  return <AuthContext.Provider value={{ signIn, signOut, user }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
