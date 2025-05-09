export default interface Pages {
    name: string;
    api: string;
    key_index?: number | null;
    allowedRoles?: string[] | null;
};
