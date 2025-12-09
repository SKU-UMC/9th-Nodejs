import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pkg from "passport-naver-v2";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "./db.config.js";
import jwt from "jsonwebtoken"; // JWT 생성을 위해 import
import { addUser, getUser } from "./repositories/user.repository.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";

dotenv.config();
const NaverStrategy = pkg.Strategy;
const secret = process.env.JWT_SECRET; // .env의 비밀 키

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "1h",
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, secret, { expiresIn: "14d" });
};
// GoogleVerify
const googleVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new Error(`profile.email was not found: ${profile}`);
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user !== null) {
    return { id: user.id, email: user.email, name: user.name };
  }
  const data = {
    email,
    name: profile.displayName,
    gender: "MALE",
    birth: new Date("2002-03-28"),
    address: 1,
    detailAddress: "test",
    phoneNumber: "01012345431",
    password: "1234",
  };
  const result = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      addressId: data.address,
      detailAddress: data.detailAddress,
      phone: data.phoneNumber,
      password: data.password,
      platform: "GOOGLE",
    },
  });
  return { id: result.id, email: result.email, name: result.name };
};

// GoogleStrategy

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "/oauth2/callback/google",
    scope: ["email", "profile"],
  },

  async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await googleVerify(profile);

      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

      return cb(null, {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });
    } catch (err) {
      return cb(err);
    }
  }
);

// NaverVerify
const naverVerify = async (profile) => {
  const email = profile.email;
  if (!email) {
    throw new Error(`profile.email was not found: ${profile}`);
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user !== null) {
    return { id: user.id, email: user.email, name: user.name };
  }
  const data = {
    email,
    name: profile.name,
    gender: "MALE",
    birth: new Date("2002-03-28"),
    address: 1,
    detailAddress: "test",
    phoneNumber: "01000000000",
    password: "1234",
  };
  const result = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      addressId: data.address,
      detailAddress: data.detailAddress,
      phone: data.phoneNumber,
      password: data.password,
      platform: "NAVER",
    },
  });
  return { id: result.id, email: result.email, name: result.name };
};

// NaverStrategy

export const naverStrategy = new NaverStrategy(
  {
    clientID: process.env.PASSPORT_NAVER_CLIENT_ID,
    clientSecret: process.env.PASSPORT_NAVER_CLIENT_SECRET,
    callbackURL: "/oauth2/callback/naver",
  },

  async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await naverVerify(profile);

      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

      return cb(null, {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });
    } catch (err) {
      return cb(err);
    }
  }
);

// LocalVerify
const localVerify = async (email, password) => {
  if (!email) {
    throw new Error(`email was not found: ${profile}`);
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user !== null) {
    if (user.platform != "LOCAL")
      throw Error("회원가입한 플랫폼으로 로그인해주세요.");
    return { id: user.id, email: user.email, name: user.name };
  }
  const data = {
    email,
    name: "test",
    gender: "MALE",
    birth: new Date("2002-03-28"),
    address: 1,
    detailAddress: "test",
    phoneNumber: "01028283737",
    password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
  };
  const result = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      addressId: data.address,
      detailAddress: data.detailAddress,
      phone: data.phoneNumber,
      password: data.password,
      platform: "LOCAL",
    },
  });
  return { id: result.id, email: result.email, name: result.name };
};

// LocalStrategy

export const localStrategy = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, cb) => {
    try {
      console.log(email);
      console.log(password);
      const user = await localVerify(email, password);

      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

      return cb(null, {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });
    } catch (err) {
      return cb(err);
    }
  }
);

const jwtOptions = {
  // 요청 헤더의 'Authorization'에서 'Bearer <token>' 토큰을 추출
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (payload, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { id: payload.id } });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }
);
