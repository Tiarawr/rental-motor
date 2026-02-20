import { ZodSchema } from "zod";
import type { Resolver, FieldErrors } from "react-hook-form";

export const safeZodResolver = <T extends Record<string, any>>(
  schema: ZodSchema<T>,
): Resolver<T> => {
  return async (data: any) => {
    const result = schema.safeParse(data);
    if (result.success) {
      return { values: result.data, errors: {} };
    } else {
      const formErrors: FieldErrors<T> = {};

      // Map Zod issues to react-hook-form errors
      for (const issue of result.error.issues) {
        if (issue.path.length > 0) {
          const fieldName = issue.path[0].toString() as keyof T;
          // Only take the first error message for each field to avoid overriding
          if (!formErrors[fieldName]) {
            formErrors[fieldName] = {
              type: issue.code,
              message: issue.message,
            } as any;
          }
        }
      }

      return { values: {}, errors: formErrors };
    }
  };
};
