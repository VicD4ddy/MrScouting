'use client';

import {
    Radar,
    RadarChart as ReRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from 'recharts';

interface RadarData {
    attribute: string;
    value: number;
}

interface RadarChartProps {
    data: RadarData[];
}

export function RadarChart({ data }: RadarChartProps) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <ReRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#252b46" />
                    <PolarAngleAxis dataKey="attribute" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Jugador"
                        dataKey="value"
                        stroke="#bef264"
                        fill="#bef264"
                        fillOpacity={0.3}
                    />
                </ReRadarChart>
            </ResponsiveContainer>
        </div>
    );
}
