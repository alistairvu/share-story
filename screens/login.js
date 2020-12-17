const style = `
<style>
.login-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  background: url("./assets/background-alps.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: flex-end;
}

#login-form {
  width: 30%;
  background: #fff;
  height: 100vh;
  padding: 0px 20px;
}

h1 {
  text-align: center;
  color: #333;
}

.button-container {
  width: 100%;
  display: flex;
  text-align: center;
}

button {
  background: #63a4ff;
  border-radius: 5px;
  color: white;
  padding: 10px 15px;
  margin: 0 auto;
  position: relative;
  left: 50%;
  transform: translate(-50%);
}

#redirect-container {
  margin-top: 15px;
}

#redirect {
  color: black;
  text-decoration: underline;
}

#redirect:hover {
  color: blue;
  cursor: pointer
}
</style>
`
import { redirect } from "../index.js"
import { getDataFromDoc, saveToLocalStorage } from "../utils.js"
const collection = firebase.firestore().collection("users")

class LoginScreen extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this._shadowRoot.innerHTML = `
    ${style}
  <div class="login-container">
    <form id="login-form">
      <h1>LOGIN</h1>
      <input-wrapper id="email" type="email" placeholder="Email" error=""/></input-wrapper>
      <input-wrapper id="password" type="password" placeholder="Password" error=""/></input-wrapper>
      <div id="button-container">
        <button type="submit">Log in</button>
      </div>
      <p id="redirect-container">No account yet? Click <a id="redirect">here</a> to create an account.</p>

    </form>
  </div>
      `

    const loginForm = this._shadowRoot.getElementById("login-form")

    this._shadowRoot
      .getElementById("redirect")
      .addEventListener("click", () => redirect("register"))

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = this._shadowRoot.getElementById("email").value
      const password = this._shadowRoot.getElementById("password").value
      let isValid = true

      if (email.trim().length === 0) {
        this.setError("email", "Please type in a valid email.")
        isValid = false
      } else {
        this.setError("email", "")
      }

      if (password.trim().length === 0) {
        this.setError("password", "Please type in a valid password.")
        isValid = false
      } else {
        this.setError("password", "")
      }

      if (!isValid) {
        return
      }

      const checkEmail = await this.checkEmailExists(email)

      if (!checkEmail) {
        this.setError("email", "No account with email found.")
        return
      }

      const res = await collection.where("email", "==", email).get()
      const docs = res.docs
      const doc = docs[0]
      const user = getDataFromDoc(doc)
      const verify =
        user.password === CryptoJS.MD5(password).toString(CryptoJS.enc.Base64)

      if (verify) {
        alert("Login success")
        redirect("story")
        saveToLocalStorage("currentUser", JSON.stringify(user))
      } else {
        this.setError("password", "Wrong password.")
      }
    })
  }

  setError(id, message) {
    this._shadowRoot.getElementById(id).setAttribute("error", message)
  }

  // if email exists -> true
  async checkEmailExists(email) {
    const res = await collection.where("email", "==", email).get()
    return !res.empty
  }
}

window.customElements.define("login-screen", LoginScreen)
