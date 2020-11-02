import { JSON_KEYS } from './config/config';
import { Profile, Playlist, Segment, Account } from './models';


function getProfile(initialState: any): Profile {
    const profiles = initialState[JSON_KEYS.stats2][JSON_KEYS.profiles];
    return profiles[Object.keys(profiles)[0]];
}

function getPlaylists(initialState: any): Playlist[] {
    const segments = getProfile(initialState).segments;
    const playlists: Playlist[] = [];
    for (let i = 0; i < segments.length; i++) {
        const segment: Segment = segments[i];
        if (segment.type === JSON_KEYS.playlistType) {
            const playlist: Playlist = {
                id: segment.attributes.playlistId ? segment.attributes.playlistId : 0,
                name: segment.metadata.name,
                rank: segment.stats.rating.value,
                tierName: segment.stats.tier.metadata.name,
                tier: segment.stats.tier.value,
                divisionName: segment.stats.division.metadata.name,
                divison: segment.stats.division.value,
            };
            playlists.push(playlist);
        }
    }
    return playlists.sort((a, b) => a.id - b.id);
}

export function initialStateToAccount(initialState: any): Account {
    const userInfo = getProfile(initialState).platformInfo;
    return {
        id: userInfo.platformUserIdentifier,
        username: userInfo.platformUserHandle,
        avatar: userInfo.avatarUrl,
        playlists: getPlaylists(initialState),
        timestamp: Date.now()
    };
}
