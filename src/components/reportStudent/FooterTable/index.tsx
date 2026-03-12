import * as S from './styles';

export function FooterTable() {
  return (
    <S.Container>
      <div>
        <div>
          <span style={{background: '#E0F1E0'}} />
          Resposta Certa
        </div>

        <div>
          <span style={{background: '#FFCACA'}} />
          Resposta Errada
        </div>
      </div>
    </S.Container>
  )
}