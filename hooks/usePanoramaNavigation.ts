import { Hotspot, PANORAMA_DATA, PanoramaData, Room } from '@/constants/data';
import { useEffect, useMemo, useState } from 'react';

interface UsePanoramaNavigationParams {
    roomId?: string;
    panoramaId?: string;
}

export function usePanoramaNavigation({ roomId, panoramaId }: UsePanoramaNavigationParams) {
    const { panoramaMap, defaultPanorama } = useMemo(() => {
        const map = new Map<string, { panorama: PanoramaData; room: Room }>();
        let fallback: { panorama: PanoramaData; room: Room } | null = null;

        Object.values(PANORAMA_DATA).forEach((room) => {
            room.panoramas.forEach((pano) => {
                const item = { panorama: pano, room };
                map.set(pano.id, item);
                if (!fallback) fallback = item;
            });
        });

        return { panoramaMap: map, defaultPanorama: fallback! };
    }, []);

    const initialPanoId = useMemo(() => {
        if (panoramaId && panoramaMap.has(panoramaId)) {
            return panoramaId;
        }
        if (roomId && PANORAMA_DATA[roomId]?.panoramas.length > 0) {
            return PANORAMA_DATA[roomId].panoramas[0].id;
        }
        return defaultPanorama.panorama.id;
    }, [panoramaId, roomId, panoramaMap, defaultPanorama]);

    // Stack lịch sử panorama trong phạm vi 1 lượt xem resort/hotel: mỗi lần
    // bấm hotspot NAVIGATION sẽ push thêm panorama đích vào cuối stack thay vì
    // thay thế, để nút "Return" có thể pop lại đúng panorama vừa đi qua (giống
    // history back của trình duyệt, không gộp trùng các panorama đã ghé qua).
    const [stack, setStack] = useState<string[]>([initialPanoId]);
    const [selectedInfo, setSelectedInfo] = useState<Hotspot | null>(null);

    useEffect(() => {
        // roomId/panoramaId chỉ đổi khi vào lại /viewer từ đầu (bấm resort/hotel
        // khác ở Home) -> reset thành stack mới bắt đầu từ panorama đó.
        setStack([initialPanoId]);
    }, [initialPanoId]);

    const currentId = stack[stack.length - 1];
    const currentData = panoramaMap.get(currentId) || defaultPanorama;
    const { panorama: currentPano, room: currentRoom } = currentData;
    const canGoBack = stack.length > 1;

    const handleHotspotPress = (hs: Hotspot) => {
        if (hs.type === 'NAVIGATION' && hs.targetPanoramaId) {
            if (panoramaMap.has(hs.targetPanoramaId)) {
                setStack((prev) => [...prev, hs.targetPanoramaId!]);
            }
        } else if (hs.type === 'INFO') {
            setSelectedInfo(hs);
        }
    };

    const goBack = () => {
        setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    };

    const getPanoramaById = (id: string): PanoramaData | undefined => panoramaMap.get(id)?.panorama;

    return {
        currentPano,
        currentRoom,
        selectedInfo,
        setSelectedInfo,
        handleHotspotPress,
        getPanoramaById,
        canGoBack,
        goBack,
    };
}