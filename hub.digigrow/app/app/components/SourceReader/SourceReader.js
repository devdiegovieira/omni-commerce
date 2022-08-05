import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Axios from 'axios';
import { connect } from 'react-redux';
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/prism-light';
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import lightStyle from 'react-syntax-highlighter/styles/prism/coy';
import darkStyle from 'react-syntax-highlighter/styles/prism/atom-dark';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import LinearProgress from '@material-ui/core/LinearProgress';
import Code from '@material-ui/icons/Code';
import Close from '@material-ui/icons/Close';
import Icon from '@material-ui/core/Icon';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import codePreview from '../../config/codePreview';

const url = '/api/docs?src=';

const styles = theme => ({
  button: {
    margin: '8px 5px',
  },
  iconSmall: {
    fontSize: 18,
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  source: {
    textAlign: 'left',
    overflow: 'hidden',
    height: 0,
    position: 'relative',
    transition: 'all .5s',
    margin: '0 -10px',
    '& pre': {
      paddingTop: '80px !important'
    }
  },
  preloader: {
    position: 'absolute',
    top: 36,
    left: 0,
    width: '100%'
  },
  open: {
    height: 'auto',
    minHeight: 20,
  },
  src: {
    padding: 10,
    position: 'absolute',
    top: 10,
    left: 0,
    zIndex: 1,
    fontFamily: 'monospace',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    '& span': {
      fontSize: 12,
    },
    '& p': {
      color: 'grey',
      '& span': {
        marginRight: 5,
        top: 3,
        position: 'relative'
      }
    }
  },
  toggleContainer: {
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

function SourceReader(props) {
  const {
    classes,
    componentName,
    mode
  } = props;
  const [raws, setRaws] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState(mode);

  const sourceOpen = () => {
    setLoading(true);
  };

  const handleStyle = (event, value) => {
    setStyle(value);
  };

  useEffect(() => {
    if (loading) {
      Axios.get(url + componentName).then(result => {
        setRaws(result.data.records);
        setLoading(false);
      });

      setOpen(!open);
    }
  }, [loading]);

  registerLanguage('jsx', jsx);
  if (!codePreview.enable) { return false; }
  return (
    <div>
      <Button onClick={sourceOpen} color="secondary" className={classes.button} size="small">
        { open ? (
          <Close className={classNames(classes.leftIcon, classes.iconSmall)} />
        ) : (
          <Code className={classNames(classes.leftIcon, classes.iconSmall)} />
        )}
        { open ? 'Hide Code' : 'Show Code' }
      </Button>
      <section dir="ltr" className={classNames(classes.source, open ? classes.open : '')}>
        <div className={classes.src}>
          <p>
            <Icon className="description">description</Icon>
            src/app/
            {componentName}
          </p>
          <div className={classes.toggleContainer}>
            <ToggleButtonGroup value={style} exclusive onChange={handleStyle}>
              <ToggleButton value="light">
                Light
              </ToggleButton>
              <ToggleButton value="dark">
                Dark
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
        {loading && (
          <LinearProgress color="secondary" className={classes.preloader} />
        )}
        {raws.map((raw, index) => ([
          <div key={index.toString()}>
            <SyntaxHighlighter language="jsx" style={style === 'dark' ? darkStyle : lightStyle} showLineNumbers="true">
              {raw.source.toString()}
            </SyntaxHighlighter>
          </div>
        ]))}
      </section>
    </div>
  );
}

SourceReader.propTypes = {
  componentName: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
};

const reducer = 'ui';
const mapStateToProps = state => ({
  mode: state.getIn([reducer, 'type']),
});

const AppMapped = connect(
  mapStateToProps,
)(SourceReader);

export default withStyles(styles)(AppMapped);