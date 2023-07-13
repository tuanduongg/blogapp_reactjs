import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
// eslint-disable-next-line import/no-unresolved
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Box, FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
// eslint-disable-next-line import/no-unresolved
import showConfirm from '../../utils/confirmDialog';
import { sendRequest } from '../../utils/restfulAPI';
import routerApi from '../../config/routesApi';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const inititalTitle = 'login';
const initialValidate = {
  text: '',
  error: false,
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const ModalLogin = ({ open, handleClose, afterSave }) => {
  const [title, setTitle] = useState(inititalTitle);
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validateUsername, setValidateUsername] = useState(initialValidate);
  const [validatePassword, setValidatePassword] = useState(initialValidate);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  useEffect(() => {
    setShow(open);
  }, [open]);
  const onSave = async () => {
    if (handleValidate()) {
      const obj = {
        username,
        password,
      };
      if (title === 'login') {
        localStorage.removeItem('DATA_USER_BLOG');
        localStorage.removeItem('authToken');
        const res = await sendRequest('post', routerApi.LOGIN, obj);
        if (res?.statusCode === 200) {
          const user = res?.data;
          localStorage.setItem('DATA_USER_BLOG', JSON.stringify(user));
          localStorage.setItem('authToken', user.token);

          afterSave();
          showConfirm({ message: 'Đăng nhập thành công',noLabel:'Đóng',noAction:()=>{window.location.reload()},closeOnClickOutside:true });
        }
        // call api login
      } else {
        localStorage.removeItem('DATA_USER_BLOG');
        localStorage.removeItem('authToken');
        const res = await sendRequest('post', routerApi.SIGNUP, obj);
        if (res?.statusCode === 201) {
          const user = res?.data;
          localStorage.setItem('DATA_USER_BLOG', JSON.stringify(user));
          localStorage.setItem('authToken', user.token);

          showConfirm({ message: 'Đăng ký thành công',closeOnClickOutside:true});
          afterSave();
        }
      }
    }
  };
  const handleClickSignup = () => {
    if (title === 'login') {
      setTitle('signup');
    } else {
      setTitle('login');
    }
  };
  const onClose = (e, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    handleClose();
    setPassword('');
    setUsername('');
    setShow(false);
    setTitle(inititalTitle);
    setValidateUsername(initialValidate);
    setValidatePassword(initialValidate);
  };

  const handleValidate = () => {
    let textUser = '';
    let textPassword = '';

    if (username.trim() === '') {
      textUser = 'Tên tài khoản không được để trống';
    } else if (username.length < 3) {
      textUser = 'Tên tài khoản phải ít nhất 3 ký tự';
    } else if (username.length > 50) {
      textUser = 'Tên tài khoản không quá 50 ký tự';
    }

    if (password.trim() === '') {
      textPassword = 'Mật khẩu không được để trống';
    } else if (password.length < 3) {
      textPassword = 'Mật khẩu phải ít nhất 3 ký tự';
    } else if (password.length > 50) {
      textPassword = 'Mật khẩu không quá 50 ký tự';
    }
    if (textUser !== '') {
      setValidateUsername({
        error: true,
        text: textUser,
      });
    }
    if (textPassword !== '') {
      setValidatePassword({
        error: true,
        text: textPassword,
      });
    }
    if (textUser === '' && textPassword === '') {
      return true;
    }
    return false;
  };

  const handleChangeInput = (e) => {
    const valueTarget = e.target.value;
    switch (e.target.name) {
      case 'username':
        setValidateUsername(initialValidate);
        setUsername(valueTarget);
        break;
      case 'password':
        setValidatePassword(initialValidate);
        setPassword(valueTarget);
        break;

      default:
        break;
    }
  };
  return (
    <>
      <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={show}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
          {title === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
        </BootstrapDialogTitle>
        <DialogContent sx={{ width: '100%' }} dividers>
          <Box sx={{ width: '100%', height: '100%' }}>
            <TextField
              onBlur={handleValidate}
              name="username"
              sx={{ marginY: '15px' }}
              placeholder="Vui lòng nhập tên tài khoản..."
              fullWidth
              id="outlined-basic"
              label="Tên tài khoản"
              variant="outlined"
              error={validateUsername?.error}
              value={username}
              helperText={validateUsername?.text}
              onChange={handleChangeInput}
            />
            <FormControl error={validatePassword?.error} fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
              <OutlinedInput
                helperText={validatePassword?.text}
                onBlur={handleValidate}
                name="password"
                onChange={handleChangeInput}
                value={password}
                fullWidth
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Mật khẩu"
              />
              {validatePassword?.error && <FormHelperText>{validatePassword?.text}</FormHelperText>}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClickSignup}>
            {title === 'login' ? 'Bạn chưa có tài khoản' : 'Quay lại'}
          </Button>
          <Button variant="contained" autoFocus onClick={onSave}>
            {title === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default ModalLogin;
