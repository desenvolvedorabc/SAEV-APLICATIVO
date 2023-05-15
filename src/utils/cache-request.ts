import axios from "axios";

class CacheControl {
  private expireTime: number;
  private nameRequest: string;

  constructor(expireTime: number, nameRequest: string) {
    this.expireTime = expireTime;
    this.nameRequest = nameRequest;
  }

  addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  async get(url: string, params: any) {
    const { token, ...rest } = params;

    const nameToSave =
      this.nameRequest +
      Object.values({ ...rest, url })
        .join("_")
        .replace(/\s/g, "");

    const data = localStorage.getItem(nameToSave);

    if (data) {
      const { expire, response } = JSON.parse(data);

      const expirationTime = new Date(expire);

      if (expirationTime > new Date()) {
        return response;
      }

      localStorage.removeItem(nameToSave);
    }

    const response = await axios.get(url, { params });

    localStorage.setItem(
      nameToSave,
      JSON.stringify({
        response,
        expire: this.addMinutes(new Date(), this.expireTime),
      })
    );

    return response;
  }
}

export default CacheControl;
