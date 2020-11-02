export interface PlatformInfo {
    platformSlug: string;
    platformUserId?: any;
    platformUserHandle: string;
    platformUserIdentifier: string;
    avatarUrl: string;
    additionalParameters?: any;
}


export interface Attributes {
    playlistId?: number;
    season?: number;
}

export interface TierMetadata {
    name: string;
}

export interface Tier {
    metadata: TierMetadata;
    value: number;
}

export interface DivisionMetadata {
    name: string;
    deltaDown?: number;
    deltaUp?: number;
}

export interface Division {
    metadata: DivisionMetadata;
    value: number;
}

export interface Rating {
    rank: number;
    value: number;
}

export interface PlaylistStats {
    tier: Tier;
    division: Division;
    rating: Rating;
}

export interface SegmentMetadata {
    name: string;
}

export interface Segment {
    type: string;
    attributes: Attributes;
    metadata: SegmentMetadata;
    stats: PlaylistStats;
}

export interface Profile {
    platformInfo: PlatformInfo;
    segments: Segment[];
}

export interface Playlist {
    id: number;
    name: string;
    rank: number;
    tierName: string;
    tier: number;
    divisionName: string;
    divison: number;
}

export interface Account {
    username: string;
    id: string;
    avatar: string;
    playlists: Playlist[];
    timestamp?: number;
}
