import * as express from "express";
import { Request, Response } from "express";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { Nota } from "../entity/Nota";
import { SECRET_KEY, verifyToken } from "../middleware";

export const index = express.Router();

index.post("/register", async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
    }: { username: string; email: string; password: string } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    await userRepository.save(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

index.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }  

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    
    res.json({ 
      token,
      expiresAt: expiresAt.toISOString()
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

index.get("/profile", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Profile retrieval error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

index.post("/nota", verifyToken, async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const userId = req.body.userId;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notaRepository = AppDataSource.getRepository(Nota);
    const newNota = notaRepository.create({
      title,
      content,
      user: user
    });

    await notaRepository.save(newNota);
    res.status(201).json({ message: "Note created successfully", note: newNota });
  } catch (error) {
    console.error("Note creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

index.get("/notas", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const notaRepository = AppDataSource.getRepository(Nota);
    const notas = await notaRepository.find({ 
      where: { user: { id: userId } },
      relations: ["user"]
    });

    if (notas.length === 0) {
      return res.status(404).json({ message: "No notes found" });
    }
    
    res.json(notas);
  } catch (error) {
    console.error("Note retrieval error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});