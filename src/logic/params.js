const RegexSlugParam = new RegExp(/^[0-9a-zA-Z-]+$/)

export const CfpParam = {
  decode(value) {
    if (RegexSlugParam.test(value)) {
      return value
    }
    return null
  },
  encode(value) {
    return value
  },
}

export const asEnumParam = (values) => ({
  decode(value) {
    if (values.includes(value)) {
      return value
    }
    return null
  },
  encode(value) {
    return value
  },
})
