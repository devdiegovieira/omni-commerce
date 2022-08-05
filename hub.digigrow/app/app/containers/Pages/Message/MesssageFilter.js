import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import React, { useState, useCallback, useEffect } from 'react';
import { Form, useForm } from "../../../components/Forms/useForm";
import Controls from "../../../components/Forms/controls";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  grid: {
    paddingRight: 5,
    paddingLeft: 5,
  },
  gridContainer: {
    marginTop: -30,
    padding: 10,
  },
}));

export default function MessageFilter(props) {
  const classes = useStyles();
  let {
    
    filter,
    setFilter,
  } = props;

  const submit = () => {
    setFilter(values)

  }

  const [state, setState] = useState("");
  const [debouncedState, setDebouncedState] = useState("");

  useEffect(() => submit(), [debouncedState]);

  const handleChange = (event) => {
    setState(event.target.value);
    debounce(event.target.value);
  };

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit
  } = useForm(filter, true, submit, [])

  const debounce = useCallback(
    _.debounce((_searchVal) => {
      setDebouncedState(_searchVal);
      // console.log(_searchVal)
      // send the server request here		
    }, 1000),
    []
  );



  return (
    <Form onSubmit={handleSubmit}>
        <Grid container className={classes.gridContainer}>

          <Grid item xs={12} sm={12} md={12} className={classes.grid}>

            <Grid item xs={12} sm={12} md={12} justifyContent="center">
              <Controls.Input
                name="filter"
                label= 'Digite aqui a conversa ou nome do cliente ...'
                value={values.filter}
                onChange={e => {
                  handleInputChange(e)
                  handleChange(e)
                }}
                error={errors.filter}
              />
            </Grid>

          </Grid>

        </Grid>
    </Form>
  )

};