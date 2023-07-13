/* eslint-disable import/no-unresolved */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { IconButton, Paper, TextField, Typography, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PropTypes from 'prop-types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';
import { sendRequest } from 'src/utils/restfulAPI';
import routerApi from 'src/config/routesApi';
import showConfirm from 'src/utils/confirmDialog';
import Comment from './Comment';
import TextEditor from './TextEditor';

const DetailPost = ({ show, onCloseModal, post, dataUser, onEmptyUser }) => {
  const [open, setOpen] = React.useState(show);
  const [valueComment, setValueComment] = React.useState('');
  const [typeClick, setTypeClick] = React.useState('');
  const [comments, setComments] = React.useState([]);
  const [commentSelect, setCommentSelect] = React.useState(null);
  useEffect(() => {
    setOpen(show);
  }, [show]);

  useEffect(() => {
    if (post) {
      // call api laays thoong tin post
      getCommentByPost();
    }
  }, [post]);

  const getCommentByPost = async () => {
    const res = await sendRequest('post', routerApi.LIST_COMMENT, { id: post?._id });
    if (res?.statusCode === 200) {
      setComments(res?.data ?? []);
    }
  };

  const handleComment = () => {};

  const createComment = async () => {
    if (dataUser && dataUser?._id && localStorage.getItem('authToken')) {
      const obj = {
        post_id: post?._id,
        content: valueComment,
        id: commentSelect._id,
      };
      if (typeClick === 'edit') {
        const res = await sendRequest('post', routerApi.UPDATE_COMMENT, obj);
        if (res?.statusCode === 200) {
          setValueComment('');
          setTypeClick('create');
          await getCommentByPost();
        }
      } else if (typeClick === 'create') {
        const res = await sendRequest('post', routerApi.CREATE_COMMENT, obj);
        if (res?.statusCode === 201) {
          setValueComment('');
        } else {
          console.log('error', res);
        }
        await getCommentByPost();
      }
    } else {
      onEmptyUser();
    }
  };

  const handleClose = (e, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setValueComment('');
    onCloseModal();
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2, color: '#103996', minWidth: '600px' }} {...other}>
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

  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };
  const onChangeInput = (e) => {
    setValueComment(e?.target?.value);
  };
  const handleClickEditComment = (comment) => {
    setCommentSelect(comment);
    setValueComment(comment?.content);
    setTypeClick('edit');
  };

  const handleDeleteComment = async (id) => {
    const obj = {
      id,
    };
    const res = await sendRequest('post', routerApi.DELETE_COMMENT, obj);
    if (res?.statusCode === 200) {
      showConfirm({
        message: 'Xoá bình luận thành công',
        noLabel: 'Không',
        noAction: () => {
          setOpen(true);
          getCommentByPost();
        },
      });
    }
  };
  const handleClickDelete = (comment) => {
    setCommentSelect(comment);
    console.log('comment', comment);
    setOpen(false);
    showConfirm({
      message: 'Bạn chắc chắn muỗn xoá bình luận',
      yesLabel: 'Có',
      noLabel: 'Không',
      yesAction: () => {
        handleDeleteComment(comment?._id);
      },
    });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {post?.title}
        </BootstrapDialogTitle>
        <DialogContent
          sx={{
            '&::-webkit-scrollbar': {
              width: '0.4em',
            },
            '&::-webkit-scrollbar-track': {
              boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
              webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,.1)',
            },
          }}
          dividers
        >
          <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
            <span style={{ fontFamily: 'Public Sans', color: '#212B36' }}>{post?.content}</span>
          </DialogContentText>
          <Grid container alignItems="center" sx={{ marginY: '7px' }} justifyContent="space-between" spacing={1}>
            <Grid item sx={{ display: 'flex', alignItems: 'center' }} xs={6}>
              <FavoriteIcon sx={{ marginRight: '5px', color: 'red' }} />
            </Grid>
            <Grid item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }} xs={6}>
              <CommentIcon color="primary" sx={{ marginRight: '5px' }} /> {comments?.length > 0 ? comments?.length : ''}
            </Grid>
          </Grid>
          <Divider component="div" />
          {comments?.length > 0
            ? comments.map((comment, index) => (
                <Comment
                  key={index}
                  comment={comment}
                  dataUser={dataUser}
                  onclickDelete={handleClickDelete}
                  onclickEdit={handleClickEditComment}
                />
              ))
            : null}
        </DialogContent>
        <DialogActions>
          <Grid container alignItems="center" spacing={1}>
            <Grid item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }} color="primary" xs={3}>
              <AccountCircleIcon color="primary" />
              <Typography variant="span" color="primary">
                {dataUser?.username}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                multiline
                placeholder="Nhập bình luận...."
                fullWidth
                id="standard-basic"
                label=""
                value={valueComment}
                onChange={onChangeInput}
                variant="standard"
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton
                disabled={valueComment.trim() === ''}
                onClick={createComment}
                color="primary"
                aria-label="Comment"
              >
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
          {/* <TextEditor /> */}
          {/* <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DetailPost;
