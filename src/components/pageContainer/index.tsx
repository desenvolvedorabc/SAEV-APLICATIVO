import { PageContainerStyled, Saev, Text, Main } from "./styledComponents";
import { MdOutlineEmojiEmotions } from "react-icons/md";

export default function PageContainer({ isPdf = false, children }) {
  return (
    <>
      {isPdf ? (
        <main className="d-flex col-12" style={{ height: "100%" }}>
          <PageContainerStyled>
            <div>{children}</div>
            <Saev>
              <Text>SAEV - Feito com dedicação por ONG Bem Comum</Text>
              <MdOutlineEmojiEmotions color="#3E8277" size={12} />
            </Saev>
          </PageContainerStyled>
        </main>
      ) : (
        <main className="d-flex col-12" style={{ height: "100%" }}>
          <PageContainerStyled>
            <div>{children}</div>
            <Saev>
              <Text>SAEV - Feito com dedicação por ONG Bem Comum</Text>
              <MdOutlineEmojiEmotions color="#3E8277" size={12} />
            </Saev>
          </PageContainerStyled>
        </main>
      )}
    </>
  );
}
