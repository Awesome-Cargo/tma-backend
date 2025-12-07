import generator from "generate-password";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const generateRandomPassword = (): string => {
  return generator.generate({
    length: 10,
    lowercase: true,
    uppercase: true,
    numbers: true,
  });
};

export const encryptPassword = (password: string): Promise<string> => {
  return new Promise((res) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return res("");
      bcrypt.hash(password, salt, (erro, hash) => {
        if (erro) return res("");
        res(hash);
      });
    });
  });
};

export const verifyPassword = ({
  encrypedPassword,
  password,
}: {
  encrypedPassword: string;
  password: string;
}): Promise<boolean> => {
  return new Promise((res) => {
    bcrypt.compare(password, encrypedPassword, (err, result) => {
      if (err) return res(false);

      return res(result);
    });
  });
};
