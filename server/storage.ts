import { affirmations, users, type User, type InsertUser, type Affirmation, type InsertAffirmation } from "@shared/schema";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import session from "express-session";
import MemoryStoreFactory from "memorystore";

const MemoryStore = MemoryStoreFactory(session);

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createAffirmation(affirmation: InsertAffirmation & { certificateId: string }): Promise<Affirmation>;
  getAffirmationByCertificateId(id: string): Promise<Affirmation | undefined>;
  listAffirmations(): Promise<Affirmation[]>;
  getAffirmationCount(): Promise<number>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private affirmations: Map<number, Affirmation>;
  private currentUserId: number;
  private currentAffirmationId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.affirmations = new Map();
    this.currentUserId = 1;
    this.currentAffirmationId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });
    
    this.createUser({ 
      username: "admin", 
      password: hashPassword("admin123") 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createAffirmation(data: InsertAffirmation & { certificateId: string }): Promise<Affirmation> {
    const id = this.currentAffirmationId++;
    const affirmation: Affirmation = {
      ...data,
      id,
      timestamp: new Date(),
    };
    this.affirmations.set(id, affirmation);
    return affirmation;
  }

  async getAffirmationByCertificateId(id: string): Promise<Affirmation | undefined> {
    return Array.from(this.affirmations.values()).find(a => a.certificateId === id);
  }

  async listAffirmations(): Promise<Affirmation[]> {
    return Array.from(this.affirmations.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getAffirmationCount(): Promise<number> {
    return this.affirmations.size;
  }
}

export const storage = new MemStorage();
