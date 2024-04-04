'use client';
import * as d3 from 'd3';
import {
  BASE_HSL,
  HUE_OPTIONS
} from '../generic/components/color/color-context';
import { BaseType, Chord, ChordGroup, ChordSubgroup } from 'd3';

export default function ArcChart({ data }: { data: number[][] }) {
  const width = 640;
  const height = width;
  const outerRadius = Math.min(width, height) * 0.5 - 30;
  const innerRadius = outerRadius - 20;
  const sum = d3.sum(data.flat());
  const tickStep = d3.tickStep(0, sum, 100);
  const tickStepMajor = d3.tickStep(0, sum, 20);
  const formatValue = d3.formatPrefix(',.0', tickStep);

  const chord = d3
    .chord()
    .padAngle(20 / innerRadius)
    .sortGroups(d3.descending)
    .sortSubgroups(d3.ascending);

  const arc = d3
    .arc<ChordGroup>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const ribbon = d3.ribbon<Chord, ChordSubgroup>().radius(innerRadius);

  const ribbonGenerator = ribbon.context(null) as (d: Chord) => string;

  const chords = chord(data);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`${-width / 2}, ${-height / 2} ${width} ${height}`}
      style={{ maxWidth: '100%', height: 'auto', font: '10px sans-serif' }}
    >
      <defs>
        {chords.map((chord, index) => {
          const id = `gradient-${index}`;
          const startColor =
            BASE_HSL[HUE_OPTIONS[chord.target.index % HUE_OPTIONS.length].id]
              .cssHSLA;
          const endColor =
            BASE_HSL[HUE_OPTIONS[chord.source.index % HUE_OPTIONS.length].id]
              .cssHSLA;
          return (
            <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%" key={id}>
              <stop offset="0%" style={{ stopColor: startColor }} />
              <stop offset="100%" style={{ stopColor: endColor }} />
            </linearGradient>
          );
        })}
      </defs>
      {/* Render the arcs */}
      {chords.groups.map((group, index) => (
        <path
          key={index}
          d={arc(group) || ''}
          fill={BASE_HSL[HUE_OPTIONS[index % HUE_OPTIONS.length].id].cssHSLA} // Modify this line to use HUE_OPTIONS if needed
          stroke={BASE_HSL[HUE_OPTIONS[index % HUE_OPTIONS.length].id].cssHSLA}
        />
      ))}

      {/* Render the ribbons */}
      {chords.map((d, index) => {
        const gradientId = `url(#gradient-${index})`;
        return (
          <path
            key={index}
            d={ribbonGenerator(d)}
            fill={gradientId}
            stroke={
              BASE_HSL[HUE_OPTIONS[d.target.index % HUE_OPTIONS.length].id]
                .cssHSLA
            }
          />
        );
      })}
    </svg>
  );
}
