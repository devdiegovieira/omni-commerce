import React, { useState, useEffect } from 'react'
import { FormControl, TextField } from '@material-ui/core';
import InputMask from "react-input-mask";
import { number } from 'prop-types';

export default function Input(props) {

  const { name, label, value, error = null, onChange, onClick, mask, money, max, min, length, cubic = false, maxWei = false, ...others } = props;

  const inputChange = (e) => {
    // if (max && e.target.value && Number(e.target.value) > max) 
    //   e.target.value = String(max) 

    if (cubic && Number(e.target.value) > 70) { e.target.value = 70 }
    if (maxWei && Number(e.target.value) > 30000) { e.target.value = 30000 }

    if ((min || min == 0) && e.target.value && Number(e.target.value) < min)
      e.target.value = String(min)

    if (max || ((length || length == 0) && e.target.value && e.target.value.length > length))
      e.target.value = Number(e.target.value) - 1 == max ? String(max) : e.target.value.substring(0, length || String(max).length);

    if (money) {
      e.target.value = e.target.value.replace(/\D/g, "");
      // if (e.target.value == 'R$ ,') e.target.value = '';

      if (e.target.value) {
        let valueString = e.target.value.replaceAll('R$ ', '').replaceAll('.', '').replace(',', '');

        let first = valueString.substring(0, valueString.length - 2);

        if (first.length >= 3 && first.charAt(0) == '0') first = first.replace('0', '');

        let second = valueString.substring(valueString.length - 2);

        if (first == '' && second != '') first = '0'

        let newFirst = '';
        let count = 0;
        for (let index = first.length; index >= 0; index--) {
          newFirst = first.charAt(index - 1) + newFirst;
          count++;

          if (count == 3) {
            newFirst = '.' + newFirst;
            count = 0;
          }

        }

        if (newFirst.charAt(0) == '.') newFirst = newFirst.replace('.', '');

        e.target.value = `R$ ${newFirst},${second}`;
        e.target.money = Number(first + '.' + second);
      }
    }

    onChange(e);
  }

  return (
    <FormControl style={{ marginTop: 5 }}>
      <InputMask
        mask={mask || ''}
        maskChar=' '
        label={label}
        name={name}
        value={value || ''}
        onChange={inputChange}
        onClick={onClick}
        {...(error && { error: true, helperText: error })}
        {...others}

      >

        <TextField

          variant="standard"
          label={label}
          onClick={onClick}
          fullWidth
          name={name}
          value={value || ''}
          onChange={inputChange}
          {...(error && { error: true, helperText: error })}
          {...others}
          style={{ marginTop: 0 }}

        />
      </InputMask>
    </FormControl>


  )
}
