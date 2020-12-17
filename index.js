import "./screens/register.js"
import "./screens/login.js"
import "./screens/story.js"
import "./components/inputWrapper.js"
import "../components/storyHeader.js"
import "../components/createPost.js"
import "../components/listPost.js"
import "../components/postItem.js"
import { getItemLocalStorage } from "./utils.js"
const rootElement = document.getElementById("root")

checkAuthen()

async function checkAuthen() {
  const user = getItemLocalStorage("currentUser")
  if (user === null) {
    redirect("login")
    return
  }
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
}

export function redirect(screenName) {
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
