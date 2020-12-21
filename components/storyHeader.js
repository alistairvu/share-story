const styles = `
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Raleway&display=swap"
  rel="stylesheet"
/>
<style>
      .container {
        background: rgb(228,184,169);
        background: linear-gradient(90deg, rgba(228,184,169,1) 0%, rgba(141,125,166,1) 50%, rgba(94,139,195,1) 100%);
        display: flex;
        height: 60px;
        justify-content: space-between;
        align-items: center;
        padding: 0 10%;
      }

      .logo,
      .user-info {
        display: flex;
        align-items: center;
      }

      .branch {
        font-size: 1rem;
        color: #ffffff;
        margin-left: 10px;
        font-family: "Raleway", sans-serif;
        font-weight: 600;
      }

      .user-info {
        font-size: 1.8rem;
        color: #ffffff;
      }
      .btn {
        background-color: transparent;
        border: none;
        margin-left: 20px;
        font-size: 1.8rem;
        cursor: pointer;
        outline: none;
        color: #ffffff;
      }
    </style>`

import { removeFromLocalStorage } from "../utils.js"

class StoryHeader extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this._shadowRoot.innerHTML = `
    ${styles}
    <div class="container">
    <div class="logo">
      <img
        src="assets/polygon-s-transparent.png"
        alt=""
        width="40px"
        height="40px"
      />
      <div class="branch">Share story</div>
    </div>
    <div class="user-info">
      <div class="avatar">
        <i class="fa fa-user-circle-o" aria-hidden="true"></i>
      </div>
      <button class="btn" id="logout-btn">
        <i class="fa fa-sign-out" aria-hidden="true"></i>
      </button>
    </div>
  </div>
    `

    this._shadowRoot
      .getElementById("logout-btn")
      .addEventListener("click", () => {
        removeFromLocalStorage("currentUser")
        router.navigate("/login")
      })
  }
}

window.customElements.define("story-header", StoryHeader)
