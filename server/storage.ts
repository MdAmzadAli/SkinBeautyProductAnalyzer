import { type User, type InsertUser, type UserProfile, type InsertUserProfile } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile & { userId: string }): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, UserProfile>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createUserProfile(insertProfile: InsertUserProfile & { userId: string }): Promise<UserProfile> {
    const id = randomUUID();
    const profile: UserProfile = {
      id,
      userId: insertProfile.userId,
      skinType: insertProfile.skinType,
      concerns: insertProfile.concerns as string[],
      allergies: insertProfile.allergies as string[],
      lifestyle: insertProfile.lifestyle as string[],
      additionalInfo: insertProfile.additionalInfo || "",
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateUserProfile(userId: string, updateData: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const existingProfile = await this.getUserProfile(userId);
    if (!existingProfile) return undefined;
    
    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...updateData,
      concerns: updateData.concerns ? updateData.concerns as string[] : existingProfile.concerns,
      allergies: updateData.allergies ? updateData.allergies as string[] : existingProfile.allergies,
      lifestyle: updateData.lifestyle ? updateData.lifestyle as string[] : existingProfile.lifestyle,
    };
    this.profiles.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }
}

export const storage = new MemStorage();
