/* DO NOT EDIT, file generated by nestjs-i18n */
  
/* eslint-disable */
/* prettier-ignore */
import { Path } from "nestjs-i18n";
/* prettier-ignore */
export type I18nTranslations = {
    "auth": {
        "register": {
            "email": {
                "exists": string;
            };
        };
        "verify-email": {
            "success": string;
            "not-found": string;
        };
        "login": {
            "incorrect": string;
            "wrong-provider": string;
            "disabled": string;
            "unverified": string;
            "unauthorized": string;
        };
        "guard": {
            "invalid-token": string;
        };
        "refresh-token": {
            "invalid-token": string;
        };
    };
    "common": {
        "confirm-email": string;
        "reset-password": string;
    };
    "email": {
        "register-confirm": {
            "text1": string;
            "text2": string;
            "text3": string;
            "text4": string;
        };
    };
    "validation": {
        "common": {
            "min": string;
            "max": string;
            "string": string;
            "exists": string;
            "not-exists": string;
            "not-empty": string;
            "email": string;
        };
    };
};
/* prettier-ignore */
export type I18nPath = Path<I18nTranslations>;