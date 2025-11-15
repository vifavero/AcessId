import argon2 from "argon2";

export async function hashSecurity(password: string) {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (error) {
    console.error("Erro ao processar hash:", error);
  }
}

export async function verifySecurity(hash: string, password: string) {
  try {
    const valid = await argon2.verify(hash, password);
    return valid;
  } catch (error) {
    console.error("Erro ao processar hash:", error);
  }
}

// hashSecurity("minhaSenhaSegura123");
