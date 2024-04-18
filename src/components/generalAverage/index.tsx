import * as S from "./styles";

type GeneralAverageProps = {
  title: string;
  min: number;
  media: number;
  max: number;
};

export function GeneralAverage({title, min, media, max }: GeneralAverageProps) {
  return (
    <S.Container>
      <p>
        {title} <br /> (Mín-Med-Max){" "}
      </p>
      <div style={{ width: "100%" }}>
        <div style={{ left: `${min}%` }} className="min">
          <p>{min}%</p>
        </div>
        <div style={{ left: `${media}%` }} className="media">
          <p>{media}%</p>
        </div>
        <div style={{ left: `${max}%` }} className="max">
          <p>{max}%</p>
        </div>
      </div>
    </S.Container>
  );
}
