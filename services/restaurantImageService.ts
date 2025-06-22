import { Restaurant } from '../types';

// レスポンス型定義
interface FoursquareVenue {
  id: string;
  name: string;
  location: {
    address?: string;
    lat: number;
    lng: number;
  };
  photos?: {
    prefix: string;
    suffix: string;
    width: number;
    height: number;
  }[];
}

interface FoursquareResponse {
  results: FoursquareVenue[];
}

interface GurunaviShop {
  id: string;
  name: string;
  image_url?: {
    shop_image1?: string;
    shop_image2?: string;
  };
}

interface GurunaviResponse {
  rest: GurunaviShop[];
}

export class RestaurantImageService {
  private static FOURSQUARE_API_KEY = process.env.EXPO_PUBLIC_FOURSQUARE_API_KEY;
  private static GURUNAVI_API_KEY = process.env.EXPO_PUBLIC_GURUNAVI_API_KEY;
  
  /**
   * レストラン画像を複数ソースから取得
   * @param restaurant レストラン情報
   * @returns 画像URL (取得できない場合はnull)
   */
  static async getRestaurantImage(restaurant: Restaurant): Promise<string | null> {
    try {
      // 1. Foursquare APIで検索
      const foursquareImage = await this.searchFoursquareImage(
        restaurant.name,
        restaurant.location.lat,
        restaurant.location.lng
      );
      
      if (foursquareImage) {
        console.log('Image found via Foursquare:', restaurant.name);
        return foursquareImage;
      }

      // 2. ぐるなび APIで検索
      const gurunaviImage = await this.searchGurunaviImage(
        restaurant.name,
        restaurant.location.address
      );
      
      if (gurunaviImage) {
        console.log('Image found via Gurunavi:', restaurant.name);
        return gurunaviImage;
      }

      // 3. フォールバック: カテゴリベースのUnsplash画像
      const fallbackImage = this.getFallbackImage(restaurant.category || 'restaurant');
      console.log('Using fallback image for:', restaurant.name);
      return fallbackImage;

    } catch (error) {
      console.error('Error fetching restaurant image:', error);
      return this.getFallbackImage('restaurant');
    }
  }

  /**
   * Foursquare Places APIで画像検索
   */
  private static async searchFoursquareImage(
    name: string, 
    lat: number, 
    lng: number
  ): Promise<string | null> {
    if (!this.FOURSQUARE_API_KEY) {
      console.warn('Foursquare API key not configured');
      return null;
    }

    try {
      const query = encodeURIComponent(name);
      const url = `https://api.foursquare.com/v3/places/search` +
        `?query=${query}` +
        `&ll=${lat},${lng}` +
        `&radius=100` +
        `&limit=1` +
        `&fields=name,location,photos`;

      const response = await fetch(url, {
        headers: {
          'Authorization': this.FOURSQUARE_API_KEY,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Foursquare API error: ${response.status}`);
      }

      const data: FoursquareResponse = await response.json();
      
      if (data.results.length > 0 && data.results[0].photos && data.results[0].photos.length > 0) {
        const photo = data.results[0].photos[0];
        // Foursquare写真URLを構築 (300x300サイズ)
        return `${photo.prefix}300x300${photo.suffix}`;
      }

      return null;
    } catch (error) {
      console.error('Foursquare API error:', error);
      return null;
    }
  }

  /**
   * ぐるなび APIで画像検索
   */
  private static async searchGurunaviImage(
    name: string,
    address: string
  ): Promise<string | null> {
    if (!this.GURUNAVI_API_KEY) {
      console.warn('Gurunavi API key not configured');
      return null;
    }

    try {
      const query = encodeURIComponent(name);
      const area = encodeURIComponent(this.extractAreaFromAddress(address));
      
      const url = `https://api.gnavi.co.jp/RestSearchAPI/v3/` +
        `?keyid=${this.GURUNAVI_API_KEY}` +
        `&name=${query}` +
        `&area=${area}` +
        `&hit_per_page=1` +
        `&format=json`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Gurunavi API error: ${response.status}`);
      }

      const data: GurunaviResponse = await response.json();
      
      if (data.rest && data.rest.length > 0) {
        const shop = data.rest[0];
        // 店舗画像URLを取得
        return shop.image_url?.shop_image1 || shop.image_url?.shop_image2 || null;
      }

      return null;
    } catch (error) {
      console.error('Gurunavi API error:', error);
      return null;
    }
  }

  /**
   * 住所から地域名を抽出（ぐるなび API用）
   */
  private static extractAreaFromAddress(address: string): string {
    // 東京都渋谷区 → 渋谷
    if (address.includes('渋谷')) return '渋谷';
    if (address.includes('新宿')) return '新宿';
    if (address.includes('原宿')) return '原宿';
    if (address.includes('表参道')) return '表参道';
    if (address.includes('六本木')) return '六本木';
    if (address.includes('恵比寿')) return '恵比寿';
    if (address.includes('銀座')) return '銀座';
    
    // デフォルトは東京
    return '東京';
  }

  /**
   * フォールバック画像（カテゴリベースのUnsplash）
   */
  private static getFallbackImage(category: string): string {
    const imageMap: Record<string, string> = {
      'healthy': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format&q=80', // 健康的な料理
      'fitness': 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=400&h=300&fit=crop&auto=format&q=80', // フィットネス向け食事
      'cafe': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop&auto=format&q=80', // カフェ
      'protein': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80', // プロテインフード
      'restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&auto=format&q=80' // 一般的なレストラン
    };

    return imageMap[category] || imageMap['restaurant'];
  }

  /**
   * バッチで複数レストランの画像を取得
   */
  static async getMultipleRestaurantImages(
    restaurants: Restaurant[]
  ): Promise<Record<string, string | null>> {
    const imagePromises = restaurants.map(async (restaurant) => {
      const imageUrl = await this.getRestaurantImage(restaurant);
      return { id: restaurant.id, imageUrl };
    });

    const results = await Promise.all(imagePromises);
    
    return results.reduce((acc, { id, imageUrl }) => {
      acc[id] = imageUrl;
      return acc;
    }, {} as Record<string, string | null>);
  }
}