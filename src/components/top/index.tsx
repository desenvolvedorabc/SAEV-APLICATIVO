import Notification from "../notification";
import Search from "../search";
import { useRouter } from "next/router";
import { Container, ButtonVoltar } from "./styledComponents";
import PageTitle from "src/components/pageTitle";
import { MdArrowBack } from "react-icons/md";

export default function Top({ link = "/", title, searchOpen = false }) {
  const router = useRouter();

  return (
    <Container className="col-12">
      <div className="d-flex align-items-center">
        {/* <Link href={link}> */}
        <ButtonVoltar data-test='back' onClick={() => router.back()}>
          <MdArrowBack color={"#3E8277"} size={28} />
        </ButtonVoltar>
        {/* </Link> */}

        <PageTitle dataTest={title}>{title}</PageTitle>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <Search open={searchOpen} />
        <Notification />
      </div>
    </Container>
  );
}
