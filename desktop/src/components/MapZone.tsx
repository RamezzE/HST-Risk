// MapZone.tsx
import React from 'react';
import { Polygon, Marker } from '@react-google-maps/api';

type Point = {
    lat: number;
    lng: number;
};

type MapZoneProps = {
    points: Point[];
    color: string;
    label: string;
    onMarkerPress: () => void;
};

import { OverlayView } from '@react-google-maps/api';




const MapZone: React.FC<MapZoneProps> = ({ points, color, label, onMarkerPress }) => {
    let strokeColor = '#000000';

    if (
        [
            'South Africa',
            'Congo',
            'Central Africa',
            'Egypt',
            'North Africa',
            'Madagascar',
        ].includes(label)
    ) {
        strokeColor = '#000';
    } else if (
        [
            'New Zealand',
            'Western Australia',
            'Eastern Australia',
            'New Guinea',
            'Indonesia',
        ].includes(label)
    ) {
        strokeColor = '#000';
    } else if (
        [
            'Brazil',
            'Venezuela',
            'Peru',
            'Bolivia',
            'Chile',
            'Argentina',
            'Paraguay',
        ].includes(label)
    ) {
        strokeColor = '#fff';
    } else if (
        [
            'Greenland',
            'Honduras',
            'Mexico',
            'Western US',
            'Eastern US',
            'Cuba',
            'Quebec',
            'Canada',
            'Alaska',
            'Northwest Territories',
        ].includes(label)
    ) {
        strokeColor = '#000';
    } else if (
        [
            'Russia',
            'Japan',
            'Iceland',
            'China',
            'Mongolia',
            'Korea',
            'India',
            'Kazakhstan',
            'Middle East',
            'Northern Europe',
            'Britain',
            'Europe',
        ].includes(label)
    ) {
        strokeColor = '#fff';
    }

    const calculateCenter = (coordinates: Point[]) => {
        let latSum = 0;
        let lngSum = 0;
        coordinates.forEach((coord) => {
            latSum += coord.lat;
            lngSum += coord.lng;
        });
        return {
            lat: latSum / coordinates.length,
            lng: lngSum / coordinates.length,
        };
    };

    const polygonCenter = calculateCenter(points);

    return (
        <>
            <Polygon
                paths={points}
                options={{
                    strokeColor: strokeColor,
                    fillColor: `${color}95`,
                    strokeWeight: 2,
                    clickable: true,
                }}
            />

            {label !== '' && (
                <OverlayView
                    position={polygonCenter}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div
                        style={{
                            backgroundColor: 'black',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            opacity: 0.7,
                            whiteSpace: 'nowrap',
                            fontSize: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            // Center the label horizontally and position above the point
                            transform: 'translate(-50%, -100%)',
                            position: 'absolute',
                        }}
                        onClick={onMarkerPress}
                    >
                        {label}
                    </div>
                </OverlayView>
            )}

        </>
    );
};

export default MapZone;
