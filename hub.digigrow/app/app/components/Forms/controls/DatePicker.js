import React from 'react'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { FormControl } from '@material-ui/core';

export default function DatePicker(props) {

  const { name, label, value, error = null, onChange, opCalendar , ...others} = props


  const convertToDefEventPara = (name, value) => {
    return {
      target: {
        name, value
      }
    }
  }

  return (
    <FormControl style={{ marginTop: 5}}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} >
        <KeyboardDatePicker
          variant='dialog'
          label={label}
          KeyboardButtonProps={{ onClick: ()=> opCalendar() }}
          format="dd/MM/yyyy"
          name={name}
          open={false}
          value={value || null}
          onChange={date => onChange(convertToDefEventPara(name, date))}
          fullWidth
          {...(error && { error: true, helperText: error })}
          {...others}
          style={{ marginTop: 0 }}
        />
      </MuiPickersUtilsProvider>
    </FormControl>
  )
}
