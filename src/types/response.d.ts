export interface TokenResponse {
  token: string;
  expires: Date;
}

export interface AuthTokensResponse {
  access: TokenResponse;
  refresh?: TokenResponse;
}

export type paymentBodyType = {
  ref: string,
  amount: string,
  lic_name: string,
  lic_id: string ,
  pmt_type: string,
  pmt_time: string
}