import { Link } from "../models/Link"
import { User, emptyUser } from "../models/User"
import { SimpleTokenParams } from "./api"

interface success {
  success: String;
  links?: Link[];
  error?: String;
}

interface error {
  error: String;
  success?: String;
  links?: Link[];
}

type SuccessOrError = success | error;

export default {
  async register(username:string, email:string, password:string) {
    const formdata: FormData = new FormData()
    formdata.append("username", username)
    formdata.append("password", password)
    formdata.append("email", email)

    const requestOptions = {
      method: "POST",
      body: formdata,
      credentials: "include",
    } as RequestInit

    return fetch(
      import.meta.env.VITE_BACKEND_URL + "/register",
      requestOptions,
    )
  },
  async isLoggedIn(): Promise<{ isLoggedIn: boolean; user: User }> {
    const response = { isLoggedIn: false, user: emptyUser }
    const requestOptions = {
      method: "GET",
      credentials: "include",
    } as RequestInit
    const apiResponse = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v0/me",
      requestOptions,
    )

    if (apiResponse.status === 200) {
      const user = await apiResponse.json()
      response.isLoggedIn = true
      response.user = user
    }

    return response
  },
  async logout(): Promise<void> {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    } as RequestInit
    const apiResponse = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/logout",
      requestOptions,
    )
    if (apiResponse.status === 200) {
      return
    }
    throw new Error("Logout failed")
  },
  async uploadPicture(file: File): Promise<Response> {
    const formdata = new FormData()
    formdata.append("picture", file, "user_picture.png")
    const requestOptions = {
      method: "PUT",
      body: formdata,
      redirect: "follow",
      credentials: "include",
    } as RequestInit

    const apiResponse = (await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v0/me/picture",
      requestOptions,
    )) as Response
    return apiResponse
  },
  async updateProfile({
    name,
    about,
  }: {
    name: string;
    about: string;
  }): Promise<Response> {
    const formdata = new FormData()
    formdata.append("name", name)
    formdata.append("about", about)

    const requestOptions = {
      method: "PUT",
      body: formdata,
      redirect: "follow",
      credentials: "include",
    } as RequestInit

    const apiResponse = (await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v0/me/profile",
      requestOptions,
    )) as Response
    return apiResponse
  },
  async addExternalWalletToAccount(walletAddress: string) {
    const formdata = new FormData()
    formdata.append("address", walletAddress)

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
      credentials: "include",
    } as RequestInit

    const apiResponse = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v0/admin/wallet/new",
      requestOptions,
    )
    return apiResponse.json()
  },
  async getAllowedUsers() {
    const req = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v0/users/alpha",
    )
    const users = (await req.json()) as User[]
    return users
  },
  links: {
    async update(links: Array<Link>): Promise<SuccessOrError> {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v0/me/links",
        {
          method: "PUT",
          body: JSON.stringify({ links: links }),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        } as RequestInit,
      )
      if (response.status !== 200) {
        throw new Error("Failed to update link")
      }
      return response.json()
    },
    async delete(link: Link): Promise<SuccessOrError> {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v0/me/links?id=" + link.id,
        {
          method: "DELETE",
          credentials: "include",
        } as RequestInit,
      )
      return response.json()
    },
  },
  async saveAirdropInfo(id: string, data: { payload: string[][] }) {
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    const requestOptions = {
      headers: myHeaders,
      method: "PUT",
      body: JSON.stringify(data),
      redirect: "follow",
      credentials: "include",
    } as RequestInit

    const req = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/v0/me/tokens/${id}/airdrop/create`,
      requestOptions,
    )
    return req
  },
  async saveTokenData({
    tokenType,
    contractVersion,
    freeSupply,
    airdropSupply,
    vaultAddress,
    tokenName,
    tokenSymbol,
    adminAddresses,
    chainId,
    txHash,
    contractAddress,
  }: SimpleTokenParams): Promise<Response> {
    const formdata = new FormData()
    formdata.append("tokenType", tokenType)
    formdata.append("contractVersion", contractVersion)
    formdata.append("freeSupply", freeSupply)
    formdata.append("airdropSupply", airdropSupply)
    formdata.append("vaultAddress", vaultAddress)
    formdata.append("tokenName", tokenName)
    formdata.append("tokenTicker", tokenSymbol)
    formdata.append("adminAddresses", JSON.stringify(adminAddresses))
    formdata.append("chainId", chainId)
    formdata.append("txHash", txHash.toString())
    formdata.append("contractAddress", contractAddress.toString())

    const requestOptions = {
      method: "PUT",
      body: formdata,
      redirect: "follow",
      credentials: "include",
    } as RequestInit

    const apiResponse = (await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v0/me/tokendata",
      requestOptions,
    )) as Response
    return apiResponse
  },

  async getTokens() {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
      credentials: "include",
    } as RequestInit
    return await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v0/me/tokens", requestOptions,
    )
  },

  async getContractKeys() {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
      credentials: "include",
    } as RequestInit
    return await fetch(
      import.meta.env.VITE_BACKEND_URL + "/api/v0/me/contracts",
      requestOptions,
    )
  }
}
