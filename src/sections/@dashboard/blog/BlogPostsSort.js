import PropTypes from 'prop-types';
// @mui
import { MenuItem, TextField } from '@mui/material';
import { useState } from 'react';

// ----------------------------------------------------------------------

BlogPostsSort.propTypes = {
  options: PropTypes.array,
  onSort: PropTypes.func,
};

export default function BlogPostsSort({ options, onSort }) {
  const [selected,setSelected] = useState('latest');
  return (
    
    <TextField
      select
      size="small"
      value={selected}
      onChange={(e) => {
        setSelected(e.target.value);
        onSort(e.target.value);
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} selected={option.value === selected} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
