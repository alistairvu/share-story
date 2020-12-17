import { getItemLocalStorage } from "../utils.js"
const collection = firebase.firestore().collection("posts")

const styles = `
  #create-post {
    width: 60%;
    margin: auto;
    margin-top: 20px;
    text-align: right;
  }

  #create-post textarea {
    width: 100%;
    border 1px solid #dbdbdb;
    border-radius: 10px;
    resize: none;
    outline: none;
    font-family: sans-serif;
  }

  .post {
    background-color: #5e8ac2;
    color: #fff;
    padding: 10px 15px;
    border-radius: 5px;
  }
`

class CreatePost extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this._shadowRoot.innerHTML = `
    <style>
    ${styles}
    </style>
    <form id="create-post" style="width: 60%; text-align:center; margin: auto; margin-top: 20px;">
      <textarea name="content" rows="6" id="content"/></textarea>
      <button class="post" id="post-btn">Post</button>
    </form>
      `

    const postForm = this._shadowRoot.getElementById("create-post")

    postForm.addEventListener("submit", this.uploadPost)
  }

  uploadPost(e) {
    e.preventDefault()
    const content = e.target.content.value
    if (content.trim() === "") {
      alert("Please enter something in the input form!")
    } else {
      const user = getItemLocalStorage("currentUser")
      const data = {
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        createdRaw: new Date(),
        authorName: user.name,
        content: content,
        comments: [],
        isShown: true,
      }
      collection.add(data)
      e.target.reset()
    }
  }
}

window.customElements.define("create-post", CreatePost)
