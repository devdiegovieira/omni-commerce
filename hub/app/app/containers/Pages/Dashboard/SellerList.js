import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Box, Grid, } from '@material-ui/core';

const styles = {
  chartFluid: {
    Width: '100%',
    height: '100%'
  }
};


function SellerList(props) {
  const { listData } = props; 

  return (

    <>
      {
        listData.map(m => {
          return (
            <ListItem>
              <ListItemAvatar>
                <Avatar src={m.sellerPic} />
              </ListItemAvatar>
              <ListItemText
                primary={m.sellerId}
                secondary={(
                  <Grid container component={Box} justifyContent='space-between' >
                    <Grid item xs={12} sm={'auto'} md={'auto'}>
                      <b style={{ fontSize: 15 }}>
                        {m.qty}

                      </b>
                    </Grid>

                    <Grid item xs={12} sm={'auto'} md={'auto'} >
                      <b >
                        {m.grossTotal.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',

                        })}
                      </b>
                    </Grid>


                  </Grid>


                )}
              />
            </ListItem>

          )
        })

      }
    </>

  );

}

SellerList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SellerList);
