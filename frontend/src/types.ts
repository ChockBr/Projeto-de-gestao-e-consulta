export interface PropertyResponse {
  id: number;
  title: string;
  description: string;
  type: string;
  enterpriseCondition: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  suites: number;
  parkingSpaces: number;
  totalArea: number;
  privateArea: number;
  address: string;
  brokerName: string | null;
  imageUrls: string[];
  active: boolean;
  ownerId: number | null;
  ownerEmail: string | null;
}
