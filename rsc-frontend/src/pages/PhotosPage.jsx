import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function PhotosPage() {
  return (
    <>
      <Typography variant="h2">Photos page</Typography>
      <Box
        component="img"
        sx={{
          width: 350,
          border: 5,
          borderRadius: 5,
        }}
        alt="river"
        src={
          "https://lh3.googleusercontent.com/ikMhZRPk7swvjx3jwm5VRcdMOexx6IKZoC7Oe0JHJKuHue6WKdpI-LZ0Gnx_yEmEYIVpoi8OaY0gzGLxjXaEf2LRa-gOC3y8xuCQZ7W20y5LVYa0Y7UvHal5hbFS-bVqzAIwJzrK_Dl1v8U6HxIRbQp24FfHqdSvv5Lip5DM-qopSY13t8S5Z6cde55WYLdbadA1UCMB8-j3iJuFwP1_GxOPr8U7xZJPlgajw0BKF9jnPBO4Y0NJXRZNZCrF9NPbL3F5bgrqaBWpmsFPnZt5UndQuNjPiuBCAgNrtREWO3O2yZuDBwpG3pvHZFWrjnIwH6dP8fLylBbvgtWSDZ1QpuHOiViQA6HE1UJ10Obr5OJcA6LeOq_E6Fkn1W0P55UkUtMnTxzJIwtGeyJjBlxEZFEOi4jx2lWDaDQmw5xURWHVWjW1Ghu-LandMfbK6VU5GNdS0t6VfqKZ_GZUyFmAr2Wd5wnwUJVg3PxLAJCYTZZHs0lvzWoHruCxKSVrD3TRNYh2KG62z_clxYwk0Zl7sfSnVlwQxicoz8SalFFwwoda0ugCAcuZUlojze34SGy6zjjttwZ5xh24T1xhvh3SEFOY-5lni7ujwxDf-io55AB26T6FUBINw89MsNBNa4EwSVTt4fI8fpe4q4eCmWvIwk8bIY8yu4CKHZjkMDQdmWL1O5-LR1cB24n__0VnH_DG71s0bX86Bu8Wpl8MulnnJukHUKdUyZcqYA8z5OoYmF6kQsS8JfircgwFH7V2-KM=w834-h625-no?authuser=0"
        }
      />
    </>
  );
}
