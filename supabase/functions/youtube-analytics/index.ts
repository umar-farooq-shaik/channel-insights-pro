import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BodySchema = z.object({
  channelUrl: z.string().min(1).max(500),
});

function extractChannelIdentifier(url: string): { type: "id" | "handle" | "username"; value: string } | null {
  const trimmed = url.trim();

  // Handle format: https://www.youtube.com/channel/UC...
  const channelIdMatch = trimmed.match(/youtube\.com\/channel\/(UC[\w-]+)/i);
  if (channelIdMatch) return { type: "id", value: channelIdMatch[1] };

  // Handle format: https://www.youtube.com/@handle
  const handleMatch = trimmed.match(/youtube\.com\/@([\w.-]+)/i);
  if (handleMatch) return { type: "handle", value: handleMatch[1] };

  // Handle format: https://www.youtube.com/c/ChannelName or /user/Username
  const userMatch = trimmed.match(/youtube\.com\/(?:c|user)\/([\w.-]+)/i);
  if (userMatch) return { type: "username", value: userMatch[1] };

  // Bare handle like @handle
  if (trimmed.startsWith("@")) return { type: "handle", value: trimmed.slice(1) };

  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "YOUTUBE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid input", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const identifier = extractChannelIdentifier(parsed.data.channelUrl);
    if (!identifier) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid YouTube channel URL. Use format: https://www.youtube.com/@channelname" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Resolve channel ID
    let channelId: string;
    if (identifier.type === "id") {
      channelId = identifier.value;
    } else {
      // Search by handle or username
      const searchParam = identifier.type === "handle" ? `@${identifier.value}` : identifier.value;
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(searchParam)}&maxResults=1&key=${apiKey}`
      );
      const searchData = await searchRes.json();
      if (!searchRes.ok) {
        throw new Error(`YouTube search API failed [${searchRes.status}]: ${JSON.stringify(searchData)}`);
      }
      if (!searchData.items?.length) {
        return new Response(
          JSON.stringify({ success: false, error: "Channel not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      channelId = searchData.items[0].snippet.channelId;
    }

    // Step 2: Get channel details
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    );
    const channelData = await channelRes.json();
    if (!channelRes.ok) {
      throw new Error(`YouTube channels API failed [${channelRes.status}]: ${JSON.stringify(channelData)}`);
    }
    if (!channelData.items?.length) {
      return new Response(
        JSON.stringify({ success: false, error: "Channel not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ch = channelData.items[0];
    const channel = {
      id: ch.id,
      name: ch.snippet.title,
      avatar: ch.snippet.thumbnails?.medium?.url || ch.snippet.thumbnails?.default?.url || "",
      followers: parseInt(ch.statistics.subscriberCount || "0", 10),
      totalViews: parseInt(ch.statistics.viewCount || "0", 10),
      videoCount: parseInt(ch.statistics.videoCount || "0", 10),
    };

    // Step 3: Get recent videos
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=12&key=${apiKey}`
    );
    const videosData = await videosRes.json();
    if (!videosRes.ok) {
      throw new Error(`YouTube search videos API failed [${videosRes.status}]: ${JSON.stringify(videosData)}`);
    }

    const videoIds = (videosData.items || []).map((v: any) => v.id.videoId).filter(Boolean).join(",");

    let videos: any[] = [];
    if (videoIds) {
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`
      );
      const statsData = await statsRes.json();
      if (!statsRes.ok) {
        throw new Error(`YouTube videos API failed [${statsRes.status}]: ${JSON.stringify(statsData)}`);
      }

      videos = (statsData.items || []).map((v: any) => ({
        id: v.id,
        title: v.snippet.title,
        thumbnail: v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.medium?.url || "",
        views: parseInt(v.statistics.viewCount || "0", 10),
        likes: parseInt(v.statistics.likeCount || "0", 10),
        comments: parseInt(v.statistics.commentCount || "0", 10),
        publishedAt: v.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${v.id}`,
      }));
    }

    // Calculate averages
    const totalLikes = videos.reduce((sum: number, v: any) => sum + v.likes, 0);
    const totalComments = videos.reduce((sum: number, v: any) => sum + v.comments, 0);
    const totalViews = videos.reduce((sum: number, v: any) => sum + v.views, 0);
    const count = videos.length || 1;

    const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

    return new Response(
      JSON.stringify({
        success: true,
        channel: {
          ...channel,
          engagementRate: Math.round(engagementRate * 100) / 100,
          averageLikes: Math.round((totalLikes / count) * 100) / 100,
          averageComments: Math.round((totalComments / count) * 100) / 100,
        },
        videos,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("YouTube API error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
