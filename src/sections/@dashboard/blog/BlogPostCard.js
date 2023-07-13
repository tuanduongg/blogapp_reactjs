import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, CardContent, Tooltip } from '@mui/material';
// utils
import MoreVertIcon from '@mui/icons-material/MoreVert';
//

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import Iconify from '../../../components/iconify';
import { fDate } from '../../../utils/formatTime';
import DetailPost from '../../../components/post/DetailPost';

// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: '14px',
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

const checkIsHeart = (id) => {
  if (id) {
    const arrInLocalStorage = localStorage.getItem('HEARTS');
    if (arrInLocalStorage) {
      const arr = arrInLocalStorage.split(',');
      const isConaint = arr.find((item) => item === id);
      if (isConaint) return true;
    }
    return false;
  }
  return false;
};

const convertThoiGian = (timeParam) => {
  const now = new Date().getTime();
  const timeInput = new Date(timeParam).getTime();

  const timeRs = Math.round(Math.abs(now - timeInput) / 1000 / 60);

  if (timeRs < 1) {
    return 'vừa mới đây';
  }
  if (timeRs === 1) {
    return '1 phút trước';
  }
  if (timeInput > now) {
    return timeRs > 60 ? `${Math.floor(timeRs / 60)} giờ sau` : `${timeRs} phút sau`;
  }
  return timeRs > 60 ? timeRs / 60 > 24 ? `${Math.floor(timeRs / 60 / 24)} ngày trước`  :`${Math.floor(timeRs / 60)} giờ trước` : `${timeRs} phút trước`;
};

export default function BlogPostCard({ post, index, onOpenDetailModal, dataUser, onClickEdit ,onClickDelete}) {
  const { title, heart, createdAt, _id, author } = post;
  const [heartCheck, setHeartCheck] = useState(checkIsHeart(_id));
  const latestPostLarge = index === -1;
  const latestPost = index === -2 || index === -4;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const setPostEnjoy = (type) => {
    let arrRs = [];
    const arrInLocalStorage = localStorage.getItem('HEARTS');
    if (arrInLocalStorage) {
      arrRs = arrInLocalStorage.split(',');
      if (type) {
        arrRs.push(_id);
      } else {
        arrRs = arrRs.filter((idPost) => idPost !== _id);
      }
    } else if (type) arrRs.push(_id);
    localStorage.setItem('HEARTS', arrRs.toString());
  };

  const POST_INFO = [
    { id: 'created_at', number: convertThoiGian(createdAt), icon: 'eva:clock-outline' },
    {
      id: 'heart',
      number: heart,
      icon: 'eva:heart-outline',
      onclick: () => {
        setHeartCheck(!heartCheck);
        // setPostEnjoy(value);
      },
    },
  ];

  useEffect(() => {
    setPostEnjoy(heartCheck);
  }, [heartCheck]);

  return (
    <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      <Card sx={{ position: 'relative' }}>
        <CardContent
          sx={{
            ...((latestPostLarge || latestPost) && {
              bottom: 0,
              width: '100%',
              position: 'absolute',
            }),
          }}
        >
          {(dataUser?.role === 'admin' || dataUser?._id === author) && (
            <Tooltip title="Bài viết của bạn">
              <MoreHorizIcon onClick={handleClick} sx={{ float: 'right', cursor: 'pointer' }} />
            </Tooltip>
          )}
          <StyledTitle
            color="inherit"
            variant="subtitle2"
            underline="hover"
            sx={{
              ...(latestPostLarge && { typography: 'h5', height: 60 }),
              ...((latestPostLarge || latestPost) && {
                color: 'common.white',
              }),
              cursor: 'pointer',
            }}
            onClick={(e) => {
              onOpenDetailModal(e, post);
            }}
          >
            {title}
          </StyledTitle>

          <StyledInfo>
            {POST_INFO.map((info, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  ml: index === 0 ? 0 : 1.5,
                  ...((latestPostLarge || latestPost) && {
                    color: 'grey.500',
                  }),
                }}
              >
                <Iconify
                  icon={info.icon}
                  sx={{ width: 16, height: 16, mr: 0.5, color: info?.id === 'heart' && heartCheck ? 'red' : '' }}
                  onClick={info?.onclick}
                />
                <Typography variant="caption">{info.number}</Typography>
              </Box>
            ))}
          </StyledInfo>
        </CardContent>
      </Card>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onClickEdit(post);
          }}
        >
          <EditIcon sx={{ fontSize: '20px', marginRight: '5px' }} />
          Sửa
        </MenuItem>
        <MenuItem onClick={() => {
            setAnchorEl(null);
            onClickDelete(post);
          }}>
          <DeleteIcon sx={{ fontSize: '20px', marginRight: '5px' }} />
          Xoá
        </MenuItem>
      </Menu>
    </Grid>
  );
}
