import { NextResponse } from "next/server";
import { INITIAL_GLOBAL_NODES } from "@/config/servers";

export async function GET() {
  return NextResponse.json({
    success: true,
    engine: "Pingly-Global-v2",
    totalNodes: INITIAL_GLOBAL_NODES.length,
    nationalNodes: INITIAL_GLOBAL_NODES.filter((n) => n.category === "nasional").length,
    internationalNodes: INITIAL_GLOBAL_NODES.filter((n) => n.category === "internasional").length,
    nodes: INITIAL_GLOBAL_NODES,
  });
}
