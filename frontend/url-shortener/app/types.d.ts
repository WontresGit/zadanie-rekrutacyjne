interface ShortUrl {
  fullLink: string;
  isPublic: boolean;
  createDate: Date;
  expireDate?: Date;
  alias?: string;
}

interface ShortUrlRes {
  id: number;
  fullLink: string;
  shortCode: string;
  isPublic: boolean;
  creator: number;
  createDate: string;
  clicks: number;
  expireDate?: string;
  alias?: string;
  deleteDate?: string;
}
