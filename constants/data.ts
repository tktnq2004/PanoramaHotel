import { Asset } from 'expo-asset';

export interface Hotspot {
  id: string;
  type: 'INFO' | 'NAVIGATION';
  name: string;
  description?: string;
  targetPanoramaId?: string;
  position: [number, number, number];
}

export interface PanoramaData {
  id: string;
  name: string;
  imageUrl: string;
  hotspots: Hotspot[];
}

export interface Room {
  id: string;
  name: string;
  category?: string;
  imageUrl?: string;
  panoramas: PanoramaData[];
}

export const PANORAMA_DATA: Record<string, Room> = {
  // Resort dạng "hub toả nhánh": phòng khách chung là trung tâm, toả ra các
  // không gian khác của resort (không cần hành lang trung gian riêng).
  resort_lythwood: {
    id: 'resort_lythwood',
    name: 'Lythwood Highland Resort',
    category: 'RESORT',
    imageUrl: Asset.fromModule(require('../assets/images/lythwood_lounge.jpg')).uri,
    panoramas: [
      {
        id: 'pano_lythwood_lounge',
        name: 'Phòng Khách Chung',
        imageUrl: Asset.fromModule(require('../assets/images/lythwood_lounge.jpg')).uri,
        hotspots: [
          {
            id: 'hs_lounge_to_room',
            type: 'NAVIGATION',
            name: 'Vào Phòng Ngủ',
            targetPanoramaId: 'pano_lythwood_room',
            position: [-18, 0, -8],
          },
          {
            id: 'hs_lounge_to_cayley',
            type: 'NAVIGATION',
            name: 'Sang Bếp & Phòng Ăn',
            targetPanoramaId: 'pano_cayley',
            position: [0, 0, -20],
          },
          {
            id: 'hs_lounge_to_wooden',
            type: 'NAVIGATION',
            name: 'Sang Phòng Giải Trí',
            targetPanoramaId: 'pano_wooden_lounge',
            position: [18, 0, -8],
          },
        ],
      },
      {
        id: 'pano_lythwood_room',
        name: 'Phòng Ngủ',
        imageUrl: Asset.fromModule(require('../assets/images/lythwood_room.jpg')).uri,
        hotspots: [
          {
            id: 'hs_room_to_lounge',
            type: 'NAVIGATION',
            name: 'Về Phòng Khách Chung',
            targetPanoramaId: 'pano_lythwood_lounge',
            position: [0, 0, 20],
          },
          {
            id: 'hs_room_to_bath',
            type: 'NAVIGATION',
            name: 'Vào Phòng Tắm',
            targetPanoramaId: 'pano_lythwood_bath',
            position: [-15, 0, -15],
          },
          {
            id: 'hs_room_info_fireplace',
            type: 'INFO',
            name: 'Lò Sưởi Cổ Điển',
            description: 'Góc tiếp khách ấm cúng với lò sưởi và bộ sofa hoa văn phong cách dinh thự cổ.',
            position: [15, 1, -12],
          },
        ],
      },
      {
        id: 'pano_lythwood_bath',
        name: 'Phòng Tắm',
        imageUrl: Asset.fromModule(require('../assets/images/bathroom.jpg')).uri,
        hotspots: [
          {
            id: 'hs_lywbath_to_room',
            type: 'NAVIGATION',
            name: 'Về Phòng Ngủ',
            targetPanoramaId: 'pano_lythwood_room',
            position: [0, 0, 20],
          },
          {
            id: 'hs_lywbath_info_tub',
            type: 'INFO',
            name: 'Bồn Tắm',
            description: 'Bồn tắm nằm rộng rãi, thuận tiện thư giãn sau một ngày dài khám phá resort.',
            position: [3, -2, -18],
          },
          {
            id: 'hs_lywbath_info_sink',
            type: 'INFO',
            name: 'Bồn Rửa & Gương',
            description: 'Khu vực bồn rửa với gương lớn và đầy đủ vật dụng vệ sinh cá nhân.',
            position: [-12, 1, -15],
          },
        ],
      },
      {
        id: 'pano_cayley',
        name: 'Bếp & Phòng Ăn',
        imageUrl: Asset.fromModule(require('../assets/images/cayley_room.jpg')).uri,
        hotspots: [
          {
            id: 'hs_cayley_to_lounge',
            type: 'NAVIGATION',
            name: 'Về Phòng Khách Chung',
            targetPanoramaId: 'pano_lythwood_lounge',
            position: [0, 0, 20],
          },
          {
            id: 'hs_cayley_info_table',
            type: 'INFO',
            name: 'Bàn Ăn Gỗ',
            description: 'Bàn ăn gỗ lớn đủ chỗ cho cả nhóm, đặt ngay cạnh khu bếp mở.',
            position: [-15, -1, -12],
          },
          {
            id: 'hs_cayley_info_view',
            type: 'INFO',
            name: 'Tầm Nhìn Hồ & Núi',
            description: 'Ban công kính mở ra tầm nhìn thung lũng và hồ nước phía xa, tuyệt đẹp lúc hoàng hôn.',
            position: [2, 0, -20],
          },
        ],
      },
      {
        id: 'pano_wooden_lounge',
        name: 'Phòng Giải Trí',
        imageUrl: Asset.fromModule(require('../assets/images/wooden_lounge.jpg')).uri,
        hotspots: [
          {
            id: 'hs_wooden_to_lounge',
            type: 'NAVIGATION',
            name: 'Về Phòng Khách Chung',
            targetPanoramaId: 'pano_lythwood_lounge',
            position: [0, 0, 20],
          },
          {
            id: 'hs_wooden_info_pool',
            type: 'INFO',
            name: 'Bàn Bi-a',
            description: 'Bàn bi-a tiêu chuẩn, khu vực giải trí chung cho khách lưu trú.',
            position: [16, -1, -10],
          },
          {
            id: 'hs_wooden_info_wifi',
            type: 'INFO',
            name: 'Góc Sưởi & Wifi',
            description: 'Khu vực lò sưởi trung tâm có Wifi tốc độ cao, phù hợp làm việc hoặc thư giãn.',
            position: [0, 1, -18],
          },
        ],
      },
    ],
  },

  // Khách sạn dạng "hành lang trung gian": sảnh chính liên kết 2 room, mỗi
  // room có 1 panorama chính (bedroom) + 2 panorama phụ (bathroom, view).
  hotel_conrad: {
    id: 'hotel_conrad',
    name: 'Conrad Towers Hotel',
    category: 'HOTEL',
    imageUrl: Asset.fromModule(require('../assets/images/main_360.jpg')).uri,
    panoramas: [
      {
        id: 'pano_hallway',
        name: 'Sảnh Chính',
        imageUrl: Asset.fromModule(require('../assets/images/main_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_hall_to_conrad',
            type: 'NAVIGATION',
            name: 'Vào Conrad Suite',
            targetPanoramaId: 'pano_conrad_main',
            position: [-15, 0, -15],
          },
          {
            id: 'hs_hall_to_dubaipalm',
            type: 'NAVIGATION',
            name: 'Vào Dubai Palm Suite',
            targetPanoramaId: 'pano_dubaipalm_main',
            position: [15, 0, -15],
          },
          {
            id: 'hs_hall_info_restaurant',
            type: 'INFO',
            name: 'Nhà Hàng Sảnh Chính',
            description: 'Nhà hàng phục vụ ẩm thực cao cấp, mở cửa cả ngày cho khách lưu trú.',
            position: [0, 1, -20],
          },
        ],
      },
      {
        id: 'pano_conrad_main',
        name: 'Conrad Suite - Phòng Ngủ',
        imageUrl: Asset.fromModule(require('../assets/images/room2_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_conrad_m_to_hall',
            type: 'NAVIGATION',
            name: 'Ra Sảnh Chính',
            targetPanoramaId: 'pano_hallway',
            position: [0, 0, 20],
          },
          {
            id: 'hs_conrad_m_to_bath',
            type: 'NAVIGATION',
            name: 'Vào Phòng Tắm',
            targetPanoramaId: 'pano_conrad_bath',
            position: [-16, 0, -12],
          },
          {
            id: 'hs_conrad_m_to_view',
            type: 'NAVIGATION',
            name: 'Sang Phòng Khách & View',
            targetPanoramaId: 'pano_conrad_view',
            position: [16, 0, -12],
          },
        ],
      },
      {
        id: 'pano_conrad_bath',
        name: 'Conrad Suite - Phòng Tắm',
        imageUrl: Asset.fromModule(require('../assets/images/room3_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_conrad_b_to_main',
            type: 'NAVIGATION',
            name: 'Về Phòng Ngủ',
            targetPanoramaId: 'pano_conrad_main',
            position: [0, 0, 20],
          },
          {
            id: 'hs_conrad_b_info_tub',
            type: 'INFO',
            name: 'Bồn Tắm Đá Marble',
            description: 'Bồn tắm ốp đá marble nguyên khối, điểm nhấn sang trọng của phòng tắm.',
            position: [14, -2, -12],
          },
          {
            id: 'hs_conrad_b_info_shower',
            type: 'INFO',
            name: 'Vòi Sen Cao Cấp',
            description: 'Vòi sen mưa tích hợp cùng vách kính cường lực chống bám nước.',
            position: [-10, 0, -15],
          },
        ],
      },
      {
        id: 'pano_conrad_view',
        name: 'Conrad Suite - Phòng Khách & View',
        imageUrl: Asset.fromModule(require('../assets/images/room4_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_conrad_v_to_main',
            type: 'NAVIGATION',
            name: 'Về Phòng Ngủ',
            targetPanoramaId: 'pano_conrad_main',
            position: [0, 0, 20],
          },
          {
            id: 'hs_conrad_v_info_skyline',
            type: 'INFO',
            name: 'Tầm Nhìn Skyline',
            description: 'Cửa kính toàn cảnh nhìn ra skyline và bờ biển thành phố từ tầng cao.',
            position: [0, 2, -20],
          },
          {
            id: 'hs_conrad_v_info_lounge',
            type: 'INFO',
            name: 'Góc Tiếp Khách',
            description: 'Khu vực sofa tiếp khách riêng biệt, tách khỏi không gian ngủ nghỉ.',
            position: [-15, 0, -12],
          },
        ],
      },
      {
        id: 'pano_dubaipalm_main',
        name: 'Dubai Palm Suite - Phòng Ngủ',
        imageUrl: Asset.fromModule(require('../assets/images/room5_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_dubai_m_to_hall',
            type: 'NAVIGATION',
            name: 'Ra Sảnh Chính',
            targetPanoramaId: 'pano_hallway',
            position: [0, 0, 20],
          },
          {
            id: 'hs_dubai_m_to_bath',
            type: 'NAVIGATION',
            name: 'Vào Phòng Tắm',
            targetPanoramaId: 'pano_dubaipalm_bath',
            position: [-16, 0, -12],
          },
          {
            id: 'hs_dubai_m_to_view',
            type: 'NAVIGATION',
            name: 'Sang Ban Công & View',
            targetPanoramaId: 'pano_dubaipalm_view',
            position: [16, 0, -12],
          },
        ],
      },
      {
        id: 'pano_dubaipalm_bath',
        name: 'Dubai Palm Suite - Phòng Tắm',
        imageUrl: Asset.fromModule(require('../assets/images/bathroom.jpg')).uri,
        hotspots: [
          {
            id: 'hs_dubaibath_to_main',
            type: 'NAVIGATION',
            name: 'Về Phòng Ngủ',
            targetPanoramaId: 'pano_dubaipalm_main',
            position: [0, 0, 20],
          },
          {
            id: 'hs_dubaibath_info_tub',
            type: 'INFO',
            name: 'Bồn Tắm',
            description: 'Bồn tắm nằm rộng rãi kèm vòi sen cầm tay tiện lợi.',
            position: [3, -2, -18],
          },
          {
            id: 'hs_dubaibath_info_sink',
            type: 'INFO',
            name: 'Bồn Rửa & Gương',
            description: 'Khu vực bồn rửa với gương lớn và đầy đủ vật dụng vệ sinh cá nhân.',
            position: [-12, 1, -15],
          },
        ],
      },
      {
        id: 'pano_dubaipalm_view',
        name: 'Dubai Palm Suite - Ban Công & View',
        imageUrl: Asset.fromModule(require('../assets/images/room6_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_dubaiview_to_main',
            type: 'NAVIGATION',
            name: 'Về Phòng Ngủ',
            targetPanoramaId: 'pano_dubaipalm_main',
            position: [0, 0, 20],
          },
          {
            id: 'hs_dubaiview_info_sunset',
            type: 'INFO',
            name: 'Hoàng Hôn Palm Jumeirah',
            description: 'Tầm nhìn hướng đảo cọ Palm Jumeirah, đẹp nhất vào lúc hoàng hôn.',
            position: [0, 1, -20],
          },
          {
            id: 'hs_dubaiview_info_city',
            type: 'INFO',
            name: 'Toàn Cảnh Thành Phố',
            description: 'View toàn cảnh đường chân trời thành phố từ ban công phòng.',
            position: [16, 0, -10],
          },
        ],
      },
    ],
  },
};
