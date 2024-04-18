import CardLogin from "src/components/cardLogin";
import FormLogin from "src/components/formLogin";
import LoginContainer from "src/components/loginContainer";
import LoginContent from "src/components/loginContent";
import { Header } from "src/components/header";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export default function Home() {
  return (
    <>
      <Header title={"Login"} />
      <LoginContainer>
        <LoginContent>
          <CardLogin>
            <FormLogin />
          </CardLogin>
        </LoginContent>
      </LoginContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);

  if (cookies["__session"]) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
