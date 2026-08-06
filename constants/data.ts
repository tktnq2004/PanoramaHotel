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
  // require() ảnh local — KHÔNG resolve sẵn thành .uri ở đây. Asset.fromModule(...).uri
  // chỉ là URL Metro dev server hợp lệ lúc dev; trong bản release/standalone
  // (không có Metro) nó trỏ tới 1 dạng tham chiếu asset nội bộ mà TextureLoader
  // của Three.js không tự hiểu được -> texture load thất bại âm thầm, màn hình
  // đen. Việc resolve ra URI thật (qua Asset.downloadAsync()) được làm ngay
  // trước lúc nạp texture, trong usePanoramaScene.ts.
  imageUrl: number;
  hotspots: Hotspot[];
}

export interface Room {
  id: string;
  name: string;
  category?: string;
  imageUrl?: number;
  panoramas: PanoramaData[];
}

export const PANORAMA_DATA: Record<string, Room> = {
  //Resort
  resort_lythwood: {
    id: 'resort_lythwood',
    name: 'Lythwood Highland Resort',
    category: 'RESORT',
    imageUrl: require('../assets/images/resort/living_room.jpg'),
    panoramas: [
      {
        id: 'living_room',
        name: 'Living Room',
        imageUrl: require('../assets/images/resort/living_room.jpg'),
        hotspots: [
          {
            id: 'hs_living_to_bedroom_1',
            type: 'NAVIGATION',
            name: 'Bedroom',
            targetPanoramaId: 'bed_room_1',
            position: [-15.9, -1.4, 12.1],
          },
          {
            id: 'hs_living_to_kitchen',
            type: 'NAVIGATION',
            name: 'Kitchen & Dining',
            targetPanoramaId: 'kitchen_dining',
            position: [-1.7, -0.8, -19.9],
          },
          {
            id: 'hs_living_to_entertainment',
            type: 'NAVIGATION',
            name: 'Entertainment Room',
            targetPanoramaId: 'entertainment_room',
            position: [6, -0.1, 19.1],
          },
          {
            id: 'hs_living_to_bedroom_2',
            type: 'NAVIGATION',
            name: 'Bedroom',
            targetPanoramaId: 'bed_room_2',
            position: [19, -0.7, 6.1],
          },
        ],
      },
      {
        id: 'bed_room_1',
        name: 'Bedroom',
        imageUrl: require('../assets/images/resort/bed_room_1.jpg'),
        hotspots: [
          {
            id: 'hs_bed_to_living',
            type: 'NAVIGATION',
            name: 'Living Room',
            targetPanoramaId: 'living_room',
            position: [8.3, -1.5, 18.1],
          },
          {
            id: 'hs_bed_to_bath',
            type: 'NAVIGATION',
            name: 'Bathroom',
            targetPanoramaId: 'bath_room_1',
            position: [13.5, -1.1, -14.7],
          },
        ],
      },
      {
        id: 'bath_room_1',
        name: 'Bathroom',
        imageUrl: require('../assets/images/resort/bath_room_1.jpg'),
        hotspots: [
          {
            id: 'hs_bath_to_bed',
            type: 'NAVIGATION',
            name: 'Bedroom',
            targetPanoramaId: 'bed_room_1',
            position: [-0.2, -0.1, -20],
          },
          {
            id: 'hs_bath_info_tub',
            type: 'INFO',
            name: 'Tub & Shower',
            description: 'A modern bathtub with a separate shower area, providing a luxurious bathing experience.',
            position: [-19.4, -1.7, 4.7],
          },
          {
            id: 'hs_bath_info_sink',
            type: 'INFO',
            name: 'Sink & Mirror',
            description: 'A sleek sink with a large mirror, perfect for your daily grooming routine.',
            position: [1.3, 5, 19.3],
          },
        ],
      },
      {
        id: 'bed_room_2',
        name: 'Bedroom',
        imageUrl: require('../assets/images/resort/bed_room_2.jpg'),
        hotspots: [
          {
            id: 'hs_bed_to_living',
            type: 'NAVIGATION',
            name: 'Living Room',
            targetPanoramaId: 'living_room',
            position: [7.4, -1.7, 18.5],
          },
          {
            id: 'hs_bed_to_bath',
            type: 'NAVIGATION',
            name: 'Bathroom',
            targetPanoramaId: 'bath_room_2',
            position: [-2, -2.4, 19.8],
          },
          {
            id: 'hs_bed_room_info_fireplace',
            type: 'INFO',
            name: 'Fireplace & Sofa',
            description: 'A cozy corner with a fireplace and a sofa, perfect for relaxing and enjoying the warmth.',
            position: [10.8, -3.2, -16.5],
          },
        ],
      },
      {
        id: 'bath_room_2',
        name: 'Bathroom',
        imageUrl: require('../assets/images/resort/bath_room_2.jpg'),
        hotspots: [
          {
            id: 'hs_bath_to_bed',
            type: 'NAVIGATION',
            name: 'Bedroom',
            targetPanoramaId: 'bed_room_2',
            position: [19.5, -0.4, -4.3],
          },
          {
            id: 'hs_bath_info_tub',
            type: 'INFO',
            name: 'Marble Stone Bathtub',
            description: 'Marble stone bathtub, perfect for a relaxing soak after a long day.',
            position: [13.9, -7.3, -12.3],
          },
          {
            id: 'hs_bath_info_shower',
            type: 'INFO',
            name: 'Rain Shower',
            description: 'Rain shower with adjustable water pressure and temperature, providing a refreshing experience.',
            position: [-12.9, 14.1, 5.9],
          },
        ],
      },
      {
        id: 'kitchen_dining',
        name: 'Kitchen & Dining',
        imageUrl: require('../assets/images/resort/kitchen_dining.jpg'),
        hotspots: [
          {
            id: 'hs_kitchen_to_living',
            type: 'NAVIGATION',
            name: 'Living Room',
            targetPanoramaId: 'living_room',
            position: [14.7, 0.4, 13.6],
          },
          {
            id: 'hs_kitchen_info_table',
            type: 'INFO',
            name: 'Wood Dining Table',
            description: 'A large wooden dining table that can comfortably seat 6-8 people, perfect for family meals or entertaining guests.',
            position: [9.4, -4.4, 17.1],
          },
          {
            id: 'hs_kitchen_info_view',
            type: 'INFO',
            name: 'View Ocean & Valley',
            description: 'A stunning view of the ocean and valley, providing a serene backdrop for cooking and dining experiences.',
            position: [-19.1, 0.8, 5.8],
          },
          {
            id: 'hs_kitchen_info_cooking_area',
            type: 'INFO',
            name: 'Cooking Area',
            description: 'Modern cooking area with high-end appliances and ample counter space for preparing delicious meals.',
            position: [19, -0.2, 6.1],
          },
        ],
      },
      {
        id: 'entertainment_room',
        name: 'Phòng Giải Trí',
        imageUrl: require('../assets/images/resort/entertainment_room.jpg'),
        hotspots: [
          {
            id: 'hs_entertainment_to_lounge',
            type: 'NAVIGATION',
            name: 'Living Room',
            targetPanoramaId: 'living_room',
            position: [15.3, 0.9, -12.9],
          },
          {
            id: 'hs_entertainment_info_pool',
            type: 'INFO',
            name: 'Pool Table',
            description: 'Pool table and dartboard for fun and games with friends or family.',
            position: [11.9, -2.4, -15.9],
          },
          {
            id: 'hs_entertainment_info_wifi',
            type: 'INFO',
            name: 'Wifi Area',
            description: 'High-speed Wi-Fi area for streaming, gaming, or working remotely while enjoying the resort amenities.',
            position: [-6.6, -0.7, -18.9],
          },
        ],
      },
    ],
  },

  //Hotel
  hotel_conrad: {
    id: 'hotel_conrad',
    name: 'Conrad Towers Hotel',
    category: 'HOTEL',
    imageUrl: require('../assets/images/hotel/hallway_room.jpg'),
    panoramas: [
      {
        id: 'hallway',
        name: 'Hall Way',
        imageUrl: require('../assets/images/hotel/hallway_room.jpg'),
        hotspots: [
          {
            id: 'hs_hall_to_room101',
            type: 'NAVIGATION',
            name: 'Room 101',
            targetPanoramaId: 'main_room_101',
            position: [12, 0.3, 16]
          },
          {
            id: 'hs_hall_to_room102',
            type: 'NAVIGATION',
            name: 'Room 102',
            targetPanoramaId: 'main_room_102',
            position: [-12, 0.3, -16],
          },
          {
            id: 'hs_hall_info_elevator',
            type: 'INFO',
            name: 'Elevator',
            description: 'An elevator to access other floors of the hotel, conveniently located in the hallway.',
            position: [16, 0, -12],
          },
        ],
      },
      {
        id: 'main_room_101',
        name: 'Main Room',
        imageUrl: require('../assets/images/hotel/101/main_room.jpg'),
        hotspots: [
          {
            id: 'hs_main_to_hall',
            type: 'NAVIGATION',
            name: 'Hall Way',
            targetPanoramaId: 'hallway',
            position: [19.3, -2.3, -4.8],
          },
          {
            id: 'hs_main_to_bath',
            type: 'NAVIGATION',
            name: 'Bathroom',
            targetPanoramaId: 'bath_room_101',
            position: [18, -2.9, -8.2],
          },
          {
            id: 'hs_main_view_window_info',
            type: 'INFO',
            name: 'View Palm Jumeirah',
            description: 'View Palm Jumeirah, best during sunset.',
            position: [1.2, -3.4, 19.7],
          },
        ],
      },
      {
        id: 'bath_room_101',
        name: 'Bathroom',
        imageUrl: require('../assets/images/hotel/101/bath_room.jpg'),
        hotspots: [
          {
            id: 'hs_bath_b_to_main',
            type: 'NAVIGATION',
            name: 'Main Room',
            targetPanoramaId: 'main_room_101',
            position: [19.5, -0.4, -4.3],
          },
          {
            id: 'hs_bath_info_tub',
            type: 'INFO',
            name: 'Marble Stone Bathtub',
            description: 'Marble stone bathtub, perfect for a relaxing soak after a long day.',
            position: [13.9, -7.3, -12.3],
          },
          {
            id: 'hs_bath_info_shower',
            type: 'INFO',
            name: 'Rain Shower',
            description: 'Rain shower with adjustable water pressure and temperature, providing a refreshing experience.',
            position: [-12.9, 14.1, 5.9],
          },
        ],
      },
      {
        id: 'main_room_102',
        name: 'Main Room',
        imageUrl: require('../assets/images/hotel/102/main_room.jpg'),
        hotspots: [
          {
            id: 'hs_main_to_hall',
            type: 'NAVIGATION',
            name: 'Hall Way',
            targetPanoramaId: 'hallway',
            position: [12.8, -0.5, -15.4],
          },
          {
            id: 'hs_main_to_bath',
            type: 'NAVIGATION',
            name: 'Bathroom',
            targetPanoramaId: 'bath_room_102',
            position: [15, 0.4, 13.2],
          },
          {
            id: 'hs_main_to_bed',
            type: 'NAVIGATION',
            name: 'Bedroom',
            targetPanoramaId: 'bed_room',
            position: [-16.9, -0.1, -10.8],
          },
        ],
      },
      {
        id: 'bath_room_102',
        name: 'Bathroom',
        imageUrl: require('../assets/images/hotel/102/bath_room.jpg'),
        hotspots: [
          {
            id: 'hs_bath_to_main',
            type: 'NAVIGATION',
            name: 'Main Room',
            targetPanoramaId: 'main_room_102',
            position: [-0.2, -0.1, -20],
          },
          {
            id: 'hs_bath_info_tub',
            type: 'INFO',
            name: 'Tub & Shower',
            description: 'A modern bathtub with a separate shower area, providing a luxurious bathing experience.',
            position: [-19.4, -1.7, 4.7],
          },
          {
            id: 'hs_bath_info_sink',
            type: 'INFO',
            name: 'Sink & Mirror',
            description: 'A sleek sink with a large mirror, perfect for your daily grooming routine.',
            position: [1.3, 5, 19.3],
          },
        ],
      },
      {
        id: 'bed_room',
        name: 'Bedroom',
        imageUrl: require('../assets/images/hotel/102/bed_room.jpg'),
        hotspots: [
          {
            id: 'hs_bedroom_to_main',
            type: 'NAVIGATION',
            name: 'Main Room',
            targetPanoramaId: 'main_room_102',
            position: [-15.2, -1.5, 12.9],
          },
          {
            id: 'hs_bedroom_info_tv',
            type: 'INFO',
            name: 'TV 4K',
            description: 'TV 4K and free Netflix subscription for your entertainment.',
            position: [-2.8, -3.3, -19.5],
          },
          {
            id: 'hs_bedroom_info_city',
            type: 'INFO',
            name: 'View ocean & city skyline',
            description: 'View ocean & city skyline, perfect for enjoying the sunset and city lights.',
            position: [18.8, 6.7, -0.9],
          },
        ],
      },
    ],
  },
};
