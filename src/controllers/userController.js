import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const {
    body: { username, email, name, password, passwordConfirmation },
  } = req;
  // id 중복 확인
  const exist = await User.exists({ $or: [{ username }, { email }] });
  if (password !== passwordConfirmation) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "비밀번호를 잘못 입력하셨습니다.",
    });
  }
  if (exist) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "사용할 수 없는 id 및 email입니다.",
    });
  }
  await User.create({
    username,
    email,
    name,
    password,
  });
  // DB저장
  return res.redirect("/login");
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
  const {
    body: { username, password },
  } = req;
  try {
    const user = await User.findOne({ username, socialOnly: false });
    if (!user) {
      return res.status(400).render("login", {
        pageTitle: "Login",
        errorMessage: "존재하지 않는 ID 입니다.",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).render("login", {
        pageTitle: "Login",
        errorMessage: "비밀번호가 틀립니다.",
      });
    }
    req.session.user = user;
    req.session.userLoggedIn = true;
    return res.redirect("/");
  } catch (error) {
    return res
      .status(400)
      .render("login", { pageTitle: "Login", errorMessage: error });
  }
};
export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
////
export const start = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.CLIENT_ID,
    scope: "user",
  };
  const parameters = new URLSearchParams(config);
  const finalUrl = `${baseUrl}?${parameters}`;
  return res.redirect(finalUrl);
};
export const finish = async (req, res) => {
  const {
    query: { code },
  } = req;
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code,
  };
  const parameters = new URLSearchParams(config);
  const finalUrl = `${baseUrl}?${parameters}`;
  const response = await fetch(finalUrl, {
    method: "post",
    headers: {
      Accept: "application/json",
    },
  });
  const data = await response.json();
  if (!("access_token" in data)) {
    return res.status(400).redirect("/login");
  }
  const userResponse = await fetch(`https://api.github.com/user`, {
    method: "get",
    headers: {
      Accept: "application/json",
      Authorization: `token ${data.access_token}`,
    },
  });
  const userData = await userResponse.json();
  const username = userData.login;

  let user = await User.findOne({ username, socialOnly: true });
  if (!user) {
    //가입되어 있지 않다면 가입
    let email = userData.email;
    if (!email) {
      const getEmail = await fetch(`https://api.github.com/user/emails`, {
        method: "get",
        headers: {
          Accept: "application/json",
          Authorization: `token ${data.access_token}`,
        },
      });
      const userEmail = await getEmail.json();
      email = userEmail.filter(
        (item) => item.verified === true && item.visibility === "private"
      )[0].email;
    }
    const exist = await User.exists({ $or: [{ username }, { email }] });
    if (exist) {
      //존재하는 ID, email
      return res.redirect("/error");
    }
    user = await User.create({
      username,
      email,
      name: userData.name ? userData.name : userData.login,
      password: process.env.PASSWORD,
      avatarUrl: userData.avatar_url,
      socialOnly: true,
    });
  }
  req.session.user = user;
  req.session.userLoggedIn = true;
  return res.redirect("/");
};
export const getEdit = (req, res) => {
  const {
    session: {
      user: { _id, socialOnly },
    },
  } = req;
  if (socialOnly) {
    return res.redirect(`/users/${_id}`);
  }
  return res.render("userEdit", { pageTitle: "Edit User Profile" });
};
export const postEdit = async (req, res) => {
  const {
    body: { username, email, name },
    session: { user },
    file,
  } = req;

  if (user.socialOnly) {
    return res.redirect(`/users/${user._id}`);
  }
  if (username !== user.username) {
    const exists = await User.exists({ username });
    if (exists) {
      return res.status(400).render("userEdit", {
        pageTitle: "Edit User Profile",
        errorMessage: "이미 있는 ID 입니다.",
      });
    }
  }
  if (email !== user.email) {
    const exists = await User.exists({ email });
    if (exists) {
      return res.status(400).render("userEdit", {
        pageTitle: "Edit User Profile",
        errorMessage: "이미 있는 Email 입니다.",
      });
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      username,
      email,
      name,
      avatarUrl: file ? `/${file.path}` : user.avatarUrl,
    },
    { returnDocument: "after" }
  );
  req.session.user = updatedUser;
  return res.redirect(`/users/${user._id}`);
};
export const profile = async (req, res) => {
  const {
    params: { id },
  } = req;
  const userProfile = await User.findById(id).populate("videos");
  return res.render("profile", { pageTitle: "Profile", userProfile });
};
export const getChangePassword = (req, res) => {
  return res.render("changePassword", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    body: { currentPassword, updatedPassword, updatedPasswordConfirmation },
    session: {
      user: { _id },
    },
  } = req;
  if (updatedPassword !== updatedPasswordConfirmation) {
    return res.status(400).render("changePassword", {
      pageTitle: "Change Password",
      errorMessage: "비밀번호 확인",
    });
  }
  const user = await User.findById(_id);
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) {
    return res.status(400).render("changePassword", {
      pageTitle: "Change Password",
      errorMessage: "비밀번호가 틀립니다.",
    });
  }
  user.password = updatedPassword;
  req.session.user = await user.save();
  return res.redirect("/login");
};
export const remove = (req, res) => res.send("user-remove");
export const error = (req, res) => res.status(404).render("404");
