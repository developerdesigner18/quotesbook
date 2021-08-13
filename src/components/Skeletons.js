import { Avatar, Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export const QuoteSkeleton = () => {
  return (
    <div>
      <Box display="flex" alignItems="center">
        <Box margin={1}>
          <Skeleton variant="circle">
            <Avatar />
          </Skeleton>
        </Box>
        <Box width="100%">
          <Skeleton width="100%">
            <Typography>Lorem ipsum dolor sit amet.</Typography>
          </Skeleton>
        </Box>
      </Box>
      <Skeleton variant="rect" width="100%">
        <div style={{ paddingTop: "57%" }} />
      </Skeleton>
    </div>
  );
};

export const AuthorSkeleton = () => {
  return (
    <div>
      <Box display="flex" alignItems="center">
        <Box margin={1}>
          <Skeleton variant="circle">
            <Avatar />
          </Skeleton>
        </Box>
        <Box margin={1} width="100%">
          <Skeleton variant="text" width="100%">
            <Typography>.</Typography>
          </Skeleton>
        </Box>
      </Box>
    </div>
  );
};

export const AuthorsSkeleton = () => {
  return (
    <div style={{ width: "100%", margin: "40px 20px" }}>
      <Box display="flex" alignItems="center">
        <Box margin={1}>
          <Skeleton variant="circle">
            <Avatar />
          </Skeleton>
        </Box>
        <Skeleton width="100%">
          <Typography variant="h4">.</Typography>
        </Skeleton>
      </Box>
      <Box margin={1} width="100%">
        <Skeleton width="100%">
          <Typography variant="h6">.</Typography>
        </Skeleton>
        <Skeleton width="100%">
          <Typography variant="span">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Doloremque, ut.
          </Typography>
        </Skeleton>
      </Box>
    </div>
  );
};

export const PhotoSkeleton = () => {
  return (
    <div>
      <Skeleton variant="rect" width="100%">
        <div style={{ paddingTop: "57%" }} />
      </Skeleton>
    </div>
  );
};
