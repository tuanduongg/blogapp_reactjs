export default {
  control: {
    backgroundColor: '#fff',
    fontSize: 16,
    // fontWeight: 'normal',
  },
  '&multiLine': {
    control: {
      fontFamily: 'monospace',
      minHeight: 63,
    },
    highlighter: {
      padding: 9,
      border: '1px solid transparent',
    },
    input: {
      padding: 9,
      border: '0px',
      borderBottom: '1px solid silver',
      outline: 'none',
    //   resize: 'none',
    //   whiteSpace: 'nowrap',
    //   overflowX: 'auto',
    },
  },
  '&singleLine': {
    display: 'inline-block',
    width: 180,
    highlighter: {
      padding: 1,
      border: '2px inset transparent',
    },
    input: {
      padding: 1,
      border: '2px inset',
    },
  },
  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 16,
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
};
