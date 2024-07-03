import React, {
  useState,
  useEffect
} from 'react'
import {
  makeStyles
} from "@material-ui/core";
import { handleMessage } from '../../utils/error';

export function useForm(initialFValues, validateOnChange = false, onSubmit, requiredFields) {
  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues({...initialFValues});
  }, [initialFValues]);

  const handleInputChange = e => {
    if (e) {

      const {
        name,
        value,
        money
      } = e.target;

      let otherValues = {
        [name]: value,
      }

      if (money) otherValues[`${name}Value`] = money;

      setValues({
        ...values,
        ...otherValues
      })

      if (validateOnChange)
        validate({
          ...values,
          [name]: value
        })
    }

  }

  const resetForm = () => {
    setValues(initialFValues);
    setErrors({})
  }


  const validate = (fieldValues = values, reequireds = requiredFields) => {
    const temp = {
      // ...errors
    };
    try {
      for (let requiredField of reequireds) {

        temp[requiredField.field] =
          requiredField.rule ? requiredField.rule(fieldValues, requiredField.field) ? requiredField.message : '' :
            Object.keys(fieldValues).find(f => f == requiredField.field) && fieldValues[Object.keys(fieldValues).find(f => f == requiredField.field)] ? '' : requiredField.message;

      }

    } catch (error) {
      console.log(error);
    }

    if (Array.isArray(requiredFields) && requiredFields.length > 0) 
      setErrors({
        ...temp
      });

    return {
      valid: Object.values(temp).every(x => x == ''),
      fields: temp
    };
  };

  const handleSubmit = e => {
    e.preventDefault();

    let {
      valid,
      fields
    } = validate();
    if (valid) {
      onSubmit();
    } else {

        let messages = [];
        for (let field in fields) {
          if (fields[field] != '')
            messages.push(fields[field]);
        }
        handleMessage(messages.join('; '), {variant: 'error'})
      
    }
  }

  return {
    values,
    setValues,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm,
    validate
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiFormControl-root': {
      width: '100%',
    }
  }
}))

export const Form = (props) => {
  const classes = useStyles();
  const {
    children,
    ...other
  } = props;
  return (
    <form
      className={
        classes.root
      }
      autoComplete="off" {
      ...other
      }
    >
      {children}
    </form>
  )
}