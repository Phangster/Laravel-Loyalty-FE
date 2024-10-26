import { UseFormSetError } from "react-hook-form";

export const setFormErrors = (setError: UseFormSetError<any>, errors: Record<string, string[]>) => {
    Object.keys(errors).forEach((field) => {
        setError(field, {
            type: "manual",
            message: errors[field][0],
        });
    });
};