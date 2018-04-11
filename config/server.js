module.exports = {
  port: 3000,
  host: "localhost",
  cookie_key: "sid-example",
  cookie_psw: "password-should-be-32-characters",
  cache_expires: 3 * 24 * 60 * 60 * 1000,
  redirectTo: false // 验证失败时的跳转页面; false，返回401; "/login",跳转到登录页
};
