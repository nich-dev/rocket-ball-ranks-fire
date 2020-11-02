declare module StatModels {

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
    }

    export interface DivisionMetadata {
        name: string;
        deltaDown?: number;
        deltaUp?: number;
    }

    export interface Division {
        metadata: DivisionMetadata;
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
        expiryDate: Date;
        stats: Stats;
    }

    export interface Profile {
        platformInfo: PlatformInfo;
        segments: Segment[];
    }

    export interface StandardProfiles {
        profile: Profile;
    }

    export interface Stats {
        standardProfiles: StandardProfiles;
    }

}

