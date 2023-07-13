import { useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import mentionStyle from './mentionStyles';
import mentionsInputStyle from './mentionsInputStyles';

const TextEditor = () => {
  const [value, setValue] = useState('');
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  console.log('value', value);
  const users = [
    {
      id: 'isaac',
      display: 'Isaac Newton',
    },
    {
      id: 'sam',
      display: 'Sam Victor',
    },
    {
      id: 'emma',
      display: 'emmanuel@nobody.com',
    },
  ];
  return (
    <div style={{ width: '100%' }}>
      <MentionsInput style={mentionsInputStyle} value={value} onChange={handleChange}>
        <Mention style={mentionStyle} data={users}>
          {({ mentionProps }) => <input type='text' {...mentionProps} rows={1} />}
        </Mention>
      </MentionsInput>
    </div>
  );
};

export default TextEditor;
