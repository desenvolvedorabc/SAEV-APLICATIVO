import {Container} from './styledComponents'

export function ContainerScore ({children}){
  return(
    <Container className="isPdf">
      {children}
    </Container>
  )
}