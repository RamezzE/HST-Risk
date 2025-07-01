import React from 'react';
import { GiCrossedSwords } from 'react-icons/gi';

type Props = {
  item: any;
  getTeamColor: (countryName: string) => string;
};

function hexToRgba(hex: string, alpha: number) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }

  const bigint = parseInt(c, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const AttackOverlayCard: React.FC<Props> = ({ item, getTeamColor }) => {
  const leftColor = hexToRgba(getTeamColor(item.attacking_zone), 0.75);
  const rightColor = hexToRgba(getTeamColor(item.defending_zone), 0.75);

  const textStyle = {
    color: 'white',
    textAlign: 'center' as const,
    fontWeight: 600,
    fontSize: '28px',
    textShadow: '0 0 2px black, 0 0 2px black, 2px 2px 2px black',
  };

  return (
    <div
      style={{
        boxShadow: '0 2px 6px rgba(0,0,0,0.7)',
        borderRadius: '8px',
        width: '100%',
        overflow: 'hidden',
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
        }}
      >
        {/* Attacking Team */}
        <div
          style={{
            flex: 1,
            backgroundColor: leftColor,
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={textStyle}>
            {item.attacking_team}
            {item.attacking_subteam}
          </span>
        </div>

        {/* Defending Team */}
        <div
          style={{
            flex: 1,
            backgroundColor: rightColor,
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={textStyle}>
            {item.defending_team}
            {item.defending_subteam}
          </span>
        </div>

        {/* Sword Icon (absolute center) */}
        <GiCrossedSwords
          size={24}
          color="white"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'drop-shadow(1px 1px 1px black)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      </div>

      {/* War Name */}
      <div
        style={{
          padding: '6px 10px',
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#ddd',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {item.war}
      </div>
    </div>
  );
};

export default AttackOverlayCard;