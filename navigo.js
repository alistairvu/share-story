var root = null
var useHash = true // Defaults to: false
var hash = "#!" // Defaults to: '#'
var router = new Navigo(root, useHash, hash)
import { getItemLocalStorage } from "./utils.js"
router
  .on({
    "/login": function () {
      redirect("login")
    },
    "/register": function () {
      redirect("register")
    },
    "/story": function () {
      redirect("story")
    },
    "/*": function () {
      router.redirect("/login")
    },
  })
  .resolve()

export function redirect(screenName) {
  const rootElement = document.getElementById("root")
  switch (screenName) {
    case "register":
      rootElement.innerHTML = `<register-screen></register-screen>`
      break
    case "login":
      rootElement.innerHTML = `<login-screen></login-screen>`
      break
    case "story":
      rootElement.innerHTML = `<story-screen></story-screen>`
      break
    default:
      break
  }
}

checkAuthen()

async function checkAuthen() {
  try {
    const user = getItemLocalStorage("currentUser")
    const res = await firebase
      .firestore()
      .collection("users")
      .where("email", "==", user.email)
      .where("password", "==", user.password)
      .get()
    if (res.empty) {
      redirect("login")
    } else {
      redirect("story")
    }
  } catch (e) {
    redirect("login")
  }
}

window.router = router
