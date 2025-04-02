import { ErrorObject } from 'ajv'
import { ValidationErrors } from './interface'

export const getError = (errors: ErrorObject[] = []): ValidationErrors => {
    return errors.reduce((acc: ValidationErrors, error) => {
        const fieldPath = error.instancePath.replace(/^\//, ''); 
        const pathParts = fieldPath.split('/'); 

        let current = acc;

        pathParts.forEach((part, index) => {
        if (index === pathParts.length - 1) {
            // If it's the last part, push the error
            if (!current[part]) {
            current[part] = [];
            }
            current[part].push({
            message: error.message || 'Invalid value',
            keyword: error.keyword,
            instancePath: error.instancePath,
            schemaPath: error.schemaPath,
            params: error.params,
            });
        } else {
            // If it's not the last part, ensure the object exists
            if (!current[part]) {
            current[part] = [];
            }
            current = current[part] as unknown as ValidationErrors;
        }
        });

        return acc;
    }, {});
    
};

export const getErrorByField = (errors: ErrorObject[] = [],field: string): string => {
return getError(errors)?.[field]?.[0]?.message
}

export const getErrorBySubfield = (errors: ErrorObject[] = [], field: string,subfield: string): string => {
return getError(errors)?.[field]?.[subfield]?.[0]?.message
}