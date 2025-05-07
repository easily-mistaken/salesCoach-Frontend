import api from "@/utils/axios";

const uploadAsset = async ( content: string, type: "FILE" | "TEXT", organizationId: string ) => {
    const response = await api.post('/api/callasset', { 
        content, type, organizationId, 
     });
    return response.data;
};

const deleteAsset = async (id: string ) => {
    const response = await api.delete(`/api/callasset/${id}`);
    return response.data;
}

export { uploadAsset, deleteAsset };