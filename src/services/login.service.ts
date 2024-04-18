import axios from "axios";
import jwt_decode from "jwt-decode";
import { setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { api } from "./api";

export function validateAuth() {
  const cookies = parseCookies();
  if (cookies["__session"]) {
    Router.push("/");
  }
}

export async function loginRequest(values, redirect) {
  return await axios.post(`/api/login`, values).then((response) => {
    if (response.data.status !== 200) {
      return response;
    }
    const decodeToken = jwt_decode(response.data.access_token);
    setCookie(null, "USU_ID", decodeToken["user"]["USU_ID"], {
      path: "/",
    });
    setCookie(null, "USU_NOME", decodeToken["user"]["USU_NOME"], {
      path: "/",
    });
    setCookie(null, "USU_SPE", decodeToken["user"]["USU_SPE"]?.SPE_NOME || "", {
      path: "/",
    });
    setCookie(null, "USU_EMAIL", decodeToken["user"]["USU_EMAIL"], {
      path: "/",
    });
    setCookie(
      null,
      "USU_SPE_ID",
      decodeToken["user"]["USU_SPE"]?.SPE_ID || "",
      {
        path: "/",
      }
    );
    setCookie(null, "USU_AVATAR", decodeToken["user"]["USU_AVATAR"], {
      path: "/",
    });
    const avatar = decodeToken["user"]["USU_AVATAR"];
    setCookie(
      null,
      "USU_AVATAR_URL",
      `${process.env.NEXT_PUBLIC_API_URL}/users/avatar/${avatar}`,
      {
        path: "/",
      }
    );
    setCookie(null, "USU_RETRY", "0", {
      path: "/",
    });

    if (redirect) {
      Router.push("/");
    } else {
      return response;
    }
  });
}

export async function confirmarNovaSenhaRequest(token, password) {
  const response = await api
    .patch("/login/reset-password", {
      token,
      password,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("error: ", error);
      return {
        status: 400,
        data: {
          message: error.response.data.message,
        },
      };
    });

  return response;
}

export async function confirmarNovaSenhaRequestLogged(password) {
  const cookies = parseCookies();
  const token = cookies["__session"];

  return await axios.post("/api/login/confirmar-nova-senha", {
    token,
    password,
  });
}

export async function recuperarSenhaRequest(email) {
  axios.post("/api/login/recuperar-senha", { email });
}
