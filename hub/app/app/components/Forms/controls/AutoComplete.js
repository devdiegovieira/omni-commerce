import React from 'react'
import { FormControl, FormHelperText, InputAdornment } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { mergeClasses } from '@material-ui/styles';
import { makeStyles, alpha } from '@material-ui/core/styles';
import { endOfWeekWithOptions } from 'date-fns/fp';

const useStyles = makeStyles((theme) => ({
  inputBase: {
    marginBottom: 0
  },
}));

export default function AutoComplete(props) {
  const classes = useStyles();
  const { name, label, value, error = null, multiple, onChange, options = [], inputProps, ...others } = props;


  return (
    <FormControl
      variant="standard"
      {...(error && { error: true })}
      style={{marginTop: 5}}
    >

      <Autocomplete
        multiple={multiple || false}
        id="tags-standard"
        options={options.map(m => m.title)}
        name={name}
        noOptionsText={'Sem opções'}
        value={value != undefined ? options.find(f => f.id == value) ? options.find(f => f.id == value).title : value : ''}
        onChange={(e) => {
          onChange({
            target: {
              name,
              value: options.find(f => f.title == e.target.innerText) ? options.find(f => f.title == e.target.innerText).id : e.target.defaultValue
            }
          })
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{ ...params.inputProps, ...inputProps, className: classes.inputBase }}
            InputProps={{ ...params.InputProps, endAdornment: { ...params.InputProps.endAdornment, props: { ...params.InputProps.endAdornment.props, style: { paddingTop: 0 } } } }}
            fullWidth
            name={name}
            label={label}
            {...others}
            style={{marginTop: 0, marginBottom: 0, height:50}}
          />
        )}
        {...others}
      />

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}
