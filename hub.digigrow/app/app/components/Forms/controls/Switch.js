import React from 'react'
import { FormControl, FormControlLabel, Switch as MuiSwitch } from '@material-ui/core';

export default function Switch(props) {

    const { name, label, value, onChange, control: ExtControl, ...other } = props;


    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    return (
        // <FormControl style={{ marginTop: 5 }}>
            <FormControlLabel
                control={
                    ExtControl ?
                        <ExtControl
                            name={name}
                            color="primary"
                            checked={value || false}
                            onChange={e => onChange(convertToDefEventPara(name, e.target.checked))}
                            {...other}
                        /> :
                        <MuiSwitch

                            name={name}
                            color="primary"
                            checked={value || false}
                            onChange={e => onChange(convertToDefEventPara(name, e.target.checked))}
                            {...other}
                        />
                }
                label={label}
            />
        // </FormControl>
    )
}
