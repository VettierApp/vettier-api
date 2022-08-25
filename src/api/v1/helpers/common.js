export const checkKeys = (keysToValidate, validations) => {
  const validateKeys = Object.keys(keysToValidate).map((key) => {
    return validations.includes(key);
  });
  if (validateKeys.includes(true)) return true;
  return false;
};
