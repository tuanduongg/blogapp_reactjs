import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, Button, Typography, Snackbar, Alert } from '@mui/material';
// utils
// eslint-disable-next-line import/no-unresolved
import ModalAddPost from 'src/components/post/ModalAddPost';
// eslint-disable-next-line import/no-unresolved
import ModalLogin from 'src/components/authentication/ModalLogin';
// eslint-disable-next-line import/no-unresolved
import DetailPost from 'src/components/post/DetailPost';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../../../utils/confirmDialog';
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const [dataUser, setDataUser] = useState(
    localStorage.getItem('DATA_USER_BLOG') ? JSON.parse(localStorage.getItem('DATA_USER_BLOG')) : null
  );
  const navigate = useNavigate();
  const logout = async () => {
    await localStorage.clear();
    window.location.reload();
  };
  console.log('dataUser', dataUser);
  return (
    <StyledRoot>
      <StyledToolbar>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
          width="100%"
        >
          <Typography variant="h3" sx={{ fontFamily: 'Lobster' }} color="initial">
          What's on your mind?
          </Typography>
          {dataUser && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <Typography variant="h6" sx={{ cursor: 'pointer' }} color="initial">
                {dataUser?.username}
              </Typography>
              <Typography onClick={logout} variant="a" sx={{ cursor: 'pointer',color:'blue' }} color="initial">
                Đăng xuất
              </Typography>
            </div>
          )}
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
