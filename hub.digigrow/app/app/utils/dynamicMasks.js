
export const changeCustom = (event, maskFunction, handleInputChange) => {
  event.target.value = maskFunction(event.target.value);
  handleInputChange(event);
};


export const maskPhone = (v) => {
  let r = v.replace(/\D/g, "");
  r = r.replace(/^0/, "");
  if (r.length > 10) {
    r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (r.length > 5) {
    r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (r.length > 2) {
    r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
  } else {
    r = r.replace(/^(\d*)/, "($1");
  }
  return r ? r : '';
}

export const capitalizeFirst = (str) => {
  if (str) {
    let subst = str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    return subst ? subst : ''
  }else{
    return '';
  };
}

export const toLowerCase = (str) => {
  if (str) {
    let subst = str.toLowerCase();
    return subst ? subst : '';
  } else {
    return '';
  }
}

export const cep = (str) => {
  var re = /^([\d]{2})([\d]{3})([\d]{3})|^[\d]{2}.[\d]{3}-[\d]{3}/;

  if (re.test(str)) {
    return str.replace(re, "$1$2-$3");
  } else {
    alert("CEP inválido!");
  }

  return re;
}


export const cpfMasks = (v) => {

  v = v.replace(/\D/g, "")

  if (v.length <= 14) { //CPF
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")

  } else { //CNPJ
    v = v.replace(/^(\d{2})(\d)/, "$1.$2")
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")
    v = v.replace(/(\d{4})(\d)/, "$1-$2")

  }

  return v

}

