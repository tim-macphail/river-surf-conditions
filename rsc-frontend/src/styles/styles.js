const uniformStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  p: 4,
};

const lightStyle = {
  ...uniformStyle,
  bgcolor: "background.paper",
  color: "black",
};

const darkStyle = {
  ...uniformStyle,
  backgroundColor: "#282c34",
  color: "white",
};

module.exports = {
  lightStyle,
  darkStyle,
};
