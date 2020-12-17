const styles = `
      .container {

        margin-bottom: 15px;
      }

      .list-posts {
        width: 60%;
        margin: auto;
      }

      .post-item {
        border: 1px solid #dbdbdb;
        padding: 20px;
        border-radius: 10px;
        font-size: 16px;
      }

      .author-name {
        font-weight: 600;
      }

      .time {
        font-size: 12px;
      }
`
import { convertDate } from "../utils.js"
class PostItem extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this.authorName = this.getAttribute("author-name")
    this.time = convertDate(this.getAttribute("time"))
    this.content = this.getAttribute("content")

    this._shadowRoot.innerHTML = `
    <style>
      ${styles}
    </style>
    <div class="container">
      <div class="list-posts">
        <div class="post-item">
          <div class="author-name">${this.authorName}</div>
          <div class="time">${this.time}</div>
          <div class="content">
            ${this.content}
          </div>
        </div>
      </div>
    </div>`
  }
}

window.customElements.define("post-item", PostItem)
