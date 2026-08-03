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

    const [currentId, setCurrentId] = useState<string>(initialPanoId);
    const [selectedInfo, setSelectedInfo] = useState<Hotspot | null>(null);

    useEffect(() => {
        setCurrentId(initialPanoId);
    }, [initialPanoId]);

    const currentData = panoramaMap.get(currentId) || defaultPanorama;
    const { panorama: currentPano, room: currentRoom } = currentData;

    const handleHotspotPress = (hs: Hotspot) => {
        if (hs.type === 'NAVIGATION' && hs.targetPanoramaId) {
            if (panoramaMap.has(hs.targetPanoramaId)) {
                setCurrentId(hs.targetPanoramaId);
            }
        } else if (hs.type === 'INFO') {
            setSelectedInfo(hs);
        }
    };

    return {
        currentPano,
        currentRoom,
        selectedInfo,
        setSelectedInfo,
        handleHotspotPress,
    };
}