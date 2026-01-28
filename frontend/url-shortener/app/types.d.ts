interface ShortUrl {
  fullLink: string;
  isPublic: boolean;
  createDate: Date;
  expireDate?: Date;
  alias?: string;
}
