import Notification from "../../notification";
import Search from "../searchHome";
import { Container, ButtonVoltar } from "./styledComponents";
import PageTitle from "src/components/pageTitle";
import { MdArrowBack } from "react-icons/md"; 
import Link from "next/link";

export default function Top({link = "/", title, searchOpen = false}){
  return(
      <Container className="col-12">        
        <PageTitle>{title}</PageTitle>
        <Search/>
        <div className="d-flex align-items-center">
          <Notification />
        </div>
      </Container>
  )
}