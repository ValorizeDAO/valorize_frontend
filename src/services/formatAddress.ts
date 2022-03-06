export function formatAddress(address: string) {
  return `${address.substr(0, 5)}...${address.substr(address.length - 2, address.length - 1)}`
}
