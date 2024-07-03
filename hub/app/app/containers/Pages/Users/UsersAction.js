import { Grid } from "@material-ui/core";
import React, { useState } from 'react';
import ButtonDefault from "../../../components/Button/ButtonDefault";


function UsersActions(props) {

  

  const { blockUser, unlockUser, activeSuperUser, inactiveSuperUser, rowsSelected} = props;



  return (
    <Grid container spacing={2} justifyContent='flex-end'>
      <Grid item>
        <ButtonDefault
          onClick={blockUser}
          icon={'lock'}
          label={'Bloquear Usuário'}
          disabled={rowsSelected.length == 0}
        />
      </Grid>


      <Grid item>
        <ButtonDefault
          onClick={unlockUser}
          icon={'lock_open'}
          label={'Desbloquear Usuário'}
          disabled={rowsSelected.length == 0}
        />
      </Grid>

      <Grid item>
        <ButtonDefault
          onClick={activeSuperUser}
          icon={'manage_accounts'}
          label={'Ativar SuperUser'}
          disabled={rowsSelected.length == 0}
        />
      </Grid>


      <Grid item>
        <ButtonDefault
          onClick={inactiveSuperUser}
          icon={'manage_accounts'}
          label={'Desativar SuperUser'}
          disabled={rowsSelected.length == 0}
        />
      </Grid>
    </Grid>
  )
}

export default UsersActions;