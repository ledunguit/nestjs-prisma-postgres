import { TokensPairType } from './get-tokens.type';

export type LogoutResponseType = {
  success: boolean;
};

export type SuccessResponseType = LogoutResponseType;

export type TokensResponseType = Readonly<{
  tokens: TokensPairType;
}>;

export type VerifyResponseType = Readonly<{
  success: boolean;
  message?: string;
}>;
