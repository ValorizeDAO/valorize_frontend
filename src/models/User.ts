/* eslint-disable camelcase */
import { Token } from "./Token"
import { Link } from "./Link"
export interface User {
  id: number,
  email: string,
  name: string,
  username: string,
  avatar: string,
  about: string,
  hasDeployedToken: boolean,
  hasVerifiedEmail: boolean,
  isAlphaUser: boolean,
  token?: Token,
  links?: Link[]
}

export const emptyUser: User = {
  id: 0,
  email: "",
  name: "",
  username: "",
  avatar: "",
  about: "",
  hasDeployedToken: false,
  hasVerifiedEmail: false,
  isAlphaUser: false,
}
