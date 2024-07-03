import React from 'react'
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FormControl } from '@material-ui/core';


export default function AutoComplete(props) {
  const { name, label, value, error = null, multiple, onChange, options = [], ...others } = props;

  return (
    <FormControl
      // variant="outlined"
      {...(error && { error: true })}
    >

      <Autocomplete
        id="autocomplete"
        value={value || ''}
        onChange={onChange}
        options={options}
        getOptionSelected={option => {
          option.title.toString()
        }}
        // style={{ width: 300, marginBottom: 32 }}
        renderInput={params => (
          <TextField
            InputProps={{
              ...params.InputProps,
              classes: {
                input: {
                  padding: 10,
                  fontSize: 12,
                },
              }
            }}
            {...params}
            label={label}
            required
            autoFocus
            // variant="outlined"
            {...(error && { error: true, helperText: error })}
            {...others}
          />
        )}
        {...(error && { error: true, helperText: error })}
        {...others}
      />
    </FormControl>
  )
}

