import LoginContent from "src/components/loginContent";
import LoginContainer from "src/components/loginContainer";
import CardLogin from "../src/components/cardLogin";
import FormNovaSenha from "../src/components/formNovaSenha";
import {Header} from "../src/components/header";


export default function NovaSenha() {

  return (
    <>
      <Header title={"Definir Nova Senha"}/>
      <LoginContainer>
        <LoginContent>
          <CardLogin>
            <FormNovaSenha />
          </CardLogin>
        </LoginContent>
      </LoginContainer>
    </>
  );
}
