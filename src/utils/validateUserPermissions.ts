import { IUser } from "src/context/AuthContext";

type UserArea = {
  ARE_NOME: string;
  ARE_DESCRICAO: string;
  ARE_ID: string;
};

type ValidateUserPermissionsParams = {
  areas: UserArea[];
  user: IUser;
  roles?: string[];
  profiles?: string[];
};

export function validateUserPermissions({
  user,
  areas,
  roles,
  profiles,
}: ValidateUserPermissionsParams) {
  if (roles?.length > 0) {
    const hasAllRoles = areas.some((area) => {
      return roles.includes(area.ARE_NOME);
    });

    if (!hasAllRoles) {
      return false;
    }
  }

  if (profiles?.length > 0) {
    if (!profiles.includes(user.USU_SPE.SPE_PER.PER_NOME)) {
      return false;
    }
  }

  return true;
}
