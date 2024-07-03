import React from 'react'
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@material-ui/core';

export default function Select(props) {

    const { name, label, value, error = null, onChange, options, noEmpty = false, ...others } = props;

    return (
        <FormControl
            variant="standard"

            {...(error && { error: true })}
            style={{ marginTop: 5}}
        >
            <InputLabel>{label}</InputLabel>
            <MuiSelect style={{ height:34 }}
                //    variant="outlined"
                label={label}
                name={name}
                value={value != undefined ? value : ''}
                onChange={onChange}
                {...others}
            >
                {!noEmpty && <MenuItem value="">Nenhum</MenuItem>}
                {
                    options.map(
                        item => (<MenuItem key={item.id} value={item.id}>{item.title || item.name}</MenuItem>)
                    )
                }

            </MuiSelect>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    )
}
