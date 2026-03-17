import { COL_W, ROW_H } from '../constants';
import type { Status } from '../types';

interface SvgArrowProps {
  fromCol: number;
  toCol: number;
  totalCols: number;
  isResponse: boolean;
  status: Status;
}

export default function SvgArrow({ fromCol, toCol, totalCols, isResponse, status }: SvgArrowProps) {
  const isSelf = fromCol === toCol;
  const w = totalCols * COL_W;
  const y = ROW_H / 2;
  const color = status === 'error' ? '#ef4444' : status === 'pending' ? '#f59e0b' : '#94a3b8';

  if (isSelf) {
    const cx = fromCol * COL_W + COL_W / 2;
    return (
      <svg width={w} height={ROW_H}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 3 }}>
        <path d={`M ${cx + 6} ${y - 12} H ${cx + 30} V ${y + 12} H ${cx + 6}`}
          fill="none" stroke={color} strokeWidth={1.5}
          strokeDasharray={isResponse ? '5 3' : undefined} />
        <polygon points={`${cx + 6},${y + 12} ${cx + 12},${y + 8} ${cx + 12},${y + 16}`} fill={color} />
      </svg>
    );
  }

  const fromX = fromCol * COL_W + COL_W / 2;
  const toX = toCol * COL_W + COL_W / 2;
  const dir = toX > fromX ? 1 : -1;
  const x1 = fromX + dir * 6;
  const x2 = toX - dir * 6;

  return (
    <svg width={w} height={ROW_H}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 3 }}>
      <line x1={x1} y1={y} x2={x2 - dir * 7} y2={y}
        stroke={color} strokeWidth={1.5}
        strokeDasharray={isResponse ? '6 3' : undefined} />
      <polygon
        points={dir > 0
          ? `${x2},${y} ${x2 - 7},${y - 4} ${x2 - 7},${y + 4}`
          : `${x2},${y} ${x2 + 7},${y - 4} ${x2 + 7},${y + 4}`}
        fill={color} />
      <circle cx={fromX} cy={y} r={3} fill={color} />
    </svg>
  );
}
