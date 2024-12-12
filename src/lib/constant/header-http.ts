import cookies  from "js-cookie";


export const authHeader = () => {
    return {
        'Authorization': `Bearer ${cookies.get('token')}`
    }
}
