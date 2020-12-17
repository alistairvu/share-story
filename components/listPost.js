import { getDataFromDocs, getDataFromDoc } from "../utils.js"

const styles = `
<style>
.list-posts { 
  margin: auto;
  margin-top: 10px;
}
</style>`

class ListPost extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: "open" })
  }

  async connectedCallback() {
    const collection = await firebase.firestore().collection("posts")
    const res = await collection.where("isShown", "==", true).get()
    this.listenCollectionChange()
    const listPost = getDataFromDocs(res.docs).sort(
      (a, b) => b.createdRaw - a.createdRaw
    )
    console.log(listPost)

    let postHtml = ``
    listPost.map((post) => {
      const { authorName, createdAt, content, isShown } = post
      postHtml += `<post-item author-name="${authorName}" time="${createdAt}" content="${content}"></post-item>`
    })

    this._shadowRoot.innerHTML = `
    ${styles}
    <div class="list-posts" id="list-posts">
      ${postHtml}
    </div>
    `
  }

  listenCollectionChange() {
    let firstRun = true
    firebase
      .firestore()
      .collection("posts")
      .where("isShown", "==", true)
      .onSnapshot((snapShot) => {
        if (firstRun) {
          firstRun = false
          return
        }
        const docChange = snapShot.docChanges()

        for (const oneChange of docChange) {
          if (oneChange.type === "added") {
            this.appendPostItem(oneChange.doc)
            console.log(oneChange.doc.data())
          }
        }
      })
  }

  appendPostItem(data) {
    const { authorName, createdAt, content } = getDataFromDoc(data)
    this._shadowRoot
      .getElementById("list-posts")
      .insertAdjacentHTML(
        "afterbegin",
        `<post-item author-name="${authorName}" time="${createdAt}" content="${content}"></post-item>`
      )
  }
}

window.customElements.define("list-post", ListPost)
