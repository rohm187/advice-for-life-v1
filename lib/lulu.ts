/**
 * Lulu Print API Integration
 * Handles hardback book printing and fulfillment
 */

interface LuluAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface LuluAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state_code: string;
  postcode: string;
  country_code: string;
  phone_number?: string;
  email?: string;
}

interface LuluPrintJobRequest {
  line_items: Array<{
    title: string;
    cover: string; // URL to cover PDF
    interior: string; // URL to interior PDF
    pod_package_id: string; // Product specification ID
    quantity: number;
  }>;
  shipping_address: LuluAddress;
  shipping_level: string; // "MAIL", "PRIORITY_MAIL", "GROUND", etc.
  contact_email: string;
}

interface LuluPrintJobResponse {
  id: number;
  status: string;
  line_items: Array<{
    id: number;
    status: string;
    tracking_id?: string;
    tracking_url?: string;
  }>;
}

class LuluService {
  private clientKey: string;
  private clientSecret: string;
  private apiUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.clientKey = process.env.LULU_CLIENT_KEY || '';
    this.clientSecret = process.env.LULU_CLIENT_SECRET || '';
    this.apiUrl = process.env.LULU_API_URL || 'https://api.lulu.com';

    if (!this.clientKey || !this.clientSecret) {
      throw new Error('Lulu API credentials not configured');
    }
  }

  /**
   * Get OAuth access token from Lulu
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.apiUrl}/auth/realms/glasstree/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientKey,
          client_secret: this.clientSecret,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lulu auth failed: ${response.status} - ${errorText}`);
      }

      const data: LuluAuthResponse = await response.json();
      this.accessToken = data.access_token;
      // Set expiry to 5 minutes before actual expiry for safety
      this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

      return this.accessToken;
    } catch (error) {
      console.error('Error getting Lulu access token:', error);
      throw new Error('Failed to authenticate with Lulu API');
    }
  }

  /**
   * Create a print job for a physical book (paperback or hardback)
   */
  async createPrintJob(
    shippingAddress: {
      name: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    },
    customerEmail: string,
    interiorPdfUrl: string,
    coverPdfUrl: string,
    quantity: number = 1,
    productType: string = 'hardback'
  ): Promise<LuluPrintJobResponse> {
    try {
      const token = await this.getAccessToken();

      // Determine POD Package ID based on product type
      // Bundle defaults to hardback (premium option)
      let podPackageId: string;
      
      if (productType === 'paperback') {
        // 6x9 perfect-bound paperback
        podPackageId = process.env.LULU_PAPERBACK_POD_PACKAGE_ID || '0600X0900BWSTDPB060UW444MXX';
      } else {
        // hardback or bundle -> 6x9 premium linen wrap hardcover
        podPackageId = process.env.LULU_POD_PACKAGE_ID || '0600X0900BWPRELW060UW444MFB';
      }

      const luluAddress: LuluAddress = {
        name: shippingAddress.name,
        street1: shippingAddress.line1,
        street2: shippingAddress.line2,
        city: shippingAddress.city,
        state_code: shippingAddress.state,
        postcode: shippingAddress.postal_code,
        country_code: shippingAddress.country,
        phone_number: (shippingAddress as any).phone || '0000000000', // Lulu requires phone
        email: customerEmail,
      };

      const printJobRequest: LuluPrintJobRequest = {
        line_items: [
          {
            title: 'Advice for Life from a Drug Addict',
            cover: coverPdfUrl,
            interior: interiorPdfUrl,
            pod_package_id: podPackageId,
            quantity: quantity,
          },
        ],
        shipping_address: luluAddress,
        shipping_level: 'MAIL', // Standard shipping
        contact_email: customerEmail,
      };

      const response = await fetch(`${this.apiUrl}/print-jobs/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(printJobRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lulu print job creation failed:', errorText);
        throw new Error(`Failed to create print job: ${response.status} - ${errorText}`);
      }

      const printJob: LuluPrintJobResponse = await response.json();
      return printJob;
    } catch (error) {
      console.error('Error creating Lulu print job:', error);
      throw error;
    }
  }

  /**
   * Get the status of a print job
   */
  async getPrintJobStatus(printJobId: number): Promise<LuluPrintJobResponse> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(`${this.apiUrl}/print-jobs/${printJobId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get print job status: ${response.status}`);
      }

      const printJob: LuluPrintJobResponse = await response.json();
      return printJob;
    } catch (error) {
      console.error('Error getting Lulu print job status:', error);
      throw error;
    }
  }

  /**
   * Get available POD package IDs (product specifications)
   * Use this to find the right package ID for your book specs
   */
  async getPodPackages(): Promise<any[]> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(`${this.apiUrl}/pod-packages/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get POD packages: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error getting POD packages:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const luluService = new LuluService();
