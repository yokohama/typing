import { useState } from 'react';

type ValidationErrors = {
  [field: string]: string[];
};

export function useValidation() {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors | null>(null);

  const setErrors = (errors: ValidationErrors) => {
    console.log(errors);
    setValidationErrors(errors);
  };

  const clearErrors = () => {
    setValidationErrors(null);
  };

  return {
    validationErrors,
    setErrors,
    clearErrors,
  };
}
