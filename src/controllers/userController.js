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
  //여기까지 잘 됨
  const username = userData.login;
  let user = await User.findOne({ username, socialOnly: true });
  if (!user) {
    //가입후 로그인
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
      console.log(userEmail);
      email = userEmail.filter(
        (item) => item.verified === true && item.visibility === "private"
      )[0].email;
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
export const profile = (req, res) => res.send("user-profile");
export const edit = (req, res) => res.send("user-edit");
export const remove = (req, res) => res.send("user-remove");
