import { useState } from "react";

export default function CheckBoxInput({onChange, item}) {

  const [checked, setChecked] = useState(false)

  return (
    <input className="form-check-input" onChange={(e) => {onChange(); setChecked(!checked)}  } value={item.id} type={"checkbox"} checked={checked}/>
  );


}