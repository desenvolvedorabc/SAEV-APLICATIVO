import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import decode from "jwt-decode";

import { AuthTokenError } from "../services/errors/AuthTokenError";
import { validateUserPermissions } from "./validateUserPermissions";
import { IUser } from "src/context/AuthContext";
import { RoleProfile } from "src/services/perfis.service";

type WithSSRAuthOptions = {
  roles: string[];
  profiles?: string[];
};

type User = {
  USU_SPE: {
    SPE_ID: string;
    SPE_NOME: string;
  };
};

type UserArea = {
  ARE_NOME: string;
  ARE_DESCRICAO: string;
  ARE_ID: string;
};

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options: WithSSRAuthOptions
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies["__session"];

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    if (options) {
      const { user } = decode<{ user: IUser }>(token);
      
      const { roles, profiles } = options;

      const userHasValidPermissions = validateUserPermissions({
        user,
        areas: [],
        roles: [],
        profiles: Object.keys(RoleProfile),
      });

      if (!userHasValidPermissions) {
        let destination = "/";

        switch (user?.USU_SPE?.role) {
          case "ESCOLA":
            destination = `/municipio/${user?.USU_MUN.MUN_ID}/escola/${user?.USU_ESC.ESC_ID}`;
            break;
          case "MUNICIPIO_ESTADUAL":
            destination = `/municipio/${user?.USU_MUN.MUN_ID}`;
            break;
          case "MUNICIPIO_MUNICIPAL":
            destination = `/municipio/${user?.USU_MUN.MUN_ID}`;
            break;
          case "ESTADO":
            destination = `/municipios`;
            break;
          default:
            break;
        }

        return {
          redirect: {
            destination,
            permanent: false,
          },
        };
      }
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, "__session");

        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }
    }
  };
}
