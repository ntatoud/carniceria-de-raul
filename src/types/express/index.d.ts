declare global {
  namespace Express {
    interface Request {
      t: (args: string) => void;
    }
  }
}

export {};
