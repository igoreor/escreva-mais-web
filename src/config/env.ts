class Environment {
  private get(key: string, defaultValue: string = ""): string {
    return process.env[key] || defaultValue;
  }

  get apiUrl(): string {
    const url = this.get("NEXT_PUBLIC_API_BASE_URL");

    if (!url && process.env.NODE_ENV === "production") {
      console.warn("API URL não configurada em produção!");
    }

    return url || "http://localhost:8000/api";
  }
}

const env = new Environment();
export default env;
