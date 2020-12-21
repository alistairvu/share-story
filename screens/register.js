const style = `
<style>
.register-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  background: url("./assets/background-alps.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: flex-end;
}

#register-form {
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
const collection = firebase.firestore().collection("users")

class RegisterScreen extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this._shadowRoot.innerHTML = `
    ${style}
  <div class="register-container">
    <form id="register-form">
      <h1>SIGN UP</h1>
      <input-wrapper id="first-name" type="text" placeholder="First name" error=""></input-wrapper>
      <input-wrapper id="last-name" type="text" placeholder="Last name" error=""/></input-wrapper> 
      <input-wrapper id="email" type="email" placeholder="Email" error=""/></input-wrapper>
      <input-wrapper id="password" type="password" placeholder="Password" error=""/></input-wrapper>
      <input-wrapper id="confirm-password" type="password" placeholder="Confirm password" error=""/></input-wrapper>
      <div id="button-container">
        <button type="submit">Sign up</button>
      </div>
      <p id="redirect-container">Already registered? Click <a id="redirect">here</a> to log in.</p>
    </form>
  </div>
      `

    const registerForm = this._shadowRoot.getElementById("register-form")

    this._shadowRoot
      .getElementById("redirect")
      .addEventListener("click", () => router.navigate("/login"))

    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const firstName = this._shadowRoot.getElementById("first-name").value
      const lastName = this._shadowRoot.getElementById("last-name").value
      const email = this._shadowRoot.getElementById("email").value
      const password = this._shadowRoot.getElementById("password").value
      const confirmPassword = this._shadowRoot.getElementById(
        "confirm-password"
      ).value
      let isValid = true

      if (firstName.trim().length === 0) {
        this.setError("first-name", "Please type in a valid first name.")
        isValid = false
      } else {
        this.setError("first-name", "")
      }

      if (lastName.trim().length === 0) {
        this.setError("last-name", "Please type in a valid last name.")
        isValid = false
      } else {
        this.setError("last-name", "")
      }

      const checkEmail = await this.checkEmailExists(email)

      if (!/\S+@\S+\.\S+/.test(email)) {
        this.setError("email", "Please type in a valid email.")
        isValid = false
      } else if (checkEmail) {
        this.setError("email", "Email is already in use!")
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

      if (confirmPassword.trim().length === 0) {
        this.setError("confirm-password", "Please type in a valid password.")
        isValid = false
      } else if (password !== confirmPassword) {
        this.setError("confirm-password", "Passwords do not match.")
        isValid = false
      } else {
        this.setError("confirm-password", "")
      }

      if (!isValid) {
        return
      }

      const time = new Date()

      const newUser = {
        name: `${firstName} ${lastName}`,
        email: email,
        password: CryptoJS.MD5(password).toString(CryptoJS.enc.Base64),
        timeStamp: +new Date(),
        timestampStr: time.toISOString(),
      }
      console.log(newUser)
      // if email exists -> true, alert that email is already in use
      collection.add(newUser)
      alert("Registration successful!")
      router.navigate("/login")
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

window.customElements.define("register-screen", RegisterScreen)
