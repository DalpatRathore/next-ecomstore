const hashedPasswordEncode = async (password: string) => {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );

  return Buffer.from(arrayBuffer).toString("base64");
};

export const isValidPassword = async (
  password: string,
  hashedPassword: string
) => {
  //   console.log(await hashedPasswordEncode(password));
  return (await hashedPasswordEncode(password)) === hashedPassword;
};
