function CheckBody(body, requiredFields, optionalFields = []) {
  for (let field of requiredFields) {
    if (!body[field] || body[field].trim() === "") {
      return false;
    }
  }

  return true;
}

module.exports = { CheckBody };
