import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { Icon, ListItemIcon, makeStyles, Tooltip } from '@material-ui/core';


// const options = ['Create a merge commit', 'Squash and merge', 'Rebase and merge'];

export default function ButtonGroupComponent(props) {

  let { buttons = [], variant, ...others } = props;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleClick = () => {
    buttons[selectedIndex].onClick();
    // console.info(`You clicked ${buttons[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (

    <>
      <ButtonGroup ref={anchorRef} fullWidth style={{ height: 27, }} >
        <Tooltip title={buttons[selectedIndex].tooltip}>
          <Button
            style={{ fontSize:13, borderRadius: 3, padding: 4, paddingLeft: 15, paddingRight: 15, textTransform: 'none' }}
            size={"small"}
            startIcon={(<Icon>{buttons[selectedIndex].icon}</Icon>)}
            onClick={handleClick}
            variant
            disabled={buttons[selectedIndex].disabled}
            {...others}
          >{buttons[selectedIndex].title}</Button>
        </Tooltip>
        <Button style={{ width: 10, borderRadius: 3 }} {...others}
          size="small"
          variant
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper style={{ zIndex: 1500, position: 'relative' }} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {buttons.map((option, index) => (
                    <Tooltip title={option.tooltip}>

                      <MenuItem
                        key={option.title}
                        disabled={option.disabled}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        <ListItemIcon>
                          <Icon>{option.icon}</Icon>
                        </ListItemIcon>
                        {option.title}
                      </MenuItem>
                    </Tooltip>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

    </>
  );
}