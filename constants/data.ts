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
  imageUrl?: string;
  panoramas: PanoramaData[];
}

export const PANORAMA_DATA: Record<string, Room> = {
  room_lobby: {
    id: 'room_lobby',
    name: 'Sảnh Hành Lang Chính',
    panoramas: [
      {
        id: 'pano_main_hall',
        name: 'Sảnh Chính Panorama',
        imageUrl: Asset.fromModule(require('../assets/images/main_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_hall_to_101',
            type: 'NAVIGATION',
            name: 'Vào Phòng 101',
            targetPanoramaId: 'pano_101_main',
            position: [-15, 0, -15],
          },
          {
            id: 'hs_hall_to_102',
            type: 'NAVIGATION',
            name: 'Vào Phòng 102',
            targetPanoramaId: 'pano_102_main',
            position: [0, 0, -20],
          },
          {
            id: 'hs_hall_to_103',
            type: 'NAVIGATION',
            name: 'Vào Phòng 103',
            targetPanoramaId: 'pano_103_main',
            position: [15, 0, -15],
          },
        ],
      },
    ],
  },

  room_101: {
    id: 'room_101',
    name: 'Phòng Deluxe 101',
    imageUrl: Asset.fromModule(require('../assets/images/room/101.jpg')).uri,
    panoramas: [
      {
        id: 'pano_101_main',
        name: 'Phòng Khách Deluxe 101',
        imageUrl: Asset.fromModule(require('../assets/images/room1_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_101_m_to_sub1',
            type: 'NAVIGATION',
            name: 'Sang Phòng Ngủ',
            targetPanoramaId: 'pano_101_sub1',
            position: [-18, 0, -10],
          },
          {
            id: 'hs_101_m_to_sub2',
            type: 'NAVIGATION',
            name: 'Sang Phòng Tắm',
            targetPanoramaId: 'pano_101_sub2',
            position: [18, 0, -10],
          },
          {
            id: 'hs_101_m_to_hall',
            type: 'NAVIGATION',
            name: 'Ra Sảnh Hành Lang',
            targetPanoramaId: 'pano_main_hall',
            position: [0, 0, 20],
          },
        ],
      },
      {
        id: 'pano_101_sub1',
        name: 'Phòng Ngủ 101',
        imageUrl: Asset.fromModule(require('../assets/images/room2_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_101_s1_to_main',
            type: 'NAVIGATION',
            name: 'Về Phòng Khách',
            targetPanoramaId: 'pano_101_main',
            position: [0, 0, 20],
          },
          {
            id: 'hs_101_s1_to_sub2',
            type: 'NAVIGATION',
            name: 'Sang Phòng Tắm',
            targetPanoramaId: 'pano_101_sub2',
            position: [15, 0, -15],
          },
          {
            id: 'hs_101_s1_info',
            type: 'INFO',
            name: 'Giường King Size 101',
            description: 'Đệm cao su thiên nhiên chuẩn khách sạn 5 sao.',
            position: [-10, 2, -15],
          },
        ],
      },
      {
        id: 'pano_101_sub2',
        name: 'Phòng Tắm 101',
        imageUrl: Asset.fromModule(require('../assets/images/room3_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_101_s2_to_main',
            type: 'NAVIGATION',
            name: 'Về Phòng Khách',
            targetPanoramaId: 'pano_101_main',
            position: [0, 0, 20],
          },
          {
            id: 'hs_101_s2_to_sub1',
            type: 'NAVIGATION',
            name: 'Sang Phòng Ngủ',
            targetPanoramaId: 'pano_101_sub1',
            position: [-15, 0, -15],
          },
          {
            id: 'hs_101_s2_info',
            type: 'INFO',
            name: 'Bồn Tắm Massage',
            description: 'Bồn tắm sục massage tự động có vòi sen đứng.',
            position: [10, -3, -15],
          },
        ],
      },
    ],
  },

  room_102: {
    id: 'room_102',
    name: 'Phòng Executive 102',
    imageUrl: Asset.fromModule(require('../assets/images/room/102.jpg')).uri,
    panoramas: [
      {
        id: 'pano_102_main',
        name: 'Phòng Khách Executive 102',
        imageUrl: Asset.fromModule(require('../assets/images/room4_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_102_m_to_sub1',
            type: 'NAVIGATION',
            name: 'Sang Mới Làm Việc',
            targetPanoramaId: 'pano_102_sub1',
            position: [-16, 0, -12],
          },
          {
            id: 'hs_102_m_to_sub2',
            type: 'NAVIGATION',
            name: 'Ra Ban Công',
            targetPanoramaId: 'pano_102_sub2',
            position: [16, 0, -12],
          },
          {
            id: 'hs_102_m_to_hall',
            type: 'NAVIGATION',
            name: 'Ra Sảnh Hành Lang',
            targetPanoramaId: 'pano_main_hall',
            position: [0, 0, 20],
          },
        ],
      },
      {
        id: 'pano_102_sub1',
        name: 'Góc Làm Việc 102',
        imageUrl: Asset.fromModule(require('../assets/images/room5_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_102_s1_to_main',
            type: 'NAVIGATION',
            name: 'Về Phòng Khách',
            targetPanoramaId: 'pano_102_main',
            position: [0, 0, 20],
          },
          {
            id: 'hs_102_s1_to_sub2',
            type: 'NAVIGATION',
            name: 'Ra Ban Công',
            targetPanoramaId: 'pano_102_sub2',
            position: [18, 0, -10],
          },
          {
            id: 'hs_102_s1_info',
            type: 'INFO',
            name: 'Bàn Bán Công Nghệ',
            description: 'Tích hợp sạc không dây và cổng kết nối HDMI lên TV.',
            position: [-12, 1, -15],
          },
        ],
      },
      {
        id: 'pano_102_sub2',
        name: 'Ban Công View Biển 102',
        imageUrl: Asset.fromModule(require('../assets/images/room6_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_102_s2_to_main',
            type: 'NAVIGATION',
            name: 'Về Phòng Khách',
            targetPanoramaId: 'pano_102_main',
            position: [0, 0, 20],
          },
          {
            id: 'hs_102_s2_to_sub1',
            type: 'NAVIGATION',
            name: 'Vào Góc Làm Việc',
            targetPanoramaId: 'pano_102_sub1',
            position: [-18, 0, -10],
          },
          {
            id: 'hs_102_s2_info',
            type: 'INFO',
            name: 'Tầm Nhìn Hướng Biển',
            description: 'Tầm nhìn trực diện bãi biển ngoạn mục từ tầng cao.',
            position: [0, 5, -15],
          },
        ],
      },
    ],
  },

  room_103: {
    id: 'room_103',
    name: 'Phòng President Suite 103',
    imageUrl: Asset.fromModule(require('../assets/images/room/103.jpg')).uri,
    panoramas: [
      {
        id: 'pano_103_main',
        name: 'Sảnh Tổng Thống 103',
        imageUrl: Asset.fromModule(require('../assets/images/room7_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_103_m_to_sub1',
            type: 'NAVIGATION',
            name: 'Vào Phòng Bếp / Bar',
            targetPanoramaId: 'pano_103_sub1',
            position: [-15, 0, -15],
          },
          {
            id: 'hs_103_m_to_sub2',
            type: 'NAVIGATION',
            name: 'Vào Bể Bơi Riêng',
            targetPanoramaId: 'pano_103_sub2',
            position: [15, 0, -15],
          },
          {
            id: 'hs_103_m_to_hall',
            type: 'NAVIGATION',
            name: 'Ra Sảnh Hành Lang',
            targetPanoramaId: 'pano_main_hall',
            position: [0, 0, 20],
          },
        ],
      },
      {
        id: 'pano_103_sub1',
        name: 'Quầy Bar 103',
        imageUrl: Asset.fromModule(require('../assets/images/room8_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_103_s1_to_main',
            type: 'NAVIGATION',
            name: 'Về Sảnh Chính',
            targetPanoramaId: 'pano_103_main',
            position: [0, 0, 20],
          },
          {
            id: 'hs_103_s1_to_sub2',
            type: 'NAVIGATION',
            name: 'Ra Bể Bơi Riêng',
            targetPanoramaId: 'pano_103_sub2',
            position: [16, 0, -12],
          },
          {
            id: 'hs_103_s1_info',
            type: 'INFO',
            name: 'Tủ Rượu Răng Cưa',
            description: 'Bộ sưu tập rượu vang nổi tiếng phục vụ miễn phí.',
            position: [-10, 0, -15],
          },
        ],
      },
      {
        id: 'pano_103_sub2',
        name: 'Bể Bơi Vô Cực 103',
        imageUrl: Asset.fromModule(require('../assets/images/room9_360.jpg')).uri,
        hotspots: [
          {
            id: 'hs_103_s2_to_main',
            type: 'NAVIGATION',
            name: 'Về Sảnh Chính',
            targetPanoramaId: 'pano_103_main',
            position: [0, 0, 20],
          },
          {
            id: 'hs_103_s2_to_sub1',
            type: 'NAVIGATION',
            name: 'Vào Quầy Bar',
            targetPanoramaId: 'pano_103_sub1',
            position: [-16, 0, -12],
          },
          {
            id: 'hs_103_s2_info',
            type: 'INFO',
            name: 'Hệ Thống Lọc Nước Điện Phân',
            description: 'Bể bơi nước mặn lọc hoàn toàn bằng công nghệ điện phân muối.',
            position: [0, -5, -15],
          },
        ],
      },
    ],
  },
};