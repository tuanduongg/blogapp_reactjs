import { useState, useEffect } from 'react';
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
import { Box, TextField } from '@mui/material';
import routerApi from '../../config/routesApi';
import showConfirm from '../../utils/confirmDialog';
import { sendRequest } from '../../utils/restfulAPI';

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

const initValidate = {
  text: '',
  error: false,
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const ModalAddPost = ({ open, handleClose, data, afterSave }) => {
  const [title, setTitle] = useState('');
  const [titleValidate, setTitleValide] = useState(initValidate);
  const [contentValidate, setContentValide] = useState(initValidate);
  const [content, setContent] = useState('');
  // const [show, setShow] = useState(open);

  // useEffect(() => {
  //   setShow(open);
  // }, [open]);
  useEffect(() => {
    setTitle(data?.title ?? '');
    setContent(data?.content ?? '');
  }, [data]);

  const validateForm = () => {
    if (title.trim() === '') {
      setTitleValide({ text: 'Bắt buộc nhập tiêu đề', error: true });
      return false;
    }
    if (content.trim() === '') {
      setContentValide({ text: 'Bắt buộc nhập nội dung', error: true });
      return false;
    }
    return true;
  };
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'title':
        setTitleValide(initValidate);

        setTitle(value);
        break;
      case 'content':
        setContentValide(initValidate);

        setContent(value);
        break;

      default:
        break;
    }
  };
  const onSave = async () => {
    if (data) {
      // update
      const obj = {
        title,
        content,
        id:data._id
      };
      console.log(obj);
      const res = await sendRequest('put', routerApi.UPDATE_POST, obj);
      if (res?.statusCode === 200) {
        onClose();
        showConfirm({
          title: 'Thông báo',
          noLabel: 'Đóng',  
          noAction: () => {
            afterSave();
          },
          message: 'Chỉnh sửa bài viết thành công',
        });
      } else {
        onClose();
        showConfirm({ title: 'Thông báo', noLabel: 'Đóng', message: 'Chỉnh sửa bài viết thất bại' });
      }
    } else {
      // add
      const obj = {
        title,
        content,
      };

      const res = await sendRequest('post', routerApi.CREATE_POST, obj);
      if (res?.statusCode === 201) {
        onClose();
        showConfirm({
          title: 'Thông báo',
          noLabel: 'Đóng',  
          noAction: () => {
            afterSave();
          },
          message: 'Thêm bài viết thành công',
        });
      } else {
        onClose();
        showConfirm({ title: 'Thông báo', noLabel: 'Đóng', message: 'Thêm bài viết thất bại' });
      }
    }
  };
  const onClose = () => {
    setTitleValide(initValidate);
    setContentValide(initValidate);
    setTitle('');
    setContent('');
    handleClose();
    // setShow(false);
  };
  return (
    <>
      <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
          {!data ? ' Thêm bài viết mới' : 'Chỉnh sửa bài viết'}
        </BootstrapDialogTitle>
        <DialogContent sx={{ width: '100%' }} dividers>
          <Box sx={{ width: '100%', height: '100%' }}>
            <TextField
              sx={{ marginY: '15px' }}
              placeholder="Vui lòng nhập tiêu đề..."
              fullWidth
              id="outlined-basic"
              label="Tiêu đề"
              variant="outlined"
              value={title}
              name="title"
              onChange={onChangeInput}
              helperText={titleValidate.text}
              error={titleValidate.error}
              onBlur={validateForm}
            />
            <TextField
              helperText={contentValidate.text}
              error={contentValidate.error}
              fullWidth
              id="outlined-multiline-static"
              label="Nội dung"
              multiline
              rows={6}
              defaultValue=""
              placeholder="Vui lòng nhập nội dung..."
              value={content}
              name="content"
              onChange={onChangeInput}
              onBlur={validateForm}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" autoFocus onClick={onSave}>
            {data ? 'Cập nhật' : 'Lưu'}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default ModalAddPost;
