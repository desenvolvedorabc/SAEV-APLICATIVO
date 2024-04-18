import { useMemo } from "react";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import { MdExitToApp } from "react-icons/md";
import { PERFISLINKS } from "../../utils/menu";
import {
  Active,
  ButtonLink,
  ButtonLogout,
  Nav,
  SubTitle,
  Ul,
  UserInfo,
  UserWrapper,
  ImageStyled,
  TitleGroup,
} from "./styledComponents";
import Link from "next/link";
import { useGetSubPerfil } from "src/services/sub-perfis.service";
import { useAuth } from "src/context/AuthContext";

export default function Navigation(props) {
  const { pathname } = useRouter();

  const { signOut } = useAuth();
 
  const { data } = useGetSubPerfil(props?.userInfo?.USU_SPE_ID, !!props?.userInfo?.USU_SPE_ID)
  const areas =  data?.AREAS ?? [];

  const filterLinks = useMemo(() => {
    const filter = PERFISLINKS.map((data) => {
      // let isVerify = false;
      // areas.forEach((area) => {
      //   if (area.ARE_NOME === data?.ARE_NOME) {
      //     isVerify = true;
      //   }
      // });

      // if (isVerify) {
      //   return data;
      // } else {
        const options = data.items.filter((item) => {
          let verifyItem = false;

          areas.forEach((area) => {
            if (item.validate || area.ARE_NOME === item.ARE_NOME) {
              verifyItem = true;
            }
          });

          return verifyItem;
        });

        if (options.length) {
          return {
            grupo: data.grupo,
            items: options,
          };
        }
      // }
    });

    return filter;
  }, [areas]);

  return (
    <Nav>
      <UserWrapper>
        <>
          <div className="d-flex pb-2">
            <Image
              src="/assets/images/Logo_SAEV_TelaLogin3.png"
              // src="/assets/images/logoSaev2.png"
              width={68}
              height={21}
              alt="SAEV"
            />
            <SubTitle>
              <strong>
                Sistema de Avaliação
                <br />
                Educar pra Valer
              </strong>
            </SubTitle>
          </div>
          <Link href="/minha-conta" passHref>
            {props.userInfo.USU_AVATAR ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                style={{ cursor: "pointer" }}
                src={`${props.userInfo.USU_AVATAR_URL}`}
                className="rounded-circle"
                width={42}
                height={42}
                alt="foto usuário"
              />
            ) : (
              <ImageStyled
                style={{ cursor: "pointer" }}
                src="/assets/images/avatar.png"
                className="rounded-circle"
                width={42}
                height={42}
              />
            )}
          </Link>
          <div className="d-flex justify-content-between align-items-center py-2">
            <Link href="/minha-conta" passHref>
              <UserInfo style={{ cursor: "pointer" }}>
                <strong>{props.userInfo.USU_NOME}</strong>
                <br />
                {props.userInfo.USU_SPE}
              </UserInfo>
            </Link>
            <div>
              <ButtonLogout onClick={signOut}>
                <MdExitToApp color={"#FFF"} size={24} />
              </ButtonLogout>
            </div>
          </div>
        </>
      </UserWrapper>
      <Ul>
        {filterLinks?.map((x) => (
          <div key={x?.grupo}>
            {x?.grupo && <TitleGroup key={x?.grupo}>{x?.grupo}:</TitleGroup>}
            {x?.items?.map(({ name, path, icon }) => (
              <li key={path}>
                {path === pathname ? (
                  <Active>
                    <div className="pe-2">{icon}</div>
                    {name}
                  </Active>
                ) : (
                  <ButtonLink
                    onClick={() => {
                      Router.push(path);
                    }}
                  >
                    <div className="pe-2">{icon}</div>
                    {name}
                  </ButtonLink>
                )}
              </li>
            ))}
          </div>
        ))}
      </Ul>
    </Nav>
  );
}
