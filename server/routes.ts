import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAffirmationSchema } from "@shared/schema";
import { randomBytes } from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<void> {
  
  app.post("/api/affirmations", async (req, res) => {
    const result = insertAffirmationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const toxicTerms = ["hate", "threat", "violence"];
    if (toxicTerms.some(term => result.data.fullName.toLowerCase().includes(term))) {
      return res.status(400).json({ error: "Input contains prohibited language." });
    }

    const certificateId = `IECC-${randomBytes(4).toString("hex").toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const affirmation = await storage.createAffirmation({
      ...result.data,
      certificateId
    });

    res.json(affirmation);
  });

  app.get("/api/affirmations/verify/:id", async (req, res) => {
    const affirmation = await storage.getAffirmationByCertificateId(req.params.id);
    if (!affirmation) {
      return res.status(404).json({ error: "Certificate not found" });
    }
    res.json(affirmation);
  });

  app.get("/api/affirmations/stats", async (_req, res) => {
    const count = await storage.getAffirmationCount();
    res.json({ count });
  });

  app.get("/api/admin/affirmations", async (_req, res) => {
    const list = await storage.listAffirmations();
    res.json(list);
  });
}
