import React from "react";
import PropTypes from "prop-types";
import Icon from "@material-ui/core/Icon";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Card } from "@material-ui/core";

function CardStats(props) {
  let { subtitle, title, icon, color, footerIcon, footerColor, footerTitle, footerSubtitle, footer } = props;

  return (
      <Card elevation={1}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item xs={9}>
              <Grid container>
                <Grid item xs={12} style={{ fontSize: 15, display: "flex", justifyContent: "flex-start" }}>
                {subtitle}
                </Grid>
                <Grid item xs={12} style={{ fontSize: 22, display: "flex", justifyContent: "flex-start" }}>
                {title}
                </Grid>
              </Grid>
              {/* <Box
                component={Typography}
                variant="h7"
                marginBottom="0!important"
                marginTop="0!important"
              >
                
              </Box>
              <Box
                component={Typography}
                variant="h5"
                fontWeight="600!important"
                marginBottom="0!important"
                marginTop="0!important"
              >
                {title}
              </Box> */}
            </Grid>
            <Grid item xs={3} style={{display: "flex", justifyContent: "flex-end"}}>
              <Box
                width="3rem"
                height="3rem"
                padding="12px"
                textAlign="center"
                display="inline-flex"
                // alignItems="center"
                // justifyContent="center"
                borderRadius="50%"
                boxShadow="0 1px 8px 0 rgba(0,0,0, 0.14)"
                style={{backgroundColor: color}}
              >
                <Box component={() => (<Icon style={{color: "white"}} >{icon}</Icon>)} />              
              </Box>
            </Grid>
          </Grid>

          { !footer && 
            <Box
              component="p"
              fontSize=".875rem"
              marginTop="1rem"
              marginBottom="0"
              display="flex"
              alignItems="center"
              flexWrap="wrap"
            >
              <Box
                component="span"
                fontSize=".875rem"
                style={{color:footerColor}}
                marginRight=".5rem"
                display="flex"
                alignItems="center"
                fontWeight="1000!important"
              >
                <Box
                  component={() => (<Icon style={{fontSize: 16}}>{footerIcon}</Icon>)} //arrow_downward
                  width="1.5rem!important"
                  height="1.5rem!important"
                />

                {footerTitle}
              </Box>

              <Box component="span" whiteSpace="nowrap">
                {footerSubtitle}
              </Box>
            </Box>
          }

          {footer}

        </CardContent>
      </Card>
  );
}

CardStats.defaultProps = {
  color: "bgPrimaryLight",
};

CardStats.propTypes = {
  subtitle: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.oneOf([
    "bgPrimary",
    "bgPrimaryLight",
    "bgError",
    "bgErrorLight",
    "bgWarning",
    "bgWarningLight",
    "bgInfo",
    "bgInfoLight",
  ]),
};

export default CardStats;
