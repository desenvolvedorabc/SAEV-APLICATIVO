import Notification from "../notification";
import Search from "../search";
import { useRouter } from "next/router";
import { Container, ButtonVoltar } from "./styledComponents";
import PageTitle from "src/components/pageTitle";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";

export default function Top({ link = "/", title, searchOpen = false }) {
  const router = useRouter();

  return (
    <Container className="col-12">
      <div className="d-flex align-items-center">
        {/* <Link href={link}> */}
        <ButtonVoltar onClick={() => router.back()}>
          <MdArrowBack color={"#3E8277"} size={28} />
        </ButtonVoltar>
        {/* </Link> */}

        <PageTitle>{title}</PageTitle>
      </div>
      <div className="d-flex align-items-center">
        <Search open={searchOpen} />
        <Notification />
      </div>
    </Container>
  );
}
