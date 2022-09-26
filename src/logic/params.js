const RegexSlugParam = new RegExp(/^[0-9a-zA-Z-]+$/)

export const CfpParam = {
  decode(value) {
    if (RegexSlugParam.test(value)) {
      return value
    }
    return null
  },
}
