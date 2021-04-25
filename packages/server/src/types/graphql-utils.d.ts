export interface ResolverMap {
    [key: string]: {
        [key: string]: (
            parent: any,
            arguments: any,
            context: {},
            info: any
        ) => any;
    };
}
