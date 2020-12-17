export const getDataFromDoc = (doc) => {
  return { ...doc.data(), id: doc.id }
}

export const getDataFromDocs = (docs) => {
  return docs.map((doc) => getDataFromDoc(doc))
}

/**
 *
 * @param {String} key
 * @param {object} value
 */
export const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, value)
}

export const getItemLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key)
}

/**
 *
 * @param {*} dateStr
 * 14/12/2020 21:20
 */
export const convertDate = (dateStr) => {
  const date = new Date(dateStr)
  const day = ("0" + date.getDate()).slice(-2)
  const month = ("0" + (date.getMonth() + 1)).slice(-2)
  const year = date.getFullYear()
  const hour = ("0" + date.getHours()).slice(-2)
  const minute = ("0" + date.getMinutes()).slice(-2)
  return `${day}/${month}/${year} ${hour}:${minute}`
}
