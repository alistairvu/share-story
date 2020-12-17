const styles = `
<style>
.error {
  color: red;
}
#input-main {
  border-radius: 5px;
  width: 100%;
  border: 1px solid #dbdbdb;
  padding: 12px;
}

.input-wrapper {
  margin-bottom: 10px;
  padding: 0 20px;
}
</style>`

class InputWrapper extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this.type = this.getAttribute("type")
    this.placeholder = this.getAttribute("placeholder")
    this.error = this.getAttribute("error") || ""
    const { type, placeholder, error } = this

    this._shadowRoot.innerHTML = `
    ${styles}
    <div class="input-wrapper">
      <input id="input-main" type="${type}" placeholder="${placeholder}"/>
      <div class="error">${error}</div>
    </div>
  `
  }

  static get observedAttributes() {
    return ["error"]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "error") {
      this._shadowRoot.querySelector(".error").innerHTML = newValue
    }
  }

  get value() {
    return this._shadowRoot.getElementById("input-main").value
  }
}

window.customElements.define("input-wrapper", InputWrapper)
