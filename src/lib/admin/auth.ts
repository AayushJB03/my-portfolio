export const getAdminPassword = () => process.env.ADMIN_BOARD_PASSWORD || "2308"

export const isValidAdminPassword = (password: unknown) => {
  return typeof password === "string" && password === getAdminPassword()
}
