import React from 'react'
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText, Checkbox, ListItemText, Input } from '@material-ui/core';

export default function MultiSelect(props) {

    const { name, label, value = [],error=null, onChange, options, ...others } = props;

    return (
        <FormControl
        // variant="outlined"
        {...(error && {error:true})}
        style={{marginTop:5}}
        >
            <InputLabel>{label}</InputLabel>
            <MuiSelect style={{ height:34 }}
                multiple
                label={label}
                name={name}
                value={value || []}
                onChange={onChange}
                input={<Input />}
                renderValue={(selected) => {
                    return `${selected.slice(0, 4).map((data) => { 
                        let option = options.find(f => f.id == data); 
                        if (option) return option.title;
                    }).join(', ')}${selected.length > 4 ? '...': ''}`}
                } 
                {...others}
            >
                {options.map((name) => (
                    <MenuItem key={name.id} value={name.id}>
                    <Checkbox checked={value.indexOf(name.id) > -1} />
                    <ListItemText primary={name.title} />
                    </MenuItem>
                ))}
            </MuiSelect>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    )
}
