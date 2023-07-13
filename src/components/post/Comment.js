import { Box, Grid, Link, Paper } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
  return timeRs > 60 ? `${Math.floor(timeRs / 60)} giờ trước` : `${timeRs} phút trước`;
};

const Comment = ({ comment, onclickEdit, dataUser, onclickDelete }) => {
  const handle = () => {};
  return (
    <Paper style={{ padding: '10px 5px', marginTop: 10 }}>
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
          <AccountCircleIcon color="primary" />
        </Grid>
        <Grid justifyContent="left" item xs zeroMinWidth>
          <h4 style={{ margin: 0, textAlign: 'left' }}>{comment?.user_name}</h4>
          <p style={{ textAlign: 'left', margin: '0px' }}>{comment?.content}</p>
          <Box display="flex">
            <p style={{ textAlign: 'left', color: 'gray', margin: '5px 0px', minWidth: '26px' }}>
              {convertThoiGian(comment?.createdAt)}
            </p>
            {dataUser?.role === 'admin' ||
              (dataUser?._id === comment?.user_id && (
                <Link
                  component="button"
                  onClick={() => {
                    onclickDelete(comment);
                  }}
                  variant="body2"
                  sx={{ marginLeft: '15px' }}
                  underline="hover"
                >
                  Xoá
                </Link>
              ))}
            {dataUser?._id === comment?.user_id && (
              <Link
                component="button"
                onClick={() => {
                  onclickEdit(comment);
                }}
                variant="body2"
                sx={{ marginLeft: '15px' }}
                underline="hover"
              >
                Chỉnh sửa
              </Link>
            )}
            <Link component="button" variant="body2" sx={{ marginLeft: '15px' }} underline="hover">
              Trả lời
            </Link>
          </Box>
          {/* <Paper style={{ padding: '10px 5px' }}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item>
                <AccountCircleIcon color="primary" />
              </Grid>
              <Grid justifyContent="left" item xs zeroMinWidth>
                <h4 style={{ margin: 0, textAlign: 'left' }}>Người lạ ơi 2</h4>
                <p style={{ textAlign: 'left', margin: '0px' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean luctus ut est sed faucibus. Duis
                  bibendum ac ex vehicula laoreet. lectus vitae ex.{' '}
                </p>
                <Box display="flex">
                  <p style={{ textAlign: 'left', color: 'gray', margin: '5px 0px', minWidth: '26px' }}>10 phút trước</p>
                  <Link component="button" variant="body2" sx={{ marginLeft: '15px' }} underline="hover">
                    Trả lời
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </Paper> */}
        </Grid>
      </Grid>
    </Paper>
  );
};
export default Comment;
