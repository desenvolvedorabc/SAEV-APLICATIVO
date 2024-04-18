export const maskCEP = (value) => {
  if (!value)
    return;
  return value
  .replace(/\D/g, '')
  .replace(/(\d{5})(\d)/, '$1-$2')
}

export const maskCPF = (value) => {
  if (!value)
    return;
  return value.replace(/\D/g,"").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2")
}

export const maskPhone = (value) => {
  if (!value)
    return;
  return value.replace(/\D/g,"").replace(/(\d{0})(\d)/,"$1($2").replace(/(\d{2})(\d)/,"$1)$2").replace(/(\d{5})(\d)/,"$1-$2")
}