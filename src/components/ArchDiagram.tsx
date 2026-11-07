"use client";

import { useState } from "react";
import { ArchNode, ArchEdge } from "@/data/caseStudies";

interface ArchDiagramProps {
  nodes: readonly ArchNode[];
  edges: readonly ArchEdge[];
  ariaLabel: string;
}

export function ArchDiagram({ nodes, edges, ariaLabel }: ArchDiagramProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="w-full border border-line bg-panel/50 rounded-md p-4 overflow-x-auto">
      <div className="min-w-[640px]">
        <svg
          viewBox="0 0 720 230"
          role="img"
          aria-label={ariaLabel}
          className="w-full h-auto select-none"
        >
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--color-muted)" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--color-fg)" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, idx) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;

            const fw = from.w ?? 140;
            const fh = from.h ?? 52;
            const tw = to.w ?? 140;
            const th = to.h ?? 52;

            let startX: number;
            let startY: number;
            let endX: number;
            let endY: number;

            if (from.x !== to.x) {
              if (from.x < to.x) {
                startX = from.x + fw;
                startY = from.y + fh / 2;
                endX = to.x;
                endY = to.y + th / 2;
              } else {
                startX = from.x;
                startY = from.y + fh / 2;
                endX = to.x + tw;
                endY = to.y + th / 2;
              }
            } else {
              if (from.y < to.y) {
                startX = from.x + fw / 2;
                startY = from.y + fh;
                endX = to.x + tw / 2;
                endY = to.y;
              } else {
                startX = from.x + fw / 2;
                startY = from.y;
                endX = to.x + tw / 2;
                endY = to.y + th;
              }
            }

            const isEdgeActive =
              activeNodeId === edge.from || activeNodeId === edge.to;
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;

            return (
              <g key={`${edge.from}-${edge.to}-${idx}`}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={
                    isEdgeActive ? "var(--color-fg)" : "var(--color-muted)"
                  }
                  strokeWidth="1"
                  markerEnd={
                    isEdgeActive ? "url(#arrow-active)" : "url(#arrow-default)"
                  }
                  className="transition-[stroke] duration-120"
                />
                {edge.label && (
                  <g>
                    <rect
                      x={midX - 22}
                      y={midY - 9}
                      width="44"
                      height="18"
                      fill="var(--color-bg)"
                      stroke="var(--color-line)"
                      strokeWidth="0.5"
                      rx="2"
                    />
                    <text
                      x={midX}
                      y={midY + 3.5}
                      textAnchor="middle"
                      fill="var(--color-muted)"
                      className="font-mono text-[10px]"
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const w = node.w ?? 140;
            const h = node.h ?? 52;
            const isNodeActive = activeNodeId === node.id;

            return (
              <g
                key={node.id}
                tabIndex={0}
                onMouseEnter={() => setActiveNodeId(node.id)}
                onMouseLeave={() => setActiveNodeId(null)}
                onFocus={() => setActiveNodeId(node.id)}
                onBlur={() => setActiveNodeId(null)}
                className="cursor-pointer focus:outline-none"
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={w}
                  height={h}
                  rx="4"
                  fill="var(--color-panel)"
                  stroke={
                    isNodeActive ? "var(--color-fg)" : "var(--color-line)"
                  }
                  strokeWidth="1"
                  className="transition-[stroke] duration-120"
                />
                <text
                  x={node.x + w / 2}
                  y={node.sub ? node.y + h / 2 - 4 : node.y + h / 2 + 4}
                  textAnchor="middle"
                  fill="var(--color-fg)"
                  className="font-mono text-[12px] font-medium"
                >
                  {node.label}
                </text>
                {node.sub && (
                  <text
                    x={node.x + w / 2}
                    y={node.y + h / 2 + 12}
                    textAnchor="middle"
                    fill="var(--color-muted)"
                    className="font-mono text-[10px]"
                  >
                    {node.sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

