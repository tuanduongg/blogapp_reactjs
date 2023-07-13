/* eslint-disable import/no-unresolved */
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Stack, Pagination, TextField, InputAdornment, Button, Box } from '@mui/material';
//
import ModalAddPost from 'src/components/post/ModalAddPost';
import showConfirm from 'src/utils/confirmDialog';
import ModalLogin from 'src/components/authentication/ModalLogin';
import Iconify from '../components/iconify';
import { sendRequest } from '../utils/restfulAPI';
import DetailPost from '../components/post/DetailPost';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
import routerApi from '../config/routesApi';

const ROW_PERPAGE = 16;
// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Mới nhất' },
  // { value: 'popular', label: 'Phổ biến' },
  { value: 'oldest', label: 'Cũ nhất' },
];



// ----------------------------------------------------------------------

export default function BlogPage() {
  const [openModal, setOpenModal] = useState(false);
  const [idPostSelect, setIdPostSelect] = useState('');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [dataPost, setDataPost] = useState(null);
  const [search, setSearch] = useState('');
  const timerRef = useRef(null);
  const [openModalPost, setOpenModalPost] = useState(false);
  const [commentDelete, setCommentDelete] = useState(null);
  const [dataUser, setDataUser] = useState(
    localStorage.getItem('DATA_USER_BLOG') ? JSON.parse(localStorage.getItem('DATA_USER_BLOG')) : null
  );
  const [openModalAuth, setOpenModalAuth] = useState(false);
  const [typeSort, setTypeSort] = useState('latest');

  const openModalAddPost = (e, postSelect) => {
    setDataPost(postSelect);
    setOpenModal(true);
  };
  const showModal = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setOpenModalPost(true);
    } else {
      setOpenModalAuth(true);
    }
  };

  const getDataPosts = async () => {
    const obj = {
      page,
      rowPerpage: ROW_PERPAGE,
      search,
      sort:typeSort
    };
    const response = await sendRequest('post', routerApi.LIST_POST, obj);
    if (response?.statusCode === 200) {
      const data = response?.data;
      setPosts(data?.posts ?? []);
      setTotalPage(data?.total);
    }
  };
  useEffect(() => {
    getDataPosts();
  }, [page,typeSort]);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const onChangeSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (timerRef) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(async () => {
      const obj = {
        page,
        rowPerpage: ROW_PERPAGE,
        search: value,
      };
      const response = await sendRequest('post', routerApi.LIST_POST, obj);
      if (response?.statusCode === 200) {
        const data = response?.data;
        setPosts(data?.posts ?? []);
        setTotalPage(data?.total);
      }
    }, 1000);
  };

  const onCloseModal = () => {
    setDataPost('');
    setOpenModal(false);
  };
  const onCloseModalPost = (e, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setOpenModalPost(false);
    setDataPost('');
  };
  const onClickEditPost = (post) => {
    setDataPost(post);
    setOpenModalPost(true);
  };
  const actionDelete = async (id) => {
    const res = await sendRequest('delete', routerApi.DELETE_POST, { id });
    if (res?.statusCode === 200) {
      showConfirm({
        title: 'Thông báo',
        noLabel: 'Đóng',
        message: 'Xoá bài viết thành công!',
        noAction: getDataPosts,
      });
    } else {
      showConfirm({
        title: 'Thông báo',
        noLabel: 'Đóng',
        message: 'Xoá bài viết không thành công!',
      });
    }
  };

  const onClickDeletePost = (post) => {
    if (post) {
      showConfirm({
        title: 'Thông báo',
        yesLabel: 'Có',
        yesAction: async () => {
          actionDelete(post?._id);
        },
        noLabel: 'Không',
        message: 'Bạn chắc chắn muốn xoá bài viết',
      });
    }
  };
  const onEmptyUser = () => {
    setOpenModalAuth(true);
  };
 const onSort = (type) => {
  setTypeSort(type);
 }
  return (
    <>
      <Helmet>
        <title> Blog app</title>
      </Helmet>

      <Container>
        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          {/* <BlogPostsSearch posts={POSTS} /> */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={onChangeSearch}
              sx={{ marginRight: '10px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
            <BlogPostsSort  onSort={onSort} options={SORT_OPTIONS} />
          </Box>
          <Box sx={{ marginBottom: '10px', display: 'flex', justifyContent: 'end' }}>
            <Button variant="contained" onClick={showModal} startIcon={<Iconify icon="eva:plus-fill" />}>
              Tạo bài viết mới
            </Button>
          </Box>
        </Stack>

        <Grid container spacing={3}>
          {posts.map((post, index) => (
            <BlogPostCard
              key={post._id}
              idPost={post._id}
              onOpenDetailModal={openModalAddPost}
              post={post}
              index={index}
              dataUser={dataUser}
              onClickEdit={onClickEditPost}
              onClickDelete={onClickDeletePost}
            />
          ))}
          <Grid item sx={{ display: 'flex', justifyContent: 'center' }} xs={12}>
            <Pagination count={totalPage} page={page} onChange={handleChangePage} />
          </Grid>
        </Grid>
      </Container>
      <DetailPost
        onEmptyUser={onEmptyUser}
        dataUser={dataUser}
        show={openModal}
        post={dataPost}
        onCloseModal={onCloseModal}
      />
      <ModalAddPost
        data={dataPost}
        open={openModalPost}
        afterSave={async () => {
          await getDataPosts();
        }}
        handleClose={onCloseModalPost}
      />
      <ModalLogin
        open={openModalAuth}
        afterSave={() => {
          setOpenModal(false);
          setOpenModalAuth(false);
        }}
        handleClose={() => {
          setOpenModalAuth(false);
        }}
      />
    </>
  );
}
