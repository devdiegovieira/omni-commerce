import Icon from "@material-ui/core/Icon";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';


const useStyles = makeStyles((theme) => ({
  Icon:{
    marginRight: 10
  }, 
  
  body: {
    marginTop:-15,
    paddingTop: 0,
    paddingLeft: 20,
    paddingBottom: 10,

  }
}));


export default function PriceRuleOption(props) {
  const classes = useStyles();
  let { children, title, icon } = props;


  return ( 
      <Accordion>
        <AccordionSummary
          expandIcon={<Icon color="primary">expand_more</Icon>}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Icon color="primary" className={classes.Icon}>{icon}</Icon>{title}  
        </AccordionSummary>
        <div className={classes.body} >{children} </div>
      </Accordion>
  )

};