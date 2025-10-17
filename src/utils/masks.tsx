export const maskCEP = (value) => {
  if (!value)
    return;
  return value.replace(/\D/g, '')
  .replace(/(\d{5})(\d)/, '$1-$2')
  .replace(/(-\d{3})\d+?$/, '$1')
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

export const maskPhoneCountry = (value) => {
  // Garante que começa sempre com +55
  if(!value) return "+55";
  let onlyNumbers = value?.replace(/\D/g, ""); // só números
  if(onlyNumbers === '5') return "+55";
  if (!onlyNumbers?.startsWith("55")) {
    onlyNumbers = "55" + onlyNumbers; // força o +55
  }

  // Remove o +55 para tratar só o resto (DDD + número)
  let rest = onlyNumbers?.slice(2);

  // Monta a máscara
  let masked = "+55";
  if (rest.length > 0) {
    masked += " (" + rest?.substring(0, 2); // DDD
    if (rest.length >= 2) masked += ")";
  }
  if (rest.length > 2) {
    masked += " " + rest?.substring(2, 7); // primeira parte do número
  }
  if (rest.length > 7) {
    masked += "-" + rest?.substring(7, 11); // segunda parte
  }

  return masked;       // fixo 8 dígitos
}