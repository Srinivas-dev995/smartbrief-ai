import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { User } from "../models/User.model.js";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }
    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(400, "User already exists");

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPass });

    res.status(201).json(new ApiResponse(201, "User registered successfully"));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = generateToken(res, user);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            credits: user.credits,
          },
          token,
        },
        "Login successful"
      )
    );
  } catch (error) {
    next(error); // pass to global error middleware
  }
};

export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log(error);
  }
};

export const getCredits = async (req, res) => {
  try {
    const credits = req.user.credits;
    res.json({ credits });
  } catch (err) {
    res.status(500).json({ message: "Unable to retrieve credits" });
  }
};
