exports.getProfile = (req, res) => {
  res.json({
    message: "User profile accessed",
    user: req.user,
  });
};

exports.adminDashboard = (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
};

exports.getProfile = (req, res) => {
  res.json({
    message: "User profile",
    user: req.user,
  });
};

exports.adminDashboard = (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
};
