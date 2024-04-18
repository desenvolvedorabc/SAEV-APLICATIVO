import Navigation from 'src/components/navigation'
import { Header } from "src/components/header";
import { Main } from '../pageContainer/styledComponents';
import { parseCookies } from 'nookies';

export default function Layout({ children, ...props }) {

  let cookies = parseCookies()
  cookies = {
    ...cookies,
  }

  return (
    <div>
      <Header title={props.header} />
      <div className="d-flex">
        <Navigation userInfo={cookies} />
        <Main className="d-flex col-12">{children}</Main>
      </div>
    </div>
  )
}
