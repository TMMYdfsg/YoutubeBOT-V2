import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
});

let liveChatId = null;

export async function getLiveChatMessages() {
    try {
        if (!liveChatId) {
            const live = await youtube.search.list({
                channelId: process.env.CHANNEL_ID,
                eventType: "live",
                type: "video",
                part: "snippet",
            });
            const videoId = live.data.items[0]?.id?.videoId;
            if (!videoId) return [];

            const videoDetail = await youtube.videos.list({
                id: videoId,
                part: "liveStreamingDetails",
            });
            liveChatId = videoDetail.data.items[0]?.liveStreamingDetails?.activeLiveChatId;
        }

        const res = await youtube.liveChatMessages.list({
            liveChatId,
            part: "snippet,authorDetails",
        });

        return res.data.items.map((item) => ({
            user: item.authorDetails.displayName,
            text: item.snippet.displayMessage,
        }));
    } catch (e) {
        console.error("Error fetching chat:", e);
        return [];
    }
}