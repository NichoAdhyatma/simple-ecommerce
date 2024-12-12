import {ProfileForm} from "@/components/profile/profile-form";
import {getUserProfile} from "@/app/action/get-user";


export default async function page() {
    const userProfile = await getUserProfile();

    return (
        <div className="container mx-auto py-10">
            <ProfileForm userProfile={userProfile}/>
        </div>
    )
}

